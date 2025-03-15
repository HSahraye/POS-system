import { Router, Request, Response } from 'express';
import { getRepository, DeepPartial } from 'typeorm';
import Stripe from 'stripe';
import { Order, OrderStatus } from '../models/Order';
import { Payment, PaymentMethod, PaymentStatus } from '../models/Payment';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validateRole } from '../middleware/validateRole';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia'
});

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create payment intent
router.post('/create-intent', async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: { orderId }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment intent', error });
  }
});

// Confirm payment
router.post('/confirm/:orderId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      const orderRepository = getRepository(Order);
      const paymentRepository = getRepository(Payment);

      const order = await orderRepository.findOne({ where: { id: orderId } });
      
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }

      // Create payment record
      const payment = paymentRepository.create({
        order,
        amount: paymentIntent.amount / 100, // Convert from cents
        paymentMethod: PaymentMethod.CREDIT_CARD,
        transactionId: paymentIntent.id,
        status: PaymentStatus.COMPLETED
      });

      await paymentRepository.save(payment);

      // Update order status
      order.status = OrderStatus.COMPLETED;
      await orderRepository.save(order);

      res.json({ message: 'Payment confirmed', payment });
    } else {
      res.status(400).json({ message: 'Payment not succeeded' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error confirming payment', error });
  }
});

// Process refund
router.post('/refund/:orderId', validateRole(['ADMIN', 'MANAGER']), async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { amount, reason } = req.body;

    const paymentRepository = getRepository(Payment);
    const orderRepository = getRepository(Order);

    const payment = await paymentRepository.findOne({
      where: { 
        order: { id: orderId },
        status: PaymentStatus.COMPLETED
      }
    });

    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }

    const refund = await stripe.refunds.create({
      payment_intent: payment.transactionId!,
      amount: Math.round(amount * 100) // Convert to cents
    });

    if (refund.status === 'succeeded') {
      // Create refund payment record
      const order = await orderRepository.findOne({ where: { id: orderId } });
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }

      const refundPayment = paymentRepository.create({
        order,
        amount: -amount, // Negative amount for refund
        paymentMethod: payment.paymentMethod,
        transactionId: refund.id,
        status: PaymentStatus.COMPLETED
      });

      await paymentRepository.save(refundPayment);

      // Update order status
      order.status = OrderStatus.REFUNDED;
      await orderRepository.save(order);

      res.json({ message: 'Refund processed', refund: refundPayment });
    } else {
      res.status(400).json({ message: 'Refund failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error processing refund', error });
  }
});

// Get all payments (admin/manager only)
router.get('/', validateRole(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const paymentRepository = getRepository(Payment);
    const payments = await paymentRepository.find({
      relations: ['order', 'order.customer'],
      order: { createdAt: 'DESC' }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error });
  }
});

// Get payment by ID
router.get('/:id', validateRole(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const paymentRepository = getRepository(Payment);
    const payment = await paymentRepository.findOne({
      where: { id },
      relations: ['order', 'order.customer']
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment', error });
  }
});

// Update payment status
router.patch('/:id/status', validateRole(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(PaymentStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const paymentRepository = getRepository(Payment);
    const payment = await paymentRepository.findOne({
      where: { id },
      relations: ['order']
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update payment status
    const updatedPayment: DeepPartial<Payment> = {
      ...payment,
      status: status as PaymentStatus,
      paymentDetails: status === PaymentStatus.COMPLETED ? {
        ...payment.paymentDetails,
        authorizationCode: `AUTH-${Date.now()}`,
        receiptUrl: `https://receipts.example.com/${payment.id}`
      } : payment.paymentDetails
    };

    await paymentRepository.save(updatedPayment);

    // Check if order is fully paid
    if (status === PaymentStatus.COMPLETED) {
      const orderRepository = getRepository(Order);
      const order = await orderRepository.findOne({
        where: { id: payment.orderId },
        relations: ['payments']
      });

      if (order) {
        const totalPaid = order.payments
          .filter(p => p.status === PaymentStatus.COMPLETED)
          .reduce((sum, p) => sum + Number(p.amount), 0);

        if (totalPaid >= Number(order.total)) {
          const updatedOrder: DeepPartial<Order> = {
            ...order,
            status: OrderStatus.COMPLETED
          };
          await orderRepository.save(updatedOrder);
        }
      }
    }

    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment status', error });
  }
});

// Process card payment
router.post('/:id/process-card', validateRole(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { cardLast4, cardBrand } = req.body;

    const paymentRepository = getRepository(Payment);
    const payment = await paymentRepository.findOne({
      where: { id },
      relations: ['order']
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (![PaymentMethod.CREDIT_CARD, PaymentMethod.DEBIT_CARD].includes(payment.paymentMethod)) {
      return res.status(400).json({ message: 'Payment method must be credit or debit card' });
    }

    // Here you would integrate with your payment gateway
    // For now, we'll simulate a successful card payment
    const updatedPayment: DeepPartial<Payment> = {
      ...payment,
      status: PaymentStatus.COMPLETED,
      paymentDetails: {
        cardLast4,
        cardBrand,
        authorizationCode: `AUTH-${Date.now()}`,
        receiptUrl: `https://receipts.example.com/${payment.id}`
      }
    };

    await paymentRepository.save(updatedPayment);

    // Check if order is fully paid
    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({
      where: { id: payment.orderId },
      relations: ['payments']
    });

    if (order) {
      const totalPaid = order.payments
        .filter(p => p.status === PaymentStatus.COMPLETED)
        .reduce((sum, p) => sum + Number(p.amount), 0);

      if (totalPaid >= Number(order.total)) {
        const updatedOrder: DeepPartial<Order> = {
          ...order,
          status: OrderStatus.COMPLETED
        };
        await orderRepository.save(updatedOrder);
      }
    }

    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: 'Error processing card payment', error });
  }
});

// Process cash payment
router.post('/:id/process-cash', validateRole(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { amountTendered } = req.body;

    const paymentRepository = getRepository(Payment);
    const payment = await paymentRepository.findOne({
      where: { id },
      relations: ['order']
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.paymentMethod !== PaymentMethod.CASH) {
      return res.status(400).json({ message: 'Payment method must be cash' });
    }

    const tenderedAmount = Number(amountTendered);
    if (tenderedAmount < Number(payment.amount)) {
      return res.status(400).json({ message: 'Insufficient amount tendered' });
    }

    // Process cash payment
    const updatedPayment: DeepPartial<Payment> = {
      ...payment,
      status: PaymentStatus.COMPLETED,
      paymentDetails: {
        authorizationCode: `CASH-${Date.now()}`,
        receiptUrl: `https://receipts.example.com/${payment.id}`
      }
    };

    await paymentRepository.save(updatedPayment);

    // Check if order is fully paid
    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({
      where: { id: payment.orderId },
      relations: ['payments']
    });

    if (order) {
      const totalPaid = order.payments
        .filter(p => p.status === PaymentStatus.COMPLETED)
        .reduce((sum, p) => sum + Number(p.amount), 0);

      if (totalPaid >= Number(order.total)) {
        const updatedOrder: DeepPartial<Order> = {
          ...order,
          status: OrderStatus.COMPLETED
        };
        await orderRepository.save(updatedOrder);
      }
    }

    res.json({
      payment: updatedPayment,
      change: tenderedAmount - Number(payment.amount)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing cash payment', error });
  }
});

export default router; 
import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Order, OrderStatus } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { Product } from '../models/Product';
import { Payment, PaymentMethod, PaymentStatus } from '../models/Payment';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validateRole } from '../middleware/validateRole';
import { EmailService } from '../services/email.service';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all orders (admin/manager/employee only)
router.get('/', validateRole(['ADMIN', 'MANAGER', 'EMPLOYEE']), async (req: AuthRequest, res) => {
  try {
    const orderRepository = getRepository(Order);
    const orders = await orderRepository.find({
      relations: ['customer', 'items', 'items.product', 'payments'],
      order: { createdAt: 'DESC' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// Get order by ID
router.get('/:id', validateRole(['ADMIN', 'MANAGER', 'EMPLOYEE']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({
      where: { id },
      relations: ['customer', 'items', 'items.product', 'payments']
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
});

// Create order
router.post('/', validateRole(['ADMIN', 'MANAGER', 'EMPLOYEE']), async (req: AuthRequest, res) => {
  try {
    const {
      customerId,
      items,
      paymentMethod,
      notes,
      isOnlineOrder,
      shippingAddress,
      shippingCost
    } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: 'User ID not found' });
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    const orderRepository = getRepository(Order);
    const orderItemRepository = getRepository(OrderItem);
    const productRepository = getRepository(Product);
    const paymentRepository = getRepository(Payment);

    // Create order
    const newOrder = {
      customerId,
      cashierId: req.user.id,
      status: OrderStatus.PENDING,
      total: 0, // Will be updated after creating items
      isOnlineOrder: isOnlineOrder || false,
      shippingAddress,
      shippingCost: shippingCost || 0,
      metadata: notes ? { notes } : undefined
    };

    const order = orderRepository.create(newOrder);
    await orderRepository.save(order);

    // Create order items and update product stock
    let total = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await productRepository.findOne({ where: { id: item.productId } });
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (product.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      const orderItem = orderItemRepository.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: product.price * item.quantity
      });

      orderItems.push(orderItem);
      total += orderItem.subtotal;

      // Update product stock
      product.stockQuantity -= item.quantity;
      await productRepository.save(product);
    }

    await orderItemRepository.save(orderItems);

    // Update order total
    order.total = total + (shippingCost || 0);
    await orderRepository.save(order);

    // Create initial payment if payment method is provided
    if (paymentMethod) {
      const payment = paymentRepository.create({
        orderId: order.id,
        amount: order.total,
        paymentMethod: paymentMethod as PaymentMethod,
        status: PaymentStatus.PENDING
      });
      await paymentRepository.save(payment);
    }

    // Return order with relations
    const savedOrder = await orderRepository.findOne({
      where: { id: order.id },
      relations: ['customer', 'items', 'items.product', 'payments']
    });

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
});

// Update order status
router.patch('/:id/status', validateRole(['ADMIN', 'MANAGER', 'EMPLOYEE']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product']
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If cancelling order, restore product stock
    if (status === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
      const productRepository = getRepository(Product);
      for (const item of order.items) {
        const product = await productRepository.findOne({ where: { id: item.productId } });
        if (product) {
          product.stockQuantity += item.quantity;
          await productRepository.save(product);
        }
      }
    }

    order.status = status;
    await orderRepository.save(order);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
});

// Add payment to order
router.post('/:id/payments', validateRole(['ADMIN', 'MANAGER', 'EMPLOYEE']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod } = req.body;

    if (!Object.values(PaymentMethod).includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({
      where: { id },
      relations: ['payments']
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Calculate total paid
    const totalPaid = order.payments
      .filter(payment => payment.status === PaymentStatus.COMPLETED)
      .reduce((sum, payment) => sum + Number(payment.amount), 0);

    // Check if payment would exceed order total
    if (totalPaid + Number(amount) > Number(order.total)) {
      return res.status(400).json({ message: 'Payment amount would exceed order total' });
    }

    const paymentRepository = getRepository(Payment);
    const payment = paymentRepository.create({
      orderId: order.id,
      amount: Number(amount),
      paymentMethod,
      status: PaymentStatus.PENDING
    });

    await paymentRepository.save(payment);

    // Update order status if fully paid
    if (totalPaid + Number(amount) === Number(order.total)) {
      order.status = OrderStatus.COMPLETED;
      await orderRepository.save(order);
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding payment', error });
  }
});

// Process refund
router.post('/:id/refund', validateRole(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;

    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({
      where: { id },
      relations: ['payments']
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Find completed payments
    const completedPayments = order.payments.filter(
      payment => payment.status === PaymentStatus.COMPLETED
    );

    // Calculate total refundable amount
    const totalPaid = completedPayments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0
    );

    const refundAmount = Number(amount);

    // Validate refund amount
    if (refundAmount <= 0) {
      return res.status(400).json({ message: 'Invalid refund amount' });
    }

    if (refundAmount > totalPaid) {
      return res.status(400).json({ message: 'Refund amount exceeds total paid amount' });
    }

    // Process refund for each payment until the refund amount is met
    let remainingRefund = refundAmount;
    const refundedPayments = [];

    for (const payment of completedPayments) {
      if (remainingRefund <= 0) break;

      const paymentRepository = getRepository(Payment);
      const refundForPayment = Math.min(Number(payment.amount), remainingRefund);

      const refund = paymentRepository.create({
        amount: refundForPayment,
        paymentMethod: payment.paymentMethod,
        status: PaymentStatus.REFUNDED,
        orderId: order.id,
        notes: reason,
        refundDetails: {
          refundId: `REF-${Date.now()}`,
          refundAmount: refundForPayment,
          refundReason: reason,
          refundDate: new Date()
        }
      });

      await paymentRepository.save(refund);
      refundedPayments.push(refund);
      remainingRefund -= refundForPayment;
    }

    // Update order status if fully refunded
    if (refundAmount === totalPaid) {
      order.status = OrderStatus.REFUNDED;
      await orderRepository.save(order);
    }

    res.status(201).json({
      message: 'Refund processed successfully',
      refundAmount,
      refundedPayments
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing refund', error });
  }
});

export default router; 
import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Customer } from '../models/Customer';
import { Order, OrderStatus, DiscountType } from '../models/Order';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { validateRole } from '../middleware/validateRole';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all customers
router.get('/', validateRole(['ADMIN', 'MANAGER', 'EMPLOYEE']), async (req: AuthRequest, res) => {
  try {
    const customerRepository = getRepository(Customer);
    const customers = await customerRepository.find({
      relations: ['orders'],
      order: { createdAt: 'DESC' }
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
});

// Get customer by ID
router.get('/:id', validateRole(['ADMIN', 'MANAGER', 'EMPLOYEE']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const customerRepository = getRepository(Customer);
    const customer = await customerRepository.findOne({
      where: { id },
      relations: ['orders']
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error });
  }
});

// Create customer
router.post('/', validateRole(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const { firstName, lastName, email, phone, address } = req.body;
    const customerRepository = getRepository(Customer);

    // Check if customer already exists
    const existingCustomer = await customerRepository.findOne({ where: { email } });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    // Create customer
    const customer = customerRepository.create({
      firstName,
      lastName,
      email,
      phone,
      address,
      loyaltyPoints: 0,
      loyaltyTier: 'BRONZE'
    });

    await customerRepository.save(customer);
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error });
  }
});

// Update customer
router.put('/:id', validateRole(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, address } = req.body;
    const customerRepository = getRepository(Customer);

    const customer = await customerRepository.findOne({ where: { id } });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Update customer
    customer.firstName = firstName || customer.firstName;
    customer.lastName = lastName || customer.lastName;
    customer.email = email || customer.email;
    customer.phone = phone || customer.phone;
    customer.address = address || customer.address;

    await customerRepository.save(customer);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error });
  }
});

// Update loyalty points
router.patch('/:id/loyalty', validateRole(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { points } = req.body;
    const customerRepository = getRepository(Customer);

    const customer = await customerRepository.findOne({ where: { id } });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Update loyalty points and tier
    customer.loyaltyPoints += points;
    
    // Update tier based on total points
    if (customer.loyaltyPoints >= 1000) {
      customer.loyaltyTier = 'PLATINUM';
    } else if (customer.loyaltyPoints >= 500) {
      customer.loyaltyTier = 'GOLD';
    } else if (customer.loyaltyPoints >= 200) {
      customer.loyaltyTier = 'SILVER';
    }

    await customerRepository.save(customer);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating loyalty points', error });
  }
});

// Delete customer (admin only)
router.delete('/:id', validateRole(['ADMIN']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const customerRepository = getRepository(Customer);

    const customer = await customerRepository.findOne({ where: { id } });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customerRepository.remove(customer);
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
});

// Get customer profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customerRepository = getRepository(Customer);
    const customer = await customerRepository.findOne({
      where: { id: req.user?.customerId }
    });

    if (!customer) {
      res.status(404).json({ message: 'Customer profile not found' });
      return;
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer profile', error });
  }
});

// Update customer profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customerRepository = getRepository(Customer);
    const customer = await customerRepository.findOne({
      where: { id: req.user?.customerId }
    });

    if (!customer) {
      res.status(404).json({ message: 'Customer profile not found' });
      return;
    }

    // Only allow updating certain fields
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'address'];
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    customerRepository.merge(customer, updates);
    await customerRepository.save(customer);

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer profile', error });
  }
});

// Get customer orders
router.get('/orders', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orderRepository = getRepository(Order);
    const orders = await orderRepository.find({
      where: { customerId: req.user?.customerId },
      relations: ['items', 'items.product', 'payments'],
      order: {
        createdAt: 'DESC'
      }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer orders', error });
  }
});

// Get customer loyalty points
router.get('/loyalty', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customerRepository = getRepository(Customer);
    const customer = await customerRepository.findOne({
      where: { id: req.user?.customerId },
      select: ['loyaltyPoints', 'loyaltyTier']
    });

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    res.json({
      points: customer.loyaltyPoints,
      tier: customer.loyaltyTier,
      nextTier: customer.loyaltyTier === 'BRONZE' ? 'SILVER' :
                customer.loyaltyTier === 'SILVER' ? 'GOLD' :
                customer.loyaltyTier === 'GOLD' ? 'PLATINUM' : null,
      pointsToNextTier: customer.loyaltyTier === 'BRONZE' ? 1000 - customer.loyaltyPoints :
                       customer.loyaltyTier === 'SILVER' ? 5000 - customer.loyaltyPoints :
                       customer.loyaltyTier === 'GOLD' ? 10000 - customer.loyaltyPoints : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loyalty information', error });
  }
});

// Use loyalty points
router.post('/loyalty/redeem', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { points, orderId } = req.body;
    const customerRepository = getRepository(Customer);
    const customer = await customerRepository.findOne({
      where: { id: req.user?.customerId }
    });

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    if (customer.loyaltyPoints < points) {
      res.status(400).json({ message: 'Insufficient loyalty points' });
      return;
    }

    // Apply points to order
    const orderRepository = getRepository(Order);
    const order = await orderRepository.findOne({
      where: { id: orderId, customerId: customer.id }
    });

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Deduct points and update order
    if (customer.useLoyaltyPoints(points)) {
      order.loyaltyPointsRedeemed = points;
      order.discount = points * 0.01; // Each point is worth $0.01
      order.discountType = DiscountType.LOYALTY_POINTS;
      
      await customerRepository.save(customer);
      await orderRepository.save(order);

      res.json({
        message: 'Points redeemed successfully',
        remainingPoints: customer.loyaltyPoints,
        orderDiscount: order.discount
      });
    } else {
      res.status(400).json({ message: 'Failed to redeem points' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error redeeming loyalty points', error });
  }
});

export default router; 
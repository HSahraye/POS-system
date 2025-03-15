import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/database';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import customerRoutes from './routes/customer.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import { User, UserRole } from './models/User';
import bcrypt from 'bcrypt';

const app = express();
const port = 5001; // Force port 5001

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const existingAdmin = await userRepository.findOne({ where: { email: 'admin@example.com' } });

    if (!existingAdmin) {
      const admin = new User();
      admin.firstName = 'Admin';
      admin.lastName = 'User';
      admin.email = 'admin@example.com';
      admin.password = await bcrypt.hash('admin123', 10);
      admin.role = UserRole.ADMIN;

      await userRepository.save(admin);
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

// Start server
const startServer = async () => {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connection established');

    // Create default admin user
    await createDefaultAdmin();

    // Start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

// Handle cleanup on shutdown
process.on('SIGINT', async () => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
});

startServer(); 
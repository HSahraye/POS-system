import { AppDataSource } from '../config/database';
import { User, UserRole } from '../models/User';
import { Customer } from '../models/Customer';
import { Product } from '../models/Product';
import bcrypt from 'bcrypt';

async function seed() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('Database connected');

    // Create admin user
    const userRepository = AppDataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = userRepository.create({
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN
    });

    await userRepository.save(admin);
    console.log('Admin user created');

    // Create test products
    const productRepository = AppDataSource.getRepository(Product);
    const products = [
      {
        name: 'Coffee',
        description: 'Fresh brewed coffee',
        price: 2.99,
        stockQuantity: 100,
        category: 'Beverages',
        createdById: admin.id
      },
      {
        name: 'Tea',
        description: 'Organic green tea',
        price: 1.99,
        stockQuantity: 150,
        category: 'Beverages',
        createdById: admin.id
      },
      {
        name: 'Sandwich',
        description: 'Fresh made sandwich',
        price: 5.99,
        stockQuantity: 50,
        category: 'Food',
        createdById: admin.id
      }
    ];

    await productRepository.save(products);
    console.log('Test products created');

    // Create test customers
    const customerRepository = AppDataSource.getRepository(Customer);
    const customers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        address: '123 Main St'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '098-765-4321',
        address: '456 Oak Ave'
      }
    ];

    await customerRepository.save(customers);
    console.log('Test customers created');

    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed(); 
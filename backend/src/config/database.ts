import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Customer } from '../models/Customer';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { Payment } from '../models/Payment';
import { CreateInitialTables1709123456789 } from '../migrations/1709123456789-CreateInitialTables';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'pos_system',
  synchronize: true, // Force synchronize for development
  dropSchema: true, // Drop schema on each run (development only)
  logging: true,
  entities: [User, Customer, Product, Order, OrderItem, Payment],
  migrations: [CreateInitialTables1709123456789],
  subscribers: [],
}); 
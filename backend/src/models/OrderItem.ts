import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import { Order } from './Order';
import { Product } from './Product';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('int')
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal!: number;

  @Column('uuid')
  orderId!: string;

  @ManyToOne(() => Order, order => order.items)
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @Column('uuid')
  productId!: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @Column('decimal', { precision: 10, scale: 2 })
  total!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discount!: number;

  @Column('text', { nullable: true })
  notes?: string;

  @Column('jsonb', { nullable: true })
  customizations?: {
    size?: string;
    color?: string;
    addons?: string[];
    specialRequests?: string;
  };

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotal() {
    this.total = (this.unitPrice * this.quantity) - this.discount;
  }
} 
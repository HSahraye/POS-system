import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { Customer } from './Customer';
import { User } from './User';
import { OrderItem } from './OrderItem';
import { Payment } from './Payment';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
  LOYALTY_POINTS = 'LOYALTY_POINTS'
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  customerId!: string;

  @ManyToOne(() => Customer, customer => customer.orders)
  @JoinColumn({ name: 'customerId' })
  customer!: Customer;

  @Column('uuid', { nullable: true })
  cashierId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'cashierId' })
  cashier?: User;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items!: OrderItem[];

  @OneToMany(() => Payment, payment => payment.order, { cascade: true })
  payments!: Payment[];

  @Column('decimal', { precision: 10, scale: 2 })
  total!: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discount!: number;

  @Column({ type: 'enum', enum: DiscountType, nullable: true })
  discountType?: DiscountType;

  @Column('int', { default: 0 })
  loyaltyPointsEarned!: number;

  @Column('int', { default: 0 })
  loyaltyPointsRedeemed!: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status!: OrderStatus;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @Column('boolean', { default: false })
  isOnlineOrder!: boolean;

  @Column('text', { nullable: true })
  shippingAddress?: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  shippingCost!: number;

  @Column({ type: 'text',
    enum: ['PENDING', 'SHIPPED', 'DELIVERED', 'PICKUP_READY', 'PICKED_UP'],
    nullable: true
  })
  fulfillmentStatus?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Helper methods
  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  isFullyPaid(): boolean {
    const totalPaid = this.payments
      .filter(payment => payment.status === 'COMPLETED')
      .reduce((sum, payment) => sum + payment.amount, 0);
    return totalPaid >= this.total;
  }

  // Calculate totals
  calculateTotals() {
    // Calculate subtotal from items
    const subtotal = this.items.reduce((sum, item) => sum + item.total, 0);

    // Apply discount
    if (this.discountType === DiscountType.PERCENTAGE) {
      this.total = subtotal * (1 - this.discount / 100);
    } else if (this.discountType === DiscountType.FIXED) {
      this.total = subtotal - this.discount;
    } else {
      this.total = subtotal;
    }

    // Add tax
    const tax = this.total * 0.1; // 10% tax rate
    this.total += tax;

    // Add shipping cost for online orders
    if (this.isOnlineOrder && this.shippingCost > 0) {
      this.total += this.shippingCost;
    }
  }

  // Calculate remaining balance
  getRemainingBalance(): number {
    const totalPaid = this.payments.reduce((sum, payment) => sum + payment.amount, 0);
    return Math.max(0, this.total - totalPaid);
  }
} 
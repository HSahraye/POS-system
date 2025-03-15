import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Order } from './Order';

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  MOBILE_PAYMENT = 'MOBILE_PAYMENT',
  LOYALTY_POINTS = 'LOYALTY_POINTS'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod!: PaymentMethod;

  @Column({ nullable: true })
  transactionId?: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column('uuid')
  orderId!: string;

  @ManyToOne(() => Order, order => order.payments)
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @Column('jsonb', { nullable: true })
  paymentDetails?: {
    cardLast4?: string;
    cardBrand?: string;
    authorizationCode?: string;
    receiptUrl?: string;
  };

  @Column('jsonb', { nullable: true })
  refundDetails?: {
    refundId: string;
    refundAmount: number;
    refundReason: string;
    refundDate: Date;
  };

  @Column('text', { nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Process refund
  async processRefund(amount: number, reason: string) {
    if (this.status !== PaymentStatus.COMPLETED) {
      throw new Error('Can only refund completed payments');
    }

    if (amount > this.amount) {
      throw new Error('Refund amount cannot exceed payment amount');
    }

    // Here you would integrate with your payment gateway to process the refund
    // For now, we'll just update the status and details
    this.status = PaymentStatus.REFUNDED;
    this.refundDetails = {
      refundId: `REF-${Date.now()}`,
      refundAmount: amount,
      refundReason: reason,
      refundDate: new Date()
    };
  }
} 
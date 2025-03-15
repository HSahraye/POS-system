import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { Order } from './Order';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column({ nullable: true })
  @IsPhoneNumber()
  phone?: string;

  @Column('text', { nullable: true })
  address?: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  loyaltyPoints!: number;

  @Column({ type: 'text', 
    enum: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'],
    default: 'BRONZE'
  })
  loyaltyTier!: string;

  @Column('jsonb', { nullable: true })
  preferences?: {
    marketingEmails: boolean;
    smsNotifications: boolean;
    preferredCategories: string[];
  };

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalSpent!: number;

  @Column('int', { default: 0 })
  visitCount!: number;

  @Column('date', { nullable: true })
  lastVisitDate?: Date;

  @OneToMany(() => Order, order => order.customer)
  orders!: Order[];

  @Column('boolean', { default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Method to add loyalty points
  addLoyaltyPoints(amount: number) {
    this.loyaltyPoints += amount;
    this.updateLoyaltyTier();
  }

  // Method to use loyalty points
  useLoyaltyPoints(amount: number): boolean {
    if (this.loyaltyPoints >= amount) {
      this.loyaltyPoints -= amount;
      this.updateLoyaltyTier();
      return true;
    }
    return false;
  }

  // Method to update loyalty tier based on total spent
  private updateLoyaltyTier() {
    if (this.totalSpent >= 10000) {
      this.loyaltyTier = 'PLATINUM';
    } else if (this.totalSpent >= 5000) {
      this.loyaltyTier = 'GOLD';
    } else if (this.totalSpent >= 1000) {
      this.loyaltyTier = 'SILVER';
    } else {
      this.loyaltyTier = 'BRONZE';
    }
  }

  // Method to update customer stats after a purchase
  updateAfterPurchase(orderAmount: number) {
    this.totalSpent += orderAmount;
    this.visitCount += 1;
    this.lastVisitDate = new Date();
    this.addLoyaltyPoints(Math.floor(orderAmount)); // 1 point per dollar spent
    this.updateLoyaltyTier();
  }
} 
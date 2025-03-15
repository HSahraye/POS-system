import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { IsNotEmpty, Min } from 'class-validator';
import { User } from './User';
import { OrderItem } from './OrderItem';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @IsNotEmpty()
  name!: string;

  @Column('text')
  description!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @Min(0)
  price!: number;

  @Column('int')
  @Min(0)
  stockQuantity!: number;

  @Column('int', { default: 10 })
  @Min(0)
  lowStockThreshold!: number;

  @Column('text', { nullable: true })
  sku?: string;

  @Column({ nullable: true })
  barcode?: string;

  @Column('text', { nullable: true })
  category?: string;

  @Column('simple-array', { nullable: true })
  tags?: string[];

  @Column('text', { nullable: true })
  imageUrl?: string;

  @Column('uuid')
  createdById!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;

  @Column('boolean', { default: true })
  isActive!: boolean;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems!: OrderItem[];

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  get isLowStock(): boolean {
    return this.stockQuantity <= this.lowStockThreshold;
  }

  updateStock(quantity: number): boolean {
    const newQuantity = this.stockQuantity + quantity;
    if (newQuantity < 0) {
      return false;
    }
    this.stockQuantity = newQuantity;
    return true;
  }
} 
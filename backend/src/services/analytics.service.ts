import { getRepository, Between } from 'typeorm';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { Customer } from '../models/Customer';
import { User } from '../models/User';

export class AnalyticsService {
  // Sales reports by time period
  static async getSalesReport(startDate: Date, endDate: Date) {
    const orderRepository = getRepository(Order);
    
    const orders = await orderRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
        status: 'COMPLETED'
      },
      relations: ['items', 'payments', 'customer']
    });

    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalSales / totalOrders || 0;

    // Sales by payment method
    const salesByPaymentMethod = orders.reduce((acc: Record<string, number>, order) => {
      order.payments.forEach(payment => {
        acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + payment.amount;
      });
      return acc;
    }, {});

    // Sales by day
    const salesByDay = orders.reduce((acc: Record<string, number>, order) => {
      const day = order.createdAt.toISOString().split('T')[0];
      acc[day] = (acc[day] || 0) + order.total;
      return acc;
    }, {});

    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      salesByPaymentMethod,
      salesByDay,
      startDate,
      endDate
    };
  }

  // Inventory movement report
  static async getInventoryReport(startDate: Date, endDate: Date) {
    const orderRepository = getRepository(Order);
    const productRepository = getRepository(Product);

    const orders = await orderRepository.find({
      where: {
        createdAt: Between(startDate, endDate)
      },
      relations: ['items', 'items.product']
    });

    const products = await productRepository.find();
    
    const productMovement = products.map(product => {
      const sales = orders.reduce((sum, order) => {
        const item = order.items.find(i => i.productId === product.id);
        return sum + (item?.quantity || 0);
      }, 0);

      return {
        productId: product.id,
        name: product.name,
        currentStock: product.stockQuantity,
        totalSold: sales,
        lowStockAlert: product.stockQuantity <= product.lowStockThreshold
      };
    });

    return {
      productMovement,
      startDate,
      endDate
    };
  }

  // Customer purchase history and metrics
  static async getCustomerAnalytics(customerId: string) {
    const orderRepository = getRepository(Order);
    
    const orders = await orderRepository.find({
      where: {
        customerId,
        status: 'COMPLETED'
      },
      relations: ['items', 'items.product', 'payments'],
      order: {
        createdAt: 'DESC'
      }
    });

    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalSpent / totalOrders || 0;

    // Favorite products
    const productFrequency = orders.reduce((acc: Record<string, number>, order) => {
      order.items.forEach(item => {
        acc[item.product.name] = (acc[item.product.name] || 0) + item.quantity;
      });
      return acc;
    }, {});

    return {
      totalSpent,
      totalOrders,
      averageOrderValue,
      productFrequency,
      recentOrders: orders.slice(0, 5), // Last 5 orders
      loyaltyPoints: orders[0]?.customer.loyaltyPoints || 0
    };
  }

  // Employee performance metrics
  static async getEmployeePerformance(employeeId: string, startDate: Date, endDate: Date) {
    const orderRepository = getRepository(Order);
    
    const orders = await orderRepository.find({
      where: {
        cashierId: employeeId,
        createdAt: Between(startDate, endDate)
      },
      relations: ['items', 'payments']
    });

    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalSales / totalOrders || 0;

    // Sales by hour
    const salesByHour = orders.reduce((acc: Record<number, number>, order) => {
      const hour = new Date(order.createdAt).getHours();
      acc[hour] = (acc[hour] || 0) + order.total;
      return acc;
    }, {});

    // Payment method distribution
    const paymentMethods = orders.reduce((acc: Record<string, number>, order) => {
      order.payments.forEach(payment => {
        acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + 1;
      });
      return acc;
    }, {});

    return {
      totalSales,
      totalOrders,
      averageOrderValue,
      salesByHour,
      paymentMethods,
      startDate,
      endDate
    };
  }
} 
import nodemailer from 'nodemailer';
import { Order } from '../models/Order';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export class EmailService {
  static async sendOrderConfirmation(order: Order): Promise<void> {
    const subject = `Order Confirmation - #${order.id.slice(0, 8)}`;
    const text = `
      Thank you for your order!
      
      Order Details:
      Order ID: ${order.id}
      Total Amount: $${order.total.toFixed(2)}
      Status: ${order.status}
      
      Items:
      ${order.items.map(item => 
        `- ${item.product.name} x${item.quantity} - $${item.total.toFixed(2)}`
      ).join('\n')}
      
      Total: $${order.total.toFixed(2)}
      
      You can view your order details at: http://localhost:3000/dashboard/orders/${order.id}
    `;

    await this.sendEmail(order.customer.email, subject, text);
  }

  static async sendOrderStatusUpdate(order: Order): Promise<void> {
    const subject = `Order Status Update - #${order.id.slice(0, 8)}`;
    const text = `
      Your order status has been updated.
      
      Order Details:
      Order ID: ${order.id}
      New Status: ${order.status}
      
      You can view your order details at: http://localhost:3000/dashboard/orders/${order.id}
    `;

    await this.sendEmail(order.customer.email, subject, text);
  }

  static async sendPaymentConfirmation(order: Order, amount: number): Promise<void> {
    const subject = `Payment Confirmation - Order #${order.id.slice(0, 8)}`;
    const text = `
      Thank you for your payment!
      
      Payment Details:
      Order ID: ${order.id}
      Amount Paid: $${amount.toFixed(2)}
      Remaining Balance: $${order.getRemainingBalance().toFixed(2)}
      
      You can view your order details at: http://localhost:3000/dashboard/orders/${order.id}
    `;

    await this.sendEmail(order.customer.email, subject, text);
  }

  private static async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@posapp.com',
        to,
        subject,
        text
      });
    } catch (error) {
      console.error('Error sending email:', error);
      // Don't throw the error to prevent it from affecting the main flow
    }
  }
} 
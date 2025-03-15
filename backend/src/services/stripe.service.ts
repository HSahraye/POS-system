import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia'
});

export class StripeService {
  static async createPaymentIntent(amount: number) {
    return await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd'
    });
  }

  static async confirmPayment(paymentIntentId: string) {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  }

  static async createRefund(paymentIntentId: string, amount: number) {
    return await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(amount * 100) // Convert to cents
    });
  }
} 
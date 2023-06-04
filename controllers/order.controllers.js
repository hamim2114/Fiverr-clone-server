import gigModel from '../models/gig.model.js';
import orderModel from '../models/order.model.js';
import { createError } from '../utils/error.handler.js';
import Stripe from 'stripe';

export const getOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: false,
    });
    if (orders.length === 0) return next(createError(404, 'No Orders Found!'));
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const intent = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_KEY);
  try {
    const gig = await gigModel.findById(req.params.id);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    const newOrder = new orderModel({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: paymentIntent.id,
    });
    await newOrder.save();
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};

export const confirm = async (req, res, next) => {
  try {
    await orderModel.findOneAndUpdate(
      { payment_intent: req.body.payment_intent },
      {
        $set: {
          isCompleted: true,
        },
      }
    );
    res.status(200).send('Order Confirmed!');
  } catch (error) {
    next(error);
  }
};

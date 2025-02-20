import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorizedError, OrderStatus } from '@ticketing-public/common';

import { Order } from '../models/order';
import { stripe } from '../stripe';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import { Payment } from '../models/payment';

const router = express.Router();

router.post('/api/payments', requireAuth, [
        body('orderId').not().isEmpty()
    ], validateRequest, 
    async (req: Request, res: Response) => {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            throw new NotFoundError();
        }
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for cancelled order');
        }

        const paymentIntents = await stripe.paymentIntents.create({
            amount: order.price * 100,
            currency: 'usd',
            payment_method_types: ['card'],
            metadata: {
                orderId: order.id,
            },
        });
        const payment = Payment.build({
            orderId,
            stripeId: paymentIntents.id
        });
        await payment.save();

        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        });

        res.status(201).send({ id: payment.id });
});

export { router as createCharge };

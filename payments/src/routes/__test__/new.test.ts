import request from 'supertest';
import mongoose from 'mongoose';

import { OrderStatus } from '@ticketing-public/common';

import app from '../../app';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

// jest.mock('../../stripe.ts');

it('returns a 404 when purchasing an order that doesn\'t exist', async () => {
    await request(app).post('/api/payments').set('Cookie', global.signin()).send({
        token: 'abc',
        orderId: new mongoose.Types.ObjectId().toHexString()
    }).expect(404)
});

it('returns a 401 when purchasing an order that doesn\'t belong to the user', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 10,
        status: OrderStatus.Created
    });
    await order.save();

    await request(app).post('/api/payments').set('Cookie', global.signin()).send({
        token: 'abc',
        orderId: order.id
    }).expect(401)
});

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        price: 10,
        status: OrderStatus.Cancelled
    });
    await order.save();

    await request(app).post('/api/payments').set('Cookie', global.signin(userId)).send({
        token: 'abc',
        orderId: order.id
    }).expect(400)
});

it('returns a 201 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const timestamp = Math.floor(Date.now() / 1000); 

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        price,
        status: OrderStatus.Created
    });
    await order.save();

    await request(app).post('/api/payments').set('Cookie', global.signin(userId)).send({ orderId: order.id }).expect(201);

    const stripePaymentIntents = await stripe.paymentIntents.list({
        created: {
            gte: timestamp
        }
    });
    const stripePayment = stripePaymentIntents.data.find(payment => payment.amount === price * 100);
    
    expect(stripePayment).toBeDefined();
    expect(stripePayment!.currency).toEqual('usd');

    const payment = await Payment.findOne({ orderId: order.id, stripeId: stripePayment!.id });
    expect(payment).not.toBeNull();
});

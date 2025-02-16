import request from 'supertest';
import mongoose from "mongoose";

import app from '../../app';
import Order, { OrderStatus } from '../../models/order';
import Ticket from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket doesn\'t exist', async () => {
    const ticketId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId })
        .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        id: new mongoose.Types.ObjectId().toHexString(),
    })
    await ticket.save();

    const order = Order.build({
        userId: '1234567890',
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket
    })
    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(400);
});

it('reserves a ticket', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        id: new mongoose.Types.ObjectId().toHexString(),
    })
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);
});

it('emits an order event', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        id: new mongoose.Types.ObjectId().toHexString(),
    })
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})
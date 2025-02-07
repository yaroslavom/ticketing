import request from "supertest";

import app from "../../app";
import Ticket from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it('has a route handler listening to /api/tickets for post request', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).not.toEqual(404);
});

it('can only be accessed if user is signed in', async () => {
    await request(app)
        .post('/api/tickets')
        .send({})
        .expect(401)
});

it('user get success status if user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'test-title',
            price: 10
        })

    expect(response.status).toEqual(201);
});

it('returns an error if an invalid title is provided', async () => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: '',
        price: 10
    })
    .expect(400)

    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        price: 10
    })
    .expect(400)
});

it('returns an error if an invalid price is provided', async () => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'test-title',
        price: -10
    })
    .expect(400)

    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'test-title',
        price: ''
    })
    .expect(400)

    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'test-title',
    })
    .expect(400)
});

it('creates a ticket with valid parameters', async () => {
    let tickets = await Ticket.find();
    expect(tickets.length).toEqual(0);

    const title = 'test-title'

    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'test-title',
        price: 10
    })
    .expect(201);

    tickets = await Ticket.find();
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(10)
    expect(tickets[0].title).toEqual(title)
});

it('handles the publishing event via mock nats', async () => {
    const title = 'testTitle';

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title,
            price: 20
        })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

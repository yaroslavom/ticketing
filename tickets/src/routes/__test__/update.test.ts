import request from "supertest";
import mongoose from "mongoose";

import app from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided id doesn't exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'test-title',
            price: 10
        })
        .expect(404)
});

it("returns a 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'test-title',
            price: 10
        })
        .expect(401);
});

it("returns a 401 if the user doesn't own the ticket", async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'test-title',
            price: 10
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'test-title',
            price: 1
        })
        .expect(401);
});

it("returns a 400 if the user provides an invalid title ot price", async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'test-title',
            price: 10
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 10
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'test-title',
            price: 0
        })
        .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'test-title',
            price: 10
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new test-title',
            price: 11
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

    expect(ticketResponse.body.title).toEqual('new test-title');
    expect(ticketResponse.body.price).toEqual(11);
});

it('handles the publishing event via mock nats', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'test-title',
            price: 10
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new test-title',
            price: 11
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});


import mongoose from "mongoose";
import { Message } from 'node-nats-streaming';

import { TicketUpdatedEvent } from '@ticketing-public/common';

import Ticket from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save();

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'gig',
        price: 12,
        userId: '1234567890'
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { msg, data, ticket, listener }
};

it('finds, updates, and saves a ticket', async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
    const { listener, data, msg } = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch (error) {
        return;
    }

    expect(msg.ack).not.toHaveBeenCalled();
});
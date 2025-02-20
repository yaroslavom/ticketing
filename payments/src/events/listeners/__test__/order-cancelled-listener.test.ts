import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

import { OrderCancelledEvent, OrderStatus } from "@ticketing-public/common";

import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { Order } from "../../../models/order";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: '1234567890',
        price: 10,
        status: OrderStatus.Created,
    });
    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: '1234567890'
        }
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg }
};

it('updates the status of the order', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(data.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

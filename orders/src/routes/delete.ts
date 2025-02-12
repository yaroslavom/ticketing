import express, { Request, Response } from "express";
import { param } from "express-validator";

import { NotAuthorizedError, NotFoundError, requireAuth } from "@ticketing-public/common";

import Order, { OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete('/api/orders/:id', param('id').not().isEmpty().isMongoId().withMessage('Order Id is invalid'), requireAuth,  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');

    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    } 
    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ticket: {
            id: order.ticket.id,
        }
    });

    res.status(204).send(order);
});

export { router as deleteOrder }

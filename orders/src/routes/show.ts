import express, { Request, Response } from "express";
import { param } from "express-validator";

import { NotAuthorizedError, NotFoundError, requireAuth } from "@ticketing-public/common";

import Order from '../models/order';

const router = express.Router();

router.get('/api/orders/:id', param('id').not().isEmpty().isMongoId().withMessage('Order Id is invalid'), requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');

    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    } 

    res.send(order);
});

export { router as showOrder }

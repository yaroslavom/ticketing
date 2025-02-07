import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';

import { NotFoundError, NotAuthorizedError, validateRequest, requireAuth } from '@ticketing-public/common';

import Ticket from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    ], validateRequest, async (req: Request, res: Response) => {
        const ticketId = req.params.id;
        if (!mongoose.isValidObjectId(ticketId)) {
            throw new NotFoundError();
        }

        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            throw new NotFoundError();
        }

        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError()
        }

        ticket.set({
            title: req.body.title,
            price: req.body.price,
        });
        await ticket.save();

        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticketId,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        })

        res.send(ticket);
});

export { router as updateTicket };

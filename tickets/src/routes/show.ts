import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

import { NotFoundError } from '@ticketing-public/common';

import Ticket from '../models/ticket';

const router = express.Router();

// param('id').isMongoId().withMessage('id is invalid') - need to add custom for NotFoundError;
router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    const ticketId = req.params.id;
    if (!mongoose.isValidObjectId(ticketId)) {
        throw new NotFoundError();
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        throw new NotFoundError();
    }

    res.send(ticket);
});

export { router as showTicket };
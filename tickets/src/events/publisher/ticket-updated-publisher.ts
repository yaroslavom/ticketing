import { Publisher, Subjects, TicketUpdatedEvent } from '@ticketing-public/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
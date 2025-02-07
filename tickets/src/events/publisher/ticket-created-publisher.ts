import { Publisher, Subjects, TicketCreatedEvent } from '@ticketing-public/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
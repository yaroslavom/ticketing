import { Publisher, OrderCreatedEvent, Subjects } from "@ticketing-public/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

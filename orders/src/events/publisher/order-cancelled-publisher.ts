import { Publisher,  Subjects, OrderCancelledEvent } from "@ticketing-public/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

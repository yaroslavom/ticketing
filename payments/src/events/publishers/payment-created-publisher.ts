import { Publisher, PaymentCreatedEvent, Subjects } from "@ticketing-public/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
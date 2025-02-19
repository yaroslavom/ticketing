import { ExpirationCompleteEvent, Publisher, Subjects } from "@ticketing-public/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
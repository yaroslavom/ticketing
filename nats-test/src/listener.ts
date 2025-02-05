import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    })

    const options = stan.subscriptionOptions().setManualAckMode(true).setDeliverAllAvailable().setDurableName('accounting-server');
    /**
     * For horizontal scalability: We used second argument to provide queue group which by default consolidate event one by one to different listeners if such exists;
     */
    const subscription = stan.subscribe('ticket:created', 'queue-group-name', options);

    subscription.on('message', (msg: Message) => {
        const data = msg.getData();

        if (typeof data === 'string') console.log(`Event received #${msg.getSequence()}, with data ${data}`);

        msg.ack();
    });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

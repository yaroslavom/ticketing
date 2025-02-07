import mongoose from "mongoose";

import app from "./app";
import { natsWrapper } from './nats-wrapper';

const start = async () => {
    if (!process.env.JWT_KEY || !process.env.MONGO_URI) {
        throw new Error(`${!process.env.JWT_KEY ? "JWT_KEY" : "MONGO_URI" } must be defined`);
    }

    if (!process.env.NATS_CLIENT_ID || !process.env.NATS_CLUSTER_ID || !process.env.NATS_URL) {
        throw new Error('NATS variable must be defined');
    }

    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.log(error)
    }
    app.listen(3000, () => console.log('Listening on post 3000!!!'));
};

start();
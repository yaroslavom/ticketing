import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import jwt from 'jsonwebtoken';

declare global {
    var signin: (id?: string) => string[]
}

let mongo: any;

jest.mock('../nats-wrapper.ts');

process.env.STRIPE_KEY = 'sk_test_51QglMu1UakiuQv2VucOJzm7Gh6JvVUCfK813F46BQ8Pmwo6EnRpc3ZHTWFz50AEooY5VsS6Rw4xfUsDdh0kgCQiV00O8wafBAG'

beforeAll (async () => {
    process.env.JWT_KEY = 'testSecret';

    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    jest.clearAllMocks();
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db?.collections();
    
        for (let collection of collections) {
            await collection.deleteMany({})
        }
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = (id?: string) => {
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    const token = jwt.sign(payload, process.env.JWT_KEY!);

    const session = { jwt: token };

    const sessionJSON = JSON.stringify(session);

    const base64 = Buffer.from(sessionJSON).toString('base64');

    return [`session=${base64}`];
}
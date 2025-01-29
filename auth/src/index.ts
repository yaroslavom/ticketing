import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
import mongoose from "mongoose";

import routes from './routes';
import { errorHandler } from './middleware/error-handler'
import { NotFoundError } from './errors/not-found-error';
import cookieSession from "cookie-session";


const app = express();
app.set('trust proxy', true)
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: true
}));

app.use(routes.currentUser);
app.use(routes.signin);
app.use(routes.signout);
app.use(routes.signup);

app.all('*', async (req, res) => { 
    throw new NotFoundError();
})

app.use(errorHandler);

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    } catch (error) {
        console.log(error)
    }
    app.listen(3000, () => console.log('Listening on post 3000!!!'));
};

start();
import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { NotFoundError, errorHandler, currentUser } from '@ticketing-public/common';

import routes from "./routes"

const app = express();
app.set('trust proxy', true)
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));
app.use(currentUser);

app.use(routes.createCharge)

app.all('*', async (req, res) => { 
    throw new NotFoundError();
})

app.use(errorHandler);

export default app;
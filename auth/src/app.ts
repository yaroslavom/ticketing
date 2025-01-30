import express from "express";
import 'express-async-errors';
import { json } from "body-parser";

import routes from './routes';
import { errorHandler } from './middleware/error-handler'
import { NotFoundError } from './errors/not-found-error';
import cookieSession from "cookie-session";


const app = express();
app.set('trust proxy', true)
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(routes.currentUser);
app.use(routes.signin);
app.use(routes.signout);
app.use(routes.signup);

app.all('*', async (req, res) => { 
    throw new NotFoundError();
})

app.use(errorHandler);

export default app;
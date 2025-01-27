import express from "express";
import 'express-async-errors';
import { json } from "body-parser";

import routes from './routes';
import { errorHandler } from './middleware/error-handler'
import { NotFoundError } from './errors/not-found-error';


const app = express();

app.use(json());

app.use(routes.currentUser);
app.use(routes.signin);
app.use(routes.signout);
app.use(routes.signup);

app.all('*', async (req, res) => { 
    throw new NotFoundError();
})

app.use(errorHandler);

app.listen(3000, () => console.log('Listening on post 3000!!!'));
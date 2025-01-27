import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator'
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';


export const router = express.Router();

router.post(
    "/api/users/signup",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .isLength({ min: 5 })
            .withMessage("Password must contain at least 5 characters"),
    ],
    (req: Request, res: Response) => {
        const { email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // return res.status(400).send(errors.array());
            // const error = new Error('Invalid email or password');
            // error.reason = errors.array();
            // throw error;
            throw new RequestValidationError(errors.array());
        }

        throw new DatabaseConnectionError();
        res.send({});
    }
);

export { router as signup };
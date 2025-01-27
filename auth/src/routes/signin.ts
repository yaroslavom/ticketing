import express from 'express';

export const router = express.Router();

router.post('api/users/signin', (req, res) => {
    res.send('signin');
});

export { router as signin };
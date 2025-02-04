import mongoose from "mongoose";

import app from "./app";

const start = async () => {
    if (!process.env.JWT_KEY || !process.env.MONGO_URI) {
        throw new Error(`${!process.env.JWT_KEY ? "JWT_KEY" : "MONGO_URI" } must be defined`);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.log(error)
    }
    app.listen(3000, () => console.log('Listening on post 3000!!!'));
};

start();
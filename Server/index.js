import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv' ;



// const userRouter = require('./routes/TestRoute');
import cookieParser from 'cookie-parser';


import authroute from './routes/AuthRoute.js'
import useRouter from './routes/userroute.js';

import ListingRouter from './routes/listingroute.js';


dotenv.config(); // Load environment variables

console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET);
console.log("mongo:", process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/auth' , authroute)
app.use('/api/user' , useRouter)


app.use('/api/listing', ListingRouter)



// Correct the console.log to use process.env.PORT
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// middleware to handle errors
app.use((err, req, res, next) => {
    const statuscode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    res.status(statuscode).json({ status: false, message: message });


})

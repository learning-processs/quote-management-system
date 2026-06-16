import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js';
import authRouter from './routers/authRoute.js';
import quoteRouter from './routers/quoteRoute.js';
import adminRouter from './routers/adminRoute.js';
import userRouter from './routers/userRoute.js';




const app = express();
const port = process.env.PORT || 4000;


connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth',authRouter);
app.use('/api/quotes',quoteRouter);
app.use('/api/users',userRouter);
app.use('/api/admin',adminRouter);

// Health Chek
app.use('/',(req, resp)=>{
    resp.send("API IS WORKING...")
})


// Start server
app.listen(port,()=>console.log(`server is running on port : ${port}`))
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

const allowedOrigins = [
  'http://localhost:5173', // Your Client port
  'http://localhost:5175', // Your Admin port
  'https://quote-alpha-tawny.vercel.app' // Your Production frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) 
    // or if the origin is in our whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 
};

// Middleware
app.use(cors(corsOptions));
// app.options('/*', cors(corsOptions));
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
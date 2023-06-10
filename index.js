import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { userRoute } from './routes/user.route.js';
import { gigRoute } from './routes/gig.route.js';
import { orderRoute } from './routes/order.route.js';
import { conversationRoute } from './routes/conversation.route.js';
import { messageRoute } from './routes/message.route.js';
import { reviewRoute } from './routes/review.route.js';
import { authRoute } from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on('connected', () => {
  console.log('mongodb connected');
});
mongoose.connection.on('disconnected', () => {
  console.log('mongodb disconnected');
});

app.listen(5000, () => {
  console.log('server running');
});
connect();

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: ['http://localhost:4000','https://fiverr-clone-ui-react.web.app'], credentials: true})); //credentials for cookies permission

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/gigs', gigRoute);
app.use('/api/orders', orderRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);
app.use('/api/reviews', reviewRoute);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  res.status(status).json(message);
});

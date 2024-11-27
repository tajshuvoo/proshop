import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import productRouter from './routes/productRoutes.js';
import userRoute from './routes/userRoute.js';
import orderRoute from './routes/orderRoutes.js';
import uploadRoute from './routes/UploadRoutes.js';
import cookieParser from 'cookie-parser';

const port = process.env.PORT || 8000;

connectDB();

const app = express();

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//cookie parser middleware
app.use(cookieParser());


app.use('/api/products', productRouter);
app.use('/api/users', userRoute);
app.use('/api/orders', orderRoute);
app.use('/api/upload', uploadRoute);

app.get('/api/config/paypal', (req, res) => res.send({ clientId : process.env.PAYPAL_CLIENT_ID}));

if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use('/uploads', express.static('/var/data/uploads'));
    app.use(express.static(path.join(__dirname, '/frontend/build')));
  
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    );
  } else {
    const __dirname = path.resolve();
    app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
    app.get('/', (req, res) => {
      res.send('API is running....');
    });
  }

app.use(notFound);
app.use(errorHandler);




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    }
);
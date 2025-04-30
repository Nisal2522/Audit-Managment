//index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import customerRouter from './routes/customer.route.js';
import customerUnitsRouter from './routes/customerUnits.route.js';
import connectToDatabase from './db/db.js';
import leaveRequestRoutes from './routes/leaveRequestRoutes.js';

dotenv.config();  // Load environment variables

connectToDatabase();  // Connect to MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register the auth routes
app.use('/api/auth', authRouter);
app.use('/api/customers', customerRouter);
app.use('/api/units', customerUnitsRouter);
app.use('/api/leave-requests', leaveRequestRoutes);
// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
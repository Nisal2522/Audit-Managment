//index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import connectToDatabase from './db/db.js';
import contractorRouter from './routes/contractor.routes.js';
import customerRouter from './routes/cust.routes.js';
import auditRouter from './routes/audit.routes.js';

dotenv.config();  // Load environment variables

connectToDatabase();  // Connect to MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register the auth routes
app.use('/api/auth', authRouter);
app.use('/api/contractor', contractorRouter);
app.use('/api/customers', customerRouter);
app.use('/api/planneraudits', auditRouter);

// Start the server
const PORT = process.env.PORT || 5006; // Use port from env or default to 5006
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


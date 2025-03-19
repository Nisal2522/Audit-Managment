import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter  from './routes/auth.js'; // Auth routes
import employeeRouter from './routes/auth.js'; // Employee routes
import path from 'path';
import connectToDatabase from './db/db.js';
import employeeRoutes from './routes/empolyeeroutes.js';

dotenv.config();  // Load environment variables

connectToDatabase();  // Connect to MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register the auth routes
app.use('/api/auth', authRouter);

// Register the employee routes
app.use('/api/employees', employeeRouter); // This registers the employee routes

app.use('/api', employeeRoutes);

// Serve static files from the 'uploads' folder
const __dirname = path.resolve(); // Get the current directory name
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
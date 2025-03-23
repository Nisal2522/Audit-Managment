//index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import connectToDatabase from './db/db.js';
import auditRouter from './routes/audit.route.js';

dotenv.config();  

connectToDatabase();  

const app = express();


app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());


app.use('/api/auth', authRouter);
app.use('/api/audits', auditRouter );


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


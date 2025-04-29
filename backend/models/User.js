//User.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  department: String,
  position: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
});

const User = mongoose.model('User', userSchema, 'EmployeeRegister');

export default User;


//User.js (Model)

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  department: String,
  position: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:String,
  employeeid:String,
  profilePic: String,

  createdDate: { type: Date },
  lastUpdate: { type: Date }, // Add this field

  
});

const User = mongoose.model('User', userSchema,'dept_head');

export default User;
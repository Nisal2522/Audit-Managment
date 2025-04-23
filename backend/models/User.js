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
  status: String,
  activity: [{
    type: {
      type: String,
      enum: ['password_reset', 'account_update']
    },
    timestamp: { type: Date, default: Date.now },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    details: String
  }]
});


userSchema.pre('save', function(next) {
  if (this.isModified('password') && this.activityType === 'password_reset') {
    this.activity.push({
      type: 'password_reset',
      performedBy: this.performedBy || this._id,
      details: 'Password was reset by admin'
    });
    this.lastUpdate = Date.now();
  }
  
  if (this.activityType === 'account_update') {
    this.activity.push({
      type: 'account_update',
      performedBy: this.performedBy,
      details: 'Account information was updated by admin'
    });
    this.lastUpdate = Date.now();
  }
  
  // Clear the temporary fields
  this.activityType = undefined;
  this.performedBy = undefined;
  
  next();
});


const User = mongoose.model('User', userSchema,'dept_head');

export default User;
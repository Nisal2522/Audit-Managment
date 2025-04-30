//auth.js
import express from 'express';
import { registerUser } from '../controllers/authController.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found.' });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, department: user.department, position: user.role, employeeId: user.employeeId },
      process.env.JWT_KEY,  // Secret key from environment
      { expiresIn: '1h' }
    );

    // Return the user data along with token
    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: { userId: user._id,email: user.email, department: user.department, position: user.role, employeeId: user.employeeId },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.json({ success: false, message: 'Something went wrong during login.' });
  }
});

// Route to fetch user data by ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Something went wrong while fetching user data.' });
  }
});

// Add this: Update user by ID
router.put('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, update, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Something went wrong while updating user.' });
  }
});

export default router;


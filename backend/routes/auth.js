//auth.js
import express from 'express';
import { registerUser } from '../controllers/authController.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { createEmployee } from "../controllers/employeeController.js"; // Ensure this path is correct
import multer from 'multer';
import path from 'path';
import cloudinary from 'cloudinary';







const router = express.Router();


// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: 'dx2aqta9f', // Your Cloudinary cloud name
  api_key: '755417171198543', // Your Cloudinary API key
  api_secret: 'rtoamD6NYhuJRdyX2Ux32EVaz4M', // Your Cloudinary API secret
});





// Registration route
router.post('/register', registerUser);

router.post("/create", createEmployee);







// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, department: user.department, position: user.position , employeeid: user.employeeid, status:user.status,  },
      process.env.JWT_KEY, // Secret key from environment
      { expiresIn: '1h' }
    );

    // Return the user data along with the token
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        department: user.department,
        position: user.position,
        email: user.email,
        phone: user.phone,
        employeeid: user.employeeid,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Something went wrong during login.' });
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


// Multer configuration for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Helper function to generate a unique filename
const generateUniqueFilename = (originalname) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalname.split('.').pop();
  return `profile_${timestamp}_${randomString}.${extension}`;
};



// Update profile route with Cloudinary integration
router.put("/updateProfile/:id", upload.single('profilePic'), async (req, res) => {
  try {
    const { phone, lastUpdate } = req.body;
    const userId = req.params.id;

    // Fetch the current user data
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let profilePicUrl = null;

    // If a new file is provided, upload it to Cloudinary
    if (req.file) {
      const uniqueFilename = generateUniqueFilename(req.file.originalname);

      // Extract the public_id from the old profilePic URL (if it exists)
      const oldPublicId = currentUser.profilePic
        ? currentUser.profilePic.split('/').slice(-2).join('/').split('.')[0]
        : null;

      // Upload the new image and delete the old image in parallel
      const [uploadResult] = await Promise.all([
        cloudinary.v2.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
          {
            folder: 'profile_pics', // Organize images in a folder
            public_id: uniqueFilename, // Use a unique filename
            resource_type: 'auto', // Automatically detect file type
          }
        ),
        oldPublicId ? cloudinary.v2.uploader.destroy(oldPublicId) : Promise.resolve(),
      ]);

      profilePicUrl = uploadResult.secure_url; // Get the public URL of the uploaded image
    }

    // Prepare the update data
    const updateData = { phone, lastUpdate };
    if (profilePicUrl) {
      updateData.profilePic = profilePicUrl;
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});




// Route to remove profile picture
router.put("/removeProfilePic/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch the current user data
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Extract the public_id from the profilePic URL (if it exists)
    const oldPublicId = currentUser.profilePic
      ? currentUser.profilePic.split('/').slice(-2).join('/').split('.')[0]
      : null;

    // If there's an old profile picture, delete it from Cloudinary
    if (oldPublicId) {
      await cloudinary.v2.uploader.destroy(oldPublicId);
    }

    // Update the user in the database to remove the profile picture
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $unset: { profilePic: "" } }, // Remove the profilePic field
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Profile picture removed", user: updatedUser });
  } catch (error) {
    console.error("Error removing profile picture:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});


export default router;
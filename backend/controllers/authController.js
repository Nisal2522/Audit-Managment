import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import moment from 'moment-timezone'; // Import moment-timezone


const registerUser = async (req, res) => {
  const { firstname, lastname, department, position, email, password,phone,employeeid,status } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'Email already registered.' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const createdDate = moment().tz('Asia/Colombo').toDate();


    // Save the new user to the database
    const newUser = new User({
      firstname,
      lastname,
      department,
      position,
      email,
      password: hashedPassword,
      phone,
      employeeid,
      createdDate,
      status:'Active',
    
    });
    await newUser.save();

    // Configure Nodemailer with environment variables for Gmail settings
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  // Use environment variable
        pass: process.env.EMAIL_PASS,  // Use environment variable
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,  // Use environment variable
      to: email,  // Recipient's email
      subject: 'Registration Successful - Audit Planning System',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://drive.google.com/uc?export=view&id=1r0A2Y1PgSz5xyq9e7zSIqx5EIA89TU6T" alt="Audit Planning System Logo" style="max-width: 250px; margin-bottom: 10px;" />
            <h1 style="color: #2e51af; font-size: 36px; margin: 10px 0; font-weight: bold;">Audit Planning System</h1>
          </div>
          <p style="font-size: 18px; color: #333;">Hello <strong>${firstname} ${lastname}</strong>,</p>
          <p style="font-size: 16px; color: #444;">We’re thrilled to welcome you to the <strong>Audit Planning System</strong>! Your registration is now complete.</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #e9f2fc; border-radius: 6px;">
            <p style="color: #2e51af; font-weight: bold; font-size: 20px; margin-bottom: 10px;">Your Registration Details:</p>
            <p style="font-size: 16px; margin: 5px 0;"><strong>Department:</strong> ${department}</p>
            <p style="font-size: 16px; margin: 5px 0;"><strong>Position:</strong> ${position}</p>
            <p style="font-size: 16px; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="font-size: 16px; margin: 5px 0;"><strong>Password:</strong> ${password}</p>

          </div>
          <p style="text-align: center; margin: 30px 0;">
            <a href="https://auditplanning.com/login" 
              style="display: inline-block; padding: 15px 30px; color: white; background-color: #2e51af; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: bold;">
              Go to Dashboard
            </a>
          </p>
          <p style="text-align: center; font-size: 14px; color: #555; margin-top: 30px; line-height: 1.4;">
            Thank you for joining us!<br>
            <strong style="color: #2e51af;">Audit Planning Team</strong><br>
            <span style="font-size: 12px; color: #888;">This email was generated automatically. Please do not reply.</span>
          </p>
        </div>
      `,
    };

    // Send the registration confirmation email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.json({
          success: false,
          message: `User registered, but email not sent. Error: ${err.message}`,
        });
      }
      console.log('Email sent:', info.response);
      res.json({ success: true, message: 'User registered successfully! Email sent.' });
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.json({ success: false, message: 'Something went wrong during registration.' });
  }
};

export { registerUser };
//employeeController

import Employee from '../models/employee.js';
import nodemailer from 'nodemailer';


export const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      role,
      dob,
      address,
      employeeId,
      department,
      password, // This is the plain text password from frontend
      hashedPassword, // This is the hashed password from frontend
      qualifiedPrograms,
    } = req.body;

    // Check if the email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Format dates
    let formattedDob = null;
    if (dob) {
      formattedDob = new Date(dob).toISOString().split("T")[0];
    }

    const formattedPrograms = Array.isArray(qualifiedPrograms)
      ? qualifiedPrograms.map((program) => ({
          programname: program.name,
          startDate: new Date(program.startDate).toISOString().split("T")[0],
          expireDate: new Date(program.expireDate).toISOString().split("T")[0],
        }))
      : [];

    // Save new employee with hashed password
    const newEmployee = new Employee({
      name,
      email,
      phone,
      role,
      dob: formattedDob,
      address,
      employeeId,
      department,
      password: hashedPassword, // Store only the hashed password
      qualifiedPrograms: formattedPrograms,
    });

    const savedEmployee = await newEmployee.save();

    // SEND EMAIL with plain text password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Account Creation Notification - Audit Planning System',
      html: ` 
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://drive.google.com/uc?export=view&id=1r0A2Y1PgSz5xyq9e7zSIqx5EIA89TU6T" alt="Audit Planning System Logo" style="max-width: 250px; margin-bottom: 10px;" />
            <h1 style="color: #064979; font-size: 36px; margin: 10px 0; font-weight: bold;">Audit Planning System</h1>
          </div>
          <p style="font-size: 18px; color: #333;">Hello <strong>${name}</strong>,</p>
          <p style="font-size: 16px; color: #444;">Your employee account for the <strong>Audit Planning System</strong> has been successfully created by the ${department} Department Head.</p>
          
          <div style="margin: 25px 0; padding: 15px; background-color: #ffebee; border-left: 4px solid #d32f2f; border-radius: 4px;">
            <h3 style="color: #d32f2f; font-size: 18px; margin-top: 0; margin-bottom: 10px;">
              <span style="font-size: 20px;">⚠</span> Important Security Notice
            </h3>
            <ul style="padding-left: 20px; margin: 0;">
              <li style="margin-bottom: 8px;">Never share your password with anyone, including system administrators</li>
              <li style="margin-bottom: 8px;">Our team will NEVER ask for your password via email or phone</li>
              <li style="margin-bottom: 8px;">This account was created by an authorized departmenthead.</li>
              <li>Beware of phishing attempts - always verify email senders</li>
            </ul>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #e9f2fc; border-radius: 6px;">
            <p style="color: #064979; font-weight: bold; font-size: 20px; margin-bottom: 10px;">Account Details:</p>
            <p style="font-size: 16px; margin: 5px 0;"><strong>Employee ID:</strong> ${employeeId}</p>
            <p style="font-size: 16px; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="font-size: 16px; margin: 5px 0;"><strong>Password:</strong> ${password}</p>
            <p style="font-size: 16px; margin: 5px 0;"><strong>Department:</strong> ${department}</p>
            <p style="font-size: 16px; margin: 5px 0;"><strong>Role:</strong> ${role}</p>
            <p style="font-size: 16px; margin: 5px 0;"><strong>Created by:</strong> Head of the ${department} Department</p>
            <p style="font-size: 16px; margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="font-size: 16px; margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
          </div>
          
          
    
          <p style="font-size: 16px; color: #d32f2f; font-weight: bold;">
            If you did not expect this account creation, please contact your administrator immediately.
          </p>
          
          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #777; text-align: center;">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json(savedEmployee);
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};


// Fetch all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
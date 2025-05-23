// In models/employee.js
import mongoose from 'mongoose';


const qualifiedProgramSchema = new mongoose.Schema({
    programname: { type: String, required: true },
    startDate: { type: String, required: true }, // Store as 'YYYY-MM-DD'
    expireDate: { type: String, required: true }, // Store as 'YYYY-MM-DD'
  });



const employeeSchema = new mongoose.Schema({
    name: String,
    employeeId: { type: String, required: true, unique: true }, 
    email: String,
    phone: String,
    role: String,
    dob: String,
    address: String,
    qualifiedPrograms: [qualifiedProgramSchema], // Array
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }, 
    department: String,   
   password: String,
   createdAt: { type: Date, default: Date.now }, 
    
  });


 
  

const Employee = mongoose.model('Employee', employeeSchema,'EmployeeRegister');


export default Employee ;
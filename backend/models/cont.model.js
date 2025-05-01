//cont.model.js in models folder

import mongoose from "mongoose";

// Drop existing indexes before defining new schema
const contractorSchema = new mongoose.Schema({
   
    customId: {
        type: String,
        required: true,
        unique: true  // This will create a new index on customId
    },
    projectName: {
        type: String,
        required: true  
    },
    unit: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    program: {
        type: String,
        required: true
    },
    auditType: {
        type: String,
        required: true
    },
    auditorId: {
        type: String,
        required: true
    },
    auditorName: {
        type: String,
        required: true
    },
    contractDate: {
        type: Date,
        required: true  
    },
    auditStartDate: {
        type: Date,
        required: true  
    },
    auditEndDate: {
        type: Date,
        required: true  
    },
    auditDuration: {
        type: Number,
        required: false  // This field will be calculated
    },
    offerDays: {
        type: Number,
        required: true  
    },
    manDayCost: {
        type: Number,
        required: true  
    },
    totalCost: {
        type: Number,
        required: false  // This field will be calculated
    },
    exchangeRate: {
        type: Number,
        required: true,
        default: 300  // Default fallback rate
    },
    totalCostLKR: {
        type: Number,
        required: false  // This field will be calculated
    },
    status: {
        type: String,
        required: true,
        default: "Pending"
    }
});

// Pre-save middleware to calculate the auditDuration before saving
contractorSchema.pre('save', function(next) {
    if (this.auditStartDate && this.auditEndDate) {
        // Calculate the duration in days
        const start = new Date(this.auditStartDate);
        const end = new Date(this.auditEndDate);
        const duration = Math.ceil((end - start) / (1000 * 3600 * 24));  // Convert milliseconds to days
        this.auditDuration = duration;  // Set the calculated duration
    }

    if (this.manDayCost && this.offerDays) {
        // Calculate total cost as manDayCost x offerDays
        this.totalCost = this.manDayCost * this.offerDays;
        // Calculate LKR cost using the current exchange rate
        this.totalCostLKR = this.totalCost * this.exchangeRate;
    }
    next();  // Proceed with saving the document
});

// Drop the existing collection and recreate with new schema
mongoose.connection.on('connected', async () => {
    try {
        await mongoose.connection.db.collection('contractors').dropIndexes();
    } catch (err) {
        console.log('No existing indexes to drop');
    }
});

export default mongoose.model('Contractors', contractorSchema);

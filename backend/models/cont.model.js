//cont.model.js in models folder

import mongoose from "mongoose";

const contractorSchema = new mongoose.Schema({
   
    projectID: {
        type: String,
        required: true,  
    },
    projectName: {
        type: String,
        required: true  
    },
    clientID: {
        type: String,
        required: true  
    },
    clientName: {
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
    totalCostLKR: {
        type: Number,
        required: false  // This field will be calculated
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
    }
    next();  // Proceed with saving the document
});


export default mongoose.model('Contractors', contractorSchema);

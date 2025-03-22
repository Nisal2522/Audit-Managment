import mongoose from "mongoose";


const auditSchema = new mongoose.Schema({
    customId: { type: String, required: true, unique: true },
    projectName: { type: String, required: true },
    unitLocation: {
        unit: { type: String, required: true }, 
        location: { type: String, required: true }, 
    }, 
    program: { type: String, required: true } ,  
    auditType: { type: String, required: true },
    inspectionType: { type: String, required: true },
    auditStatus: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    impartialityAssessment: { type: String, default: "" },
    auditorId: { type: String, required: true },
    auditorName: { type: String, required: true }
}, { timestamps: true });

const plannedAudits = mongoose.model('planneraudits', auditSchema);

export default plannedAudits;
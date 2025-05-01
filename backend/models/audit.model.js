import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
  customId: { type: String, required: true }, 
  projectName: { type: String, required: true },
  unitLocation: {
    unit: { type: String, required: true },
    location: { type: String, required: true },
  },
  program: { type: String, required: true },
  auditType: { type: String, required: true },
  inspectionType: { type: String, required: true },
  auditStatus: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  impartialityAssessment: { type: String },
  auditorId: { type: String, required: true }, 
  auditorName: { type: String, required: true },
});

export default mongoose.model("Audit", auditSchema, "planneraudits");
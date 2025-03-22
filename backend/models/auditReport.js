import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
    // Unit Information
    unitName: { type: String, required: true },
    totalMale: { type: Number, default: 0 },
    totalFemale: { type: Number, default: 0 },
    groupInterviewed: { type: Number, default: 0 },
    individualInterviewed: { type: Number, default: 0 },

    // Sample Collection
    sampleCollected: { type: Boolean, default: false },
    sampleReason: { type: String, default: "" },

    // Summary of Evidence
    evidenceNumber: { type: String, default: "" },
    documentTitle: { type: String, default: "" },
    documentDate: { type: Date, default: null },
    evidenceDescription: { type: String, default: "" },

    // Dyes & Chemicals
    dyesChemicals: { type: Boolean, default: false },
    dyesDescription: { type: String, default: "" },

    // Audit Details
    auditType: { type: String, enum: ["on-site", "remote"], default: "on-site" },
    auditor1: { type: String, required: true },
    auditor2: { type: String, default: "" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    inspection: { type: String, default: "" },
    organizationNumber: { type: String, default: "" },

    // Additional Fields
    companyName: { type: String, required: true },
    address: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },

    // Unit Assessed
    unitAddress: { type: String, default: "" },
    unitCity: { type: String, default: "" },
    unitCountry: { type: String, default: "" },

    // General Questions
    totalPurchased: { type: Number, default: 0 },
    totalProduced: { type: Number, default: 0 },
    processLoss: { type: Number, default: 0 },
    totalSold: { type: Number, default: 0 },
    totalStock: { type: Number, default: 0 },
    remarks: { type: String, default: "" },

    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


auditSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const AuditReport = mongoose.model("auditreport", auditSchema);

export default AuditReport;

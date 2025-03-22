import AuditReport from "../models/auditReport.js";
import plannedAudits from "../models/PlannerAudits.js";

export const submitAuditReport = async (req, res) => {
    try {
        const { 
            unitName, totalMale, totalFemale, groupInterviewed, individualInterviewed, 
            sampleCollected, sampleReason, evidenceNumber, documentTitle, documentDate, 
            evidenceDescription, dyesChemicals, dyesDescription, auditType, auditor1, 
            auditor2, startDate, endDate, inspection, organizationNumber, companyName, 
            address, zip, country, city, email, mobile, unitAddress, unitCity, 
            unitCountry, totalPurchased, totalProduced, processLoss, totalSold, 
            totalStock, remarks 
        } = req.body;

    
        if (!unitName || !auditor1 || !startDate || !endDate || !companyName || !address || !zip || !country || !city || !email || !mobile) {
            return res.status(400).json({ message: "Some required fields are missing" });
        }


        const newAudit = new AuditReport({
            unitName,
            totalMale,
            totalFemale,
            groupInterviewed,
            individualInterviewed,
            sampleCollected,
            sampleReason,
            evidenceNumber,
            documentTitle,
            documentDate,
            evidenceDescription,
            dyesChemicals,
            dyesDescription,
            auditType,
            auditor1,
            auditor2,
            startDate,
            endDate,
            inspection,
            organizationNumber,
            companyName,
            address,
            zip,
            country,
            city,
            email,
            mobile,
            unitAddress,
            unitCity,
            unitCountry,
            totalPurchased,
            totalProduced,
            processLoss,
            totalSold,
            totalStock,
            remarks,
            submittedAt: new Date() 
        });

        
        await newAudit.save();

        res.status(201).json({ message: "Audit report submitted successfully", audit: newAudit });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getAuditInfo = async (req, res) => {
            const _id = req.params.id;
    try {
        const auditDetails = await plannedAudits.findOne({ auditorId:_id}); 

        if (!auditDetails) { 
            return res.status(404).json({ message: 'No audits found for this auditor' });
        }

        res.json(auditDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching audit details', error });
    }
};

export const getAuditReports = async (req, res) => {
    const id = req.params.id;
    try {
        const audits = await plannedAudits.find(id);
        res.status(200).json(audits);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch audit reports" });
    }
};


export const getAuditForm = async (req, res) => {
    res.status(200).json({ message: "Audit form template" });
};

import CustomerUnit from "../models/customerUnits.model.js";
import mongoose from "mongoose";

// Get all units for a specific customer
export const getCustomerUnits = async (req, res) => {
  try {
    const { customerId } = req.params;
    const units = await CustomerUnit.find({ customerId });
    res.status(200).json({ success: true, data: units });
  } catch (error) {
    console.error("Error in fetching customer units: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create a new unit for a customer
export const createCustomerUnit = async (req, res) => {
  const unit = req.body;
  
  // Validate required fields
  if (!unit.customerId || !unit.unitName || !unit.location) {
    return res.status(400).json({ 
      success: false, 
      message: "Customer ID, unit name, and location are required" 
    });
  }

  try {
    const newUnit = new CustomerUnit(unit);
    await newUnit.save();
    res.status(201).json({ success: true, data: newUnit });
  } catch (error) {
    console.error("Error in creating customer unit: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a customer unit
export const updateCustomerUnit = async (req, res) => {
  const { id } = req.params;
  const unit = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ 
      success: false, 
      message: "Invalid unit id" 
    });
  }

  try {
    const updatedUnit = await CustomerUnit.findByIdAndUpdate(id, unit, {
      new: true,
    });
    
    if (!updatedUnit) {
      return res.status(404).json({ 
        success: false, 
        message: "Unit not found" 
      });
    }

    res.status(200).json({ success: true, data: updatedUnit });
  } catch (error) {
    console.error("Error in updating customer unit: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a customer unit
export const deleteCustomerUnit = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ 
      success: false, 
      message: "Invalid unit id" 
    });
  }

  try {
    const deletedUnit = await CustomerUnit.findByIdAndDelete(id);
    
    if (!deletedUnit) {
      return res.status(404).json({ 
        success: false, 
        message: "Unit not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Unit deleted successfully" 
    });
  } catch (error) {
    console.error("Error in deleting customer unit: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get a single unit by ID
export const getCustomerUnitById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ 
      success: false, 
      message: "Invalid unit id" 
    });
  }

  try {
    const unit = await CustomerUnit.findById(id);
    
    if (!unit) {
      return res.status(404).json({ 
        success: false, 
        message: "Unit not found" 
      });
    }

    res.status(200).json({ success: true, data: unit });
  } catch (error) {
    console.error("Error in fetching customer unit: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}; 
import express from "express";
import {
  getCustomerUnits,
  createCustomerUnit,
  updateCustomerUnit,
  deleteCustomerUnit,
  getCustomerUnitById
} from "../controllers/customerUnits.controller.js";

const router = express.Router();

// Get all units for a specific customer
router.get("/customer/:customerId", getCustomerUnits);

// Get a single unit by ID
router.get("/:id", getCustomerUnitById);

// Create a new unit
router.post("/", createCustomerUnit);

// Update a unit
router.put("/:id", updateCustomerUnit);

// Delete a unit
router.delete("/:id", deleteCustomerUnit);

export default router; 
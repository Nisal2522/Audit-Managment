//contractor.routes.js

import express from "express";

import { createContract, readContract, readSingleContract, updateContract, deleteContract } from "../controllers/cont.controller.js";

const contractorRouter = express.Router();


contractorRouter.post("/createcontract", createContract); // Create contract
contractorRouter.get("/readcontract", readContract); // Read all contracts
contractorRouter.get("/readsinglecontract/:id", readSingleContract); // Read a single contract by ID
contractorRouter.put("/updatecontract/:id", updateContract); // Update contract by ID
contractorRouter.delete("/deletecontract/:id", deleteContract); // Delete contract by ID


export default contractorRouter;
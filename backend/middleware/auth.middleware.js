import jwt from "jsonwebtoken"
import User from "../models/User.js";

export const protectRoute = async (req , res ,next) =>{
    try {
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({message : "Unauthorized - no Token Provided"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message : "Unauthorized - Invalid token"});
        }

        const user = await User.findById(decoded.userId).select("-password"); // - the password field

        req.user = user;

        next();

    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({message: "Internal Server error"});
 }
}
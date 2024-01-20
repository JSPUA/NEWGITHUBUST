import express from "express";
import smsController from "../controller/smsController.js";

const smsRoute = express.Router();

//send otp sms
smsRoute.post("/", smsController.sendOTP);
smsRoute.post("/verify", smsController.otpVerification);
smsRoute.put("/patient/:mobile", smsController.editPatient);

export default smsRoute;

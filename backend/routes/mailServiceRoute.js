import express from "express";
import mailServiceController from "../controller/mailServiceController.js";

const mailServiceRoute = express.Router();

mailServiceRoute.post("/signup", mailServiceController.signupMail);
mailServiceRoute.post("/resetPassword", mailServiceController.resetPassword);

export default mailServiceRoute;

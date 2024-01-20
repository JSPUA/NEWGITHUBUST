import express from "express";
import chatbotController from "../controller/chatbotController.js";

const chatbotRoute = express.Router();

chatbotRoute.post("/", chatbotController.chatbot);

export default chatbotRoute;

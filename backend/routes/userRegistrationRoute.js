import express from "express";
import userRegistrationController from "../controller/userRegistrationController.js";

const userRegistrationRoute = express.Router();

//GET all application
userRegistrationRoute.get("/", userRegistrationController.getRegistration);

//GET specific application
userRegistrationRoute.get(
  "/:id",
  userRegistrationController.getRegistrationByid
);

//POST new application
userRegistrationRoute.post(
  "/",
  userRegistrationController.upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "apc", maxCount: 1 },
  ]),
  userRegistrationController.createApplication
);

//DELETE application
userRegistrationRoute.delete(
  "/:id",
  userRegistrationController.deleteRegistration
);

export default userRegistrationRoute;

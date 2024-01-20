import express from "express";
import patientDataController from "../controller/patientDataController.js";

const patientDataRoute = express.Router();

//GET all patient
patientDataRoute.get("/:icNo", patientDataController.getPatient);

//GET active patient
patientDataRoute.get("/active/:icNo", patientDataController.getActivePatient);

//GET expired patient
patientDataRoute.get("/expired/:icNo", patientDataController.getExpiredPatient);

//GET due patient
patientDataRoute.get("/due/:icNo", patientDataController.getDuePatient);

//GET all patient
patientDataRoute.get(
  "/hospital/:hospitalName",
  patientDataController.getHospitalPatient
);

//GET active patient
patientDataRoute.get(
  "/active/hospital/:hospitalName",
  patientDataController.getActiveHospitalPatient
);

//GET expired patient
patientDataRoute.get(
  "/expired/hospital/:hospitalName",
  patientDataController.getExpiredHospitalPatient
);

//GET due patient
patientDataRoute.get(
  "/due/hospital/:hospitalName",
  patientDataController.getDueHospitalPatient
);

export default patientDataRoute;

import Patient from "../models/patientModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

//get all doctor patient
const getPatient = async (req, res) => {
  const icNo = req.params.icNo;
  const doctor = await User.find({ icNo: icNo });

  if (doctor.length === 0) {
    return res
      .status(404)
      .json({ error: "Doctor not found for the given icNo" });
  }

  const doctorName = doctor[0].username;

  const patient = await Patient.find({ "stentData.doctor": doctorName }).sort({
    firstName: 1,
  });

  res.status(200).json(patient);
};

//get active doctor patient
const getActivePatient = async (req, res) => {
  try {
    const icNo = req.params.icNo;
    const doctor = await User.find({ icNo: icNo });

    if (doctor.length === 0) {
      return res
        .status(404)
        .json({ error: "Doctor not found for the given icNo" });
    }

    const doctorName = doctor[0].username;
    const activePatients = await Patient.aggregate([
      {
        $match: { "stentData.doctor": doctorName },
      },
      {
        $unwind: "$stentData",
      },
      {
        $addFields: {
          numericalDueDate: {
            $switch: {
              branches: [
                {
                  case: {
                    $regexMatch: {
                      input: "$stentData.dueDate",
                      regex: /(\d+)\s+weeks/,
                    },
                  },
                  then: {
                    $dateAdd: {
                      startDate: "$stentData.insertedDate",
                      unit: "week",
                      amount: {
                        $toInt: {
                          $arrayElemAt: [
                            { $split: ["$stentData.dueDate", " "] },
                            0,
                          ],
                        },
                      },
                    },
                  },
                },
                {
                  case: {
                    $regexMatch: {
                      input: "$stentData.dueDate",
                      regex: /(\d+)\s+months/,
                    },
                  },
                  then: {
                    $dateAdd: {
                      startDate: "$stentData.insertedDate",
                      unit: "month",
                      amount: {
                        $toInt: {
                          $arrayElemAt: [
                            { $split: ["$stentData.dueDate", " "] },
                            0,
                          ],
                        },
                      },
                    },
                  },
                },
              ],
              default: null,
            },
          },
        },
      },
      {
        $addFields: {
          // Calculate today's date
          today: new Date(),
          // Calculate the due date 2 weeks before
          dueDateTwoWeeksBefore: {
            $dateAdd: {
              startDate: "$numericalDueDate",
              unit: "week",
              amount: -2,
            },
          },
        },
      },
      {
        $match: {
          today: { $lt: "$dueDateTwoWeeksBefore" },
        },
      },
      {
        $group: {
          _id: "$_id",
          patient: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$patient" },
      },
    ]).sort({ firstName: 1 });

    console.log("Active Patients:", activePatients);
    res.status(200).json(activePatients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//get expired doctor patient
const getExpiredPatient = async (req, res) => {
  const icNo = req.params.icNo;
  const doctor = await User.find({ icNo: icNo });

  if (doctor.length === 0) {
    return res
      .status(404)
      .json({ error: "Doctor not found for the given icNo" });
  }

  const doctorName = doctor[0].username;
  try {
    const expiredPatients = await Patient.aggregate([
      {
        $match: { "stentData.doctor": doctorName },
      },
      {
        $unwind: "$stentData",
      },
      {
        $addFields: {
          numericalDueDate: {
            $switch: {
              branches: [
                {
                  case: {
                    $regexMatch: {
                      input: "$stentData.dueDate",
                      regex: /(\d+)\s+weeks/,
                    },
                  },
                  then: {
                    $dateAdd: {
                      startDate: "$stentData.insertedDate",
                      unit: "week",
                      amount: {
                        $toInt: {
                          $arrayElemAt: [
                            { $split: ["$stentData.dueDate", " "] },
                            0,
                          ],
                        },
                      },
                    },
                  },
                },
                {
                  case: {
                    $regexMatch: {
                      input: "$stentData.dueDate",
                      regex: /(\d+)\s+months/,
                    },
                  },
                  then: {
                    $dateAdd: {
                      startDate: "$stentData.insertedDate",
                      unit: "month",
                      amount: {
                        $toInt: {
                          $arrayElemAt: [
                            { $split: ["$stentData.dueDate", " "] },
                            0,
                          ],
                        },
                      },
                    },
                  },
                },
              ],
              default: null,
            },
          },
        },
      },
      {
        $match: {
          numericalDueDate: { $lt: new Date() },
        },
      },
      {
        $group: {
          _id: "$_id",
          patient: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$patient" },
      },
    ]).sort({ firstName: 1 });

    console.log("Due Patients:", expiredPatients);
    res.status(200).json(expiredPatients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//get due doctor patient
const getDuePatient = async (req, res) => {
  const icNo = req.params.icNo;
  const doctor = await User.find({ icNo: icNo });

  if (doctor.length === 0) {
    return res
      .status(404)
      .json({ error: "Doctor not found for the given icNo" });
  }

  const doctorName = doctor[0].username;

  try {
    const duePatients = await Patient.aggregate([
      {
        $match: { "stentData.doctor": doctorName },
      },
      {
        $unwind: "$stentData",
      },
      {
        $addFields: {
          numericalDueDate: {
            $switch: {
              branches: [
                {
                  case: {
                    $regexMatch: {
                      input: "$stentData.dueDate",
                      regex: /(\d+)\s+weeks/,
                    },
                  },
                  then: {
                    $dateAdd: {
                      startDate: "$stentData.insertedDate",
                      unit: "week",
                      amount: {
                        $subtract: [
                          {
                            $toInt: {
                              $arrayElemAt: [
                                { $split: ["$stentData.dueDate", " "] },
                                0,
                              ],
                            },
                          },
                          2, // Subtract 2 weeks
                        ],
                      },
                    },
                  },
                },
                {
                  case: {
                    $regexMatch: {
                      input: "$stentData.dueDate",
                      regex: /(\d+)\s+months/,
                    },
                  },
                  then: {
                    $dateAdd: {
                      startDate: {
                        $dateAdd: {
                          startDate: "$stentData.insertedDate",
                          unit: "month",
                          amount: {
                            $toInt: {
                              $arrayElemAt: [
                                { $split: ["$stentData.dueDate", " "] },
                                0,
                              ],
                            },
                          },
                        },
                      },
                      unit: "week",
                      amount: -2,
                    },
                  },
                },
              ],
              default: null,
            },
          },
        },
      },
      {
        $addFields: {
          exactDueDate: {
            $switch: {
              branches: [
                {
                  case: {
                    $regexMatch: {
                      input: "$stentData.dueDate",
                      regex: /(\d+)\s+weeks/,
                    },
                  },
                  then: {
                    $dateAdd: {
                      startDate: "$stentData.insertedDate",
                      unit: "week",
                      amount: {
                        $toInt: {
                          $arrayElemAt: [
                            { $split: ["$stentData.dueDate", " "] },
                            0,
                          ],
                        },
                      },
                    },
                  },
                },
                {
                  case: {
                    $regexMatch: {
                      input: "$stentData.dueDate",
                      regex: /(\d+)\s+months/,
                    },
                  },
                  then: {
                    $dateAdd: {
                      startDate: "$stentData.insertedDate",
                      unit: "month",
                      amount: {
                        $toInt: {
                          $arrayElemAt: [
                            { $split: ["$stentData.dueDate", " "] },
                            0,
                          ],
                        },
                      },
                    },
                  },
                },
              ],
              default: null,
            },
          },
        },
      },
      {
        $match: {
          numericalDueDate: { $lt: new Date() },
          exactDueDate: { $gt: new Date() },
        },
      },
      {
        $group: {
          _id: "$_id",
          patient: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$patient" },
      },
    ]).sort({ firstName: 1 });

    console.log("Due Patients:", duePatients);
    res.status(200).json(duePatients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//get all hospital patient
const getHospitalPatient = async (req, res) => {
  const hospitalName = req.params.hospitalName;
  const patient = await Patient.find({
    "stentData.hospitalName": hospitalName,
  }).sort({
    firstName: 1,
  });

  res.status(200).json(patient);
};

//get active hospital patient
const getActiveHospitalPatient = async (req, res) => {
  try {
    const hospitalName = req.params.hospitalName;
    const activeHospitalPatients = await Patient.aggregate([
      {
        $match: { "stentData.hospitalName": hospitalName },
      },
      {
        $unwind: "$stentData",
      },
      {
        $addFields: {
          numericalDueDate: {
            $switch: {
              branches: [
                {
                  case: {
                    $regexMatch: {
                      input: "$stentData.dueDate",
                      regex: /(\d+)\s+weeks/,
                    },
                  },
                  then: {
                    $dateAdd: {
                      startDate: "$stentData.insertedDate",
                      unit: "week",
                      amount: {
                        $toInt: {
                          $arrayElemAt: [
                            { $split: ["$stentData.dueDate", " "] },
                            0,
                          ],
                        },
                      },
                    },
                  },
                },
                {
                  case: {
                    $regexMatch: {
                      input: "$stentData.dueDate",
                      regex: /(\d+)\s+months/,
                    },
                  },
                  then: {
                    $dateAdd: {
                      startDate: "$stentData.insertedDate",
                      unit: "month",
                      amount: {
                        $toInt: {
                          $arrayElemAt: [
                            { $split: ["$stentData.dueDate", " "] },
                            0,
                          ],
                        },
                      },
                    },
                  },
                },
              ],
              default: null,
            },
          },
        },
      },
      {
        $addFields: {
          // Calculate today's date
          today: new Date(),
          // Calculate the due date 2 weeks before
          dueDateTwoWeeksBefore: {
            $dateAdd: {
              startDate: "$numericalDueDate",
              unit: "week",
              amount: -2,
            },
          },
        },
      },
      {
        $match: {
          today: { $lt: "$dueDateTwoWeeksBefore" },
        },
      },
      {
        $group: {
          _id: "$_id",
          patient: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$patient" },
      },
    ]).sort({ firstName: 1 });

    console.log("Active Hospital Patients:", activeHospitalPatients);
    res.status(200).json(activeHospitalPatients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//get expired doctor patient
const getExpiredHospitalPatient = async (req, res) => {
  const hospitalName = req.params.hospitalName;
  try {
    const expiredPatients = await Patient.aggregate([
      {
        $match: { "stentData.hospitalName": hospitalName },
      },
      {
        $unwind: "$stentData",
      },
      {
        $addFields: {
          numericalDueDate: {
            $switch: {
              branches: [
                {
                  case: {
                    $regexMatch: {
                      input: "$stentData.dueDate",
                      regex: /(\d+)\s+weeks/,
                    },
                  },
                  then: {
                    $dateAdd: {
                      startDate: "$stentData.insertedDate",
                      unit: "week",
                      amount: {
                        $toInt: {
                          $arrayElemAt: [
                            { $split: ["$stentData.dueDate", " "] },
                            0,
                          ],
                        },
                      },
                    },
                  },
                },
                {
                  case: {
                    $regexMatch: {
                      input: "$stentData.dueDate",
                      regex: /(\d+)\s+months/,
                    },
                  },
                  then: {
                    $dateAdd: {
                      startDate: "$stentData.insertedDate",
                      unit: "month",
                      amount: {
                        $toInt: {
                          $arrayElemAt: [
                            { $split: ["$stentData.dueDate", " "] },
                            0,
                          ],
                        },
                      },
                    },
                  },
                },
              ],
              default: null,
            },
          },
        },
      },
      {
        $match: {
          numericalDueDate: { $lt: new Date() },
        },
      },
      {
        $group: {
          _id: "$_id",
          patient: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$patient" },
      },
    ]).sort({ firstName: 1 });

    console.log("Due Patients:", expiredPatients);
    res.status(200).json(expiredPatients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//get due hospital patient
const getDueHospitalPatient = async (req, res) => {
  const hospitalName = req.params.hospitalName;
  try {
    const duePatients = await Patient.aggregate([
      {
        $match: { "stentData.hospitalName": hospitalName },
      },
      {
        $unwind: "$stentData",
      },
      {
        $addFields: {
          numericalDueDate: {
            $switch: {
              branches: [
                {
                  case: {
                    $regexMatch: {
                      input: "$stentData.dueDate",
                      regex: /(\d+)\s+weeks/,
                    },
                  },
                  then: {
                    $dateAdd: {
                      startDate: "$stentData.insertedDate",
                      unit: "week",
                      amount: {
                        $subtract: [
                          {
                            $toInt: {
                              $arrayElemAt: [
                                { $split: ["$stentData.dueDate", " "] },
                                0,
                              ],
                            },
                          },
                          2, // Subtract 2 weeks
                        ],
                      },
                    },
                  },
                },
                {
                  case: {
                    $regexMatch: {
                      input: "$stentData.dueDate",
                      regex: /(\d+)\s+months/,
                    },
                  },
                  then: {
                    $dateAdd: {
                      startDate: {
                        $dateAdd: {
                          startDate: "$stentData.insertedDate",
                          unit: "month",
                          amount: {
                            $toInt: {
                              $arrayElemAt: [
                                { $split: ["$stentData.dueDate", " "] },
                                0,
                              ],
                            },
                          },
                        },
                      },
                      unit: "week",
                      amount: -2,
                    },
                  },
                },
              ],
              default: null,
            },
          },
        },
      },
      {
        $addFields: {
          exactDueDate: {
            $switch: {
              branches: [
                {
                  case: {
                    $regexMatch: {
                      input: "$stentData.dueDate",
                      regex: /(\d+)\s+weeks/,
                    },
                  },
                  then: {
                    $dateAdd: {
                      startDate: "$stentData.insertedDate",
                      unit: "week",
                      amount: {
                        $toInt: {
                          $arrayElemAt: [
                            { $split: ["$stentData.dueDate", " "] },
                            0,
                          ],
                        },
                      },
                    },
                  },
                },
                {
                  case: {
                    $regexMatch: {
                      input: "$stentData.dueDate",
                      regex: /(\d+)\s+months/,
                    },
                  },
                  then: {
                    $dateAdd: {
                      startDate: "$stentData.insertedDate",
                      unit: "month",
                      amount: {
                        $toInt: {
                          $arrayElemAt: [
                            { $split: ["$stentData.dueDate", " "] },
                            0,
                          ],
                        },
                      },
                    },
                  },
                },
              ],
              default: null,
            },
          },
        },
      },
      {
        $match: {
          numericalDueDate: { $lt: new Date() },
          exactDueDate: { $gt: new Date() },
        },
      },
      {
        $group: {
          _id: "$_id",
          patient: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$patient" },
      },
    ]).sort({ firstName: 1 });

    console.log("Expired Patients:", duePatients);
    res.status(200).json(duePatients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//create new application (post)
const createPatient = async (req, res) => {
  const {
    firstName,
    lastName,
    birthday,
    icNumber,
    gender,
    hospitalMRN,
    mobile,
    emailAddress,
    nextOfKinName,
    nextOfKinContact,
    otp,
    password,
    verification,
    timestamps,
    stent,
    verified,
  } = req.body;

  try {
    const patient = await Patient.create({
      firstName,
      lastName,
      birthday,
      icNumber,
      gender,
      hospitalMRN,
      mobile,
      emailAddress,
      nextOfKinName,
      nextOfKinContact,
      otp,
      password,
      verification,
      timestamps,
      stent,
      verified,
    });
    res.status(200).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete an application
const deletePatient = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "ID not found" });
  }

  const patient = await Patient.findOneAndDelete({ _id: id });

  if (!patient) {
    return res.status(404).json({ error: "Patient not found" });
  }

  res.status(200).json(patient);
};

const editPatient = async (req, res) => {
  const mobile = req.params.mobile;
  const updatedData = req.body;

  try {
    const patient = await Patient.findOne({ mobile: mobile });

    // Check if the patient exists
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Update patient data
    Object.assign(patient, updatedData);

    // Save the updated patient
    await patient.save();

    res.status(200).json({ message: "Patient updated successfully", patient });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  createPatient,
  getPatient,
  deletePatient,
  getExpiredPatient,
  getDuePatient,
  getActivePatient,
  getHospitalPatient,
  getExpiredHospitalPatient,
  getDueHospitalPatient,
  getActiveHospitalPatient,
  editPatient,
};

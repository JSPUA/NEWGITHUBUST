import { SID, AUTHTOKEN } from "../config.js";
import Patient from "../models/patientModel.js";
import axios from "axios";
import otpGenerator from "otp-generator";
import twilio from "twilio";

const client = twilio(SID, AUTHTOKEN);

const sendOTP = async (req, res) => {
  try {
    const { mobileNo } = req.body;

    // Check if the user exists in the database
    const user = await Patient.findOne({ mobileNo: `+6${mobileNo}` });

    if (!user) {
      // User not found, handle accordingly (e.g., return an error response)
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // Save the OTP in the database
    user.otp = otp;
    await user.save();

    // Prepare SMS.to API request
    client.messages
      .create({
        body: `Your OTP for account verification: ${otp}`,
        from: "+16317219508",
        to: "+6" + mobileNo,
      })
      .then((message) => console.log(message.sid));

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

const otpVerification = async (req, res) => {
  try {
    const { mobileNo, enteredOTP } = req.body;

    // Check if the user exists in the database
    const user = await Patient.findOne({ mobileNo: `+6${mobileNo}` });

    if (!user) {
      // User not found, handle accordingly (e.g., return an error response)
      return res.status(404).json({ message: "User not found" });
    }

    const storedOTP = user.otp;

    // Compare the entered OTP with the stored OTP
    if (enteredOTP === storedOTP) {
      user.verification = true;
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(401).json({ message: "Invalid OTP. Please try again." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

const editPatient = async (req, res) => {
  const mobileNo = req.params.mobile;
  const updatedData = req.body;

  try {
    const patient = await Patient.findOne({ mobileNo: `+6${mobileNo}` });

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
  sendOTP,
  otpVerification,
  editPatient,
};

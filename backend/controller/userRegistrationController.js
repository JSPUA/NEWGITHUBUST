import UserRegistration from "../models/UserRegistrationModel.js";
import mongoose from "mongoose";
import multer from "multer";

const Registration = UserRegistration;

//get all application
const getRegistration = async (req, res) => {
  const registration = await Registration.find({}).sort({ createdAt: -1 });

  res.status(200).json(registration);
};

//get specific application
const getRegistrationByid = async (req, res) => {
  try {
    const imageId = req.params.id;

    // Assuming "Images" is your Mongoose model
    const image = await Registration.findById(imageId);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // You can choose which fields to include in the response
    const responseData = {
      photo: image.photo,
      apc: image.apc,
      username: image.username,
      firstName: image.firstName,
      surname: image.surname,
      dob: image.dob,
      icNo: image.icNo,
      gender: image.gender,
      address: image.address,
      mobileNo: image.mobileNo,
      email: image.email,
      hospitalName: image.hospitalName,
      department: image.department,
      position: image.position,
      mmcRegistrationNo: image.mmcRegistrationNo,
    };

    res.json(responseData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Server Error" });
  }
};

//upload photo & apc certificate
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

//create new application (post)
const createApplication = async (req, res) => {
  const {
    username,
    firstName,
    surname,
    dob,
    icNo,
    gender,
    address,
    mobileNo,
    email,
    hospitalName,
    department,
    position,
    mmcRegistrationNo,
  } = req.body;

  try {
    const registration = new UserRegistration({
      username,
      firstName,
      surname,
      dob,
      icNo,
      gender,
      address,
      mobileNo,
      email,
      hospitalName,
      department,
      position,
      mmcRegistrationNo,
    });

    if (req.files && req.files["photo"]) {
      registration.photo = req.files["photo"][0].path.replace("uploads\\", "");
      console.log("photo:", registration.photo);
    }

    if (req.files && req.files["apc"]) {
      registration.apc = req.files["apc"][0].path.replace("uploads\\", "");
    }

    // Save the registration data to the database
    await registration.save();

    // Respond with the saved registration data
    res.status(200).json(registration);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete an application
const deleteRegistration = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "ID not found" });
  }

  const registration = await Registration.findOneAndDelete({ _id: id });

  if (!registration) {
    return res.status(404).json({ error: "Application not found" });
  }

  res.status(200).json(registration);
};

export default {
  createApplication,
  getRegistration,
  deleteRegistration,
  getRegistrationByid,
  upload,
};

import mongoose from "mongoose";

const Schema = mongoose.Schema;

const registrationSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    icNo: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    hospitalName: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    mmcRegistrationNo: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    apc: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const UserRegistration = mongoose.model(
  "UserRegistrationModel",
  registrationSchema
);

export default UserRegistration;

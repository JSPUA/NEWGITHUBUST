import { EMAIL, PASS } from "../config.js";

import nodemailer from "nodemailer";
import Mailgen from "mailgen";

//user config
const config = {
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASS,
  },
};

const transporter = nodemailer.createTransport(config);

//user signup received email
const signupMail = async (req, res) => {
  const { email, username } = req.body;

  const MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "NUST",
      link: "https://mailgen.js",
    },
  });

  const response = {
    body: {
      name: username,
      intro: "You have submitted your registration form successfully!",

      outro: "Thank you",
    },
  };

  const mail = MailGenerator.generate(response);

  const message = {
    from: EMAIL,
    to: email,
    subject: "NUST Account Registration",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({ mssg: "Email received" });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};

const resetPassword = (req, res) => {
  const { email, username } = req.body;

  const MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "NUST",
      link: "https://mailgen.js",
    },
  });

  const response = {
    body: {
      name: username,
      intro: "Your application for NUST account have been approved!",
      action: {
        instructions:
          "To get started with NUST, please click the link below to login and reset your password. Your initial password is your IC number",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Reset password",
          link: "http://localhost:5173/login",
        },
      },
      outro: "Thank you",
    },
  };

  const mail = MailGenerator.generate(response);

  const message = {
    from: process.env.EMAIL,
    to: email,
    subject: "NUST Account Approval",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({ mssg: "Email received" });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};

export default {
  signupMail,
  resetPassword,
};

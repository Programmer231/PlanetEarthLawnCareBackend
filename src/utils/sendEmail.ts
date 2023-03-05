import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";
import { SENDGRID_API_KEY } from "../constants";

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to: string, html: string) {
  sgMail.setApiKey(SENDGRID_API_KEY);

  let msg = {
    from: "sebasn327@gmail.com", // sender address
    to: to, // list of receivers
    subject: "Change Password", // Subject line
    html: html, // plain text body
  };

  await sgMail.send(msg);
}

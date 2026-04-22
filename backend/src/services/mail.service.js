import axios from "axios";
import configure from "../config/config.js";

export const sendmail = async ({ to, subject, text = "", html = "" }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "UrbanKnife", // optional
          email: configure.user_email, // 👈 sender email
        },
        to: [
          {
            email: to,
          },
        ],
        subject: subject,
        htmlContent: html || `<p>${text}</p>`,
      },
      {
        headers: {
          "api-key": configure.brevo_api_key, // 👈 API key
          "Content-Type": "application/json",
        },
      }
    );

    console.log("MAIL SENT ✅", response.data);
    return "MAIL SENT SUCCESSFULLY 🚀";
  } catch (error) {
    console.error("MAIL ERROR ❌", error.response?.data || error.message);
    return "MAIL FAILED ❌";
  }
};
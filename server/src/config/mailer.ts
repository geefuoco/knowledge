import config from "./config";
import { createTransport } from "nodemailer";

const sender = "knowledge.social@outlook.com";

export const transporter = createTransport({
  service: "hotmail",
  secure: false,
  auth: {
    user: sender,
    pass: config.MAIL_PASS
  }
});

export function createMessage(
  recipients: string[],
  subject: string,
  message: string
) {
  return {
    from: sender,
    to: recipients,
    subject,
    text: message
  };
}

function generateHtml(token: string): string {
  return `
<div style='padding: 2em; background-color: linear-gradient(#eeffee, #eeffff); font-size: 20px;'>
  <p>
    Please click this <a href='${config.CLIENT}/reset-password/${token}'>link</a> to reset your password
  </p>
  <footer style='font-size: 12px; display: flex; justify-content: space-between; '>
    <p>
      Knowledge Social Media
    </p>
    <p>
      &copy;2022
    <p>
  </foorter>
</div>
`;
}

export async function sendPasswordResetEmail(
  recipient: string,
  token: string
): Promise<boolean> {
  try {
    if (!recipient) {
      console.error("Recipient not provided");
      return false;
    }
    const mailOptions = {
      from: sender,
      to: recipient,
      subject: "Reset Password - Knowledge Social Media",
      html: generateHtml(token)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(info);
    if (info.response.includes("OK")) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

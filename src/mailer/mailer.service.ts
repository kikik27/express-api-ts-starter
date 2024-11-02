import { User } from "../db/schema/users";
import transporter from "../utils/mailer";
import mustache from "mustache";
import fs from "fs";
import path from "path";

export const sendEmailResetPassword = async (
  user: User,
  context: { url: string }
) => {
  try {
    const template = fs.readFileSync(
      path.join(__dirname, "templates", "reset-password.html"),
      "utf8"
    );

    transporter.sendMail({
      to: user.email,
      from: "noreply@kikik27.github.io",
      subject: "Reset Password",
      html: mustache.render(template, {
        url: context.url,
      }),
    });

    return true;
  } catch (error) {
    throw error;
  }
};

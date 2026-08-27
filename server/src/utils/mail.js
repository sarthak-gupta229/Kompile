import Mailgen from "mailgen";
import { Resend } from "resend";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Kompile",
      link: process.env.CORS_ORIGIN || "https://kompile.dev",
    },
  });

  const emailBody = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: "Auth <onboarding@sarthak229.me>",
      to: options.email,
      subject: options.subject,
      html: emailHtml,
      text: emailBody,
    });

    if (error) {
      console.error("Resend email error:", error);
      throw new Error(error.message || "Failed to send email via Resend");
    }

    console.log(`Email sent to ${options.email} via Resend [Id: ${data?.id}]`);
    return data;
  } catch (error) {
    console.error("Email service failed:", error.message);
    throw error;
  }
};

const emailVerificationMailgenContent = (username, verficationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App! we'are excited to have you on board.",
      action: {
        instructions: "To get started with Mailgen, please click here:",
        button: {
          color: "#22BC66",
          text: "Confirm your account",
          link: verficationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, verficationUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account",
      action: {
        instructions:
          "To reset your password click on the following button or link",

        button: {
          color: "#22BC66",
          text: "Reset password",
          link: verficationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};

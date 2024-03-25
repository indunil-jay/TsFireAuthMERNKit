import nodemailer from "nodemailer";

type Options = {
  email: string;
  subject: string;
  message: string;
};

const sendEmail = async (options: Options) => {
  //1 trnaspoter
  const transpoter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 25,
    auth: {
      user: "8a52749ef33dd4",
      pass: "a46a9650bb93d2",
    },

    //activate in gmail 'less secure app" option in google
  });
  //2 define email optioms
  const mailOptions = {
    from: "indunil jay <indunil@example.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3 Actuall send the email
  await transpoter.sendMail(mailOptions);
};

export default sendEmail;

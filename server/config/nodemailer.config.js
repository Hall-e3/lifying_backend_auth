import nodemailer from "nodemailer";
// creating the email sender
// let testAccount = await nodemailer.createTestAccount();
const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "hallenochasanda@gmail.com",
    pass: "Enoch112",
  },
});
// creating the email itself and reciever

export const sendConfirmationEmail = async (name, email, confirmation_code) => {
  console.log("Check");
  await transport
    .sendMail({
      from: "hallenochasanda@gmail.com",
      to: email,
      subject: "Please confirm your account",
      html: `<div>
      <h1>Email Confirmation</h1>
      <h2>Hello ${name}</h2>
      <p>Thank you for subscribing lify.com. Please confirm your email by clicking on the following link!</p>
      <a href=http://localhost:5000/auth/confirm/${confirmation_code}> Click here</a>
      </div>`,
    })
    .catch((error) => console.log(error.message));
};

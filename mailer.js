const nodemailer = require("nodemailer");

let transporter;
async function main() {
  // create reusable transporter object using the default SMTP transport
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "csionapp@gmail.com",
      pass: process.env.mailPassword
    }
  });
}
main();
async function sendVerification(email, userid) {
  console.log("email " + email);
  console.log("user " + userid);
  // send mail with defined transport object
  let verification = await transporter.sendMail({
    from: '"Csion Team 👻" <csionapp@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Csion App Email Verification ✔", // Subject line
    html: `Congratulations! We've successfully created your account.\n
          Please verify your email by clicking verify button: <a href=https://csion.glitch.me/emailVerification?userid=${userid}>Verify</a>
          \nThanks, \nCsion Team.` // html body
  });

  console.log("Message sent: %s", verification.messageId);
}

exports.sendVerification = sendVerification;

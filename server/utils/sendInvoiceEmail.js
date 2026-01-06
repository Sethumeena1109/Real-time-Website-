import nodemailer from "nodemailer";

export const sendInvoiceEmail = async ({ email, plan, amount }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Subscription Invoice - StackOverflow Clone",
    text: `
Thank you for your subscription!

Plan: ${plan}
Amount Paid: ₹${amount / 100}
Billing Date: ${new Date().toLocaleDateString()}

Happy Coding!
`,
  };

  await transporter.sendMail(mailOptions);
};

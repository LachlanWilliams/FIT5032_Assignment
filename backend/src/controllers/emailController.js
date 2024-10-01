// backend/src/controllers/emailController.js
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.VITE_SENDGRID_API_KEY);

const sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;
  const msg = {
    to: to,
    from: 'your-email@example.com',
    subject: subject,
    text: text,
  };

  try {
    await sgMail.send(msg);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending email.');
  }
};

module.exports = { sendEmail };

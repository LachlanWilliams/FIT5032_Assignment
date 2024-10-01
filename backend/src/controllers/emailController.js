// backend/src/controllers/emailController.js
import { setApiKey, send } from '@sendgrid/mail';

setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;
  const msg = {
    to: to,
    from: 'your-email@example.com',
    subject: subject,
    text: text,
  };

  try {
    await send(msg);
    res.status(200).send('Email sent successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending email.');
  }
};

export default { sendEmail };

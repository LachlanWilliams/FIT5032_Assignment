import express from 'express';
import pkg from 'body-parser';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import cors from 'cors';  // Import cors

const { json } = pkg;
dotenv.config();  // Load environment variables

const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());

app.use(json());

const apiKey = process.env.VITE_SENDGRID_API_KEY;  // Retrieve API key
if (!apiKey || !apiKey.startsWith('SG.')) {
    throw new Error('API key does not start with "SG." or is not set.');
}

console.log("API KEY")
console.log(apiKey);
sgMail.setApiKey(apiKey);

// Endpoint to send email when carer is accepted
app.post('/send-acceptance-email', (req, res) => {
  const { email, name } = req.body;

  const msg = {
    to: email,
    from: 'lachlanwilliams43@gmail.com', // Change this to your verified SendGrid email
    subject: 'Carer Application Accepted',
    text: `Hi ${name},\n\nCongratulations! Your application to become a carer has been accepted.\nPlease go to our website to update your profile.\n\nBest regards,\nDementia Australia`,
    html: `<p>Hi ${name},</p><p>Congratulations! Your application to become a carer has been accepted.<br/>Please go to our website to update your profile.</p><p>Best regards,<br/>Dementia Australia</p>`,
  };

  sgMail.send(msg)
    .then(() => {
      res.status(200).json({ message: 'Email sent successfully' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Failed to send email' });
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

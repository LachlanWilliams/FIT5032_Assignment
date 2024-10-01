// backend/src/routes/emailRoutes.js
const express = require('express');
const { sendEmail } = require('../controllers/emailController').default;
const router = express.Router();

router.post('/send-email', sendEmail);

module.exports = router;

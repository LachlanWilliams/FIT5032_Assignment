/* eslint-disable max-len */
/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
// const sgMail = require("@sendgrid/mail");
// const {onDocumentCreated} = require("firebase-functions/v2/firestore");

admin.initializeApp();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.countCarers = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const carersCollection = admin.firestore().collection("carers");
      const snapshot = await carersCollection.get();
      const count = snapshot.size;

      res.status(200).send({count});
    } catch (error) {
      console.error("Error counting carers:", error.message);
      res.status(500).send("Error counting carers");
    }
  });
});

exports.countUsers = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const carersCollection = admin.firestore().collection("users");
      const snapshot = await carersCollection.get();
      const count = snapshot.size;

      res.status(200).send({count});
    } catch (error) {
      console.error("Error counting users:", error.message);
      res.status(500).send("Error counting users");
    }
  });
});

// eslint-disable-next-line max-len
// exports.sendAcceptanceEmail = onDocumentCreated("/carer/{documentId}", async (event) => {
//   const carerData = event.data.data();
//   const userID = carerData.userID;

//   try {
//     // Get the user document from the users collection using the userID
//     // eslint-disable-next-line max-len
//     const userDoc = await admin.firestore().collection("users").doc(userID).get();

//     if (!userDoc.exists) {
//       console.error(`User with ID ${userID} not found`);
//       return;
//     }

//     // Get the user's email from the user document
//     const userEmail = userDoc.data().email;

//     if (!userEmail) {
//       console.error(`Email not found for user with ID ${userID}`);
//       return;
//     }

//     // Prepare the email message
//     const msg = {
//       to: userEmail, // Send the email to the user's email
//       from: "test@example.com", // Change to your verified sender email
//       subject: "Carer Application Accepted",
//       text: "Congratulations, your carer application has been accepted!",
//       // eslint-disable-next-line max-len, max-len
//       html: "<strong>Congratulations, your carer application has been accepted!</strong>",
//     };

//     // Send the email
//     await sgMail.send(msg);
//     console.log(`Email sent to ${userEmail}`);
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// });

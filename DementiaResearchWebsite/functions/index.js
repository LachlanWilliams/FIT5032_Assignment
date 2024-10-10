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

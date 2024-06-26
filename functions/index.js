/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const {Storage} = require("@google-cloud/storage");
const storage = new Storage();

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.deleteUserAccount = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
          "unauthenticated",
          "The function must be called while authenticated.",
      );
    }
  
    const userId = data.userId;
    if (!userId) {
      throw new functions.https.HttpsError(
          "invalid-argument",
          "Please provide a user ID.",
      );
    }
  
    try {
      // Delete user document from Firestore user collection
      const userDoc = admin.firestore().doc(`users/${userId}`);
      await userDoc.delete();
  
      // Delete user document from admin_users collection
      const adminUserDoc = admin.firestore().doc(`admin_users/${userId}`);
      await adminUserDoc.delete();
  
      // Delete user data from Firebase Storage
      const bucket = storage.bucket("gs://fir-app-6e8f9.appspot.com");
      const userFolder = `users/${userId}`;
      await bucket.deleteFiles({
        prefix: userFolder,
      });
  
      // Finally, delete the user from Firebase Auth
      await admin.auth().deleteUser(userId);
  
      return {success: true, message: "User deleted successfully."};
    } catch (error) {
      console.error("Error deleting user:", error);
  
      if (error.code === "auth/user-not-found") {
        // Case where the user doesn't exist in Firebase Authentication.
        throw new functions.https.HttpsError("not-found", "User not found.");
      } else {
        // Handle other errors.
        throw new functions.https.HttpsError("unknown", "Failed to delete user.");
      }
    }
  });

  exports.deleteUserByPhone = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }
  
    const phoneNumber = data.phoneNumber;
    if (!phoneNumber) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Please provide a phone number."
      );
    }
  
    try {
      // Retrieve the user ID associated with the phone number
      const userRecord = await admin.auth().getUserByPhoneNumber(phoneNumber);
      const userId = userRecord.uid;
  
      // Optional: Delete user's Firestore document
      const userDoc = admin.firestore().doc(`users/${userId}`);
      await userDoc.delete();
  
      // Delete the user from Firebase Authentication
      await admin.auth().deleteUser(userId);
  
      return { success: true, message: "User deleted successfully." };
    } catch (error) {
      console.error("Error deleting user by phone:", error);
  
      if (error.code === "auth/user-not-found") {
        throw new functions.https.HttpsError("not-found", "User not found.");
      } else {
        throw new functions.https.HttpsError("unknown", "Failed to delete user.");
      }
    }
  });
  
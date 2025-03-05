
import admin from "firebase-admin";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Get the current file's directory
const __dirname = dirname(fileURLToPath(import.meta.url));

// Construct path to service account file
const serviceAccountPath = join(__dirname, "../../../firebase-service-account.json");

// Read and parse the service account file
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

// Initialize Firebase Admin SDK
const initFirebase = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  return admin;
};

// Middleware to verify Firebase ID token
export const verifyFirebaseToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const firebase = initFirebase();
    const decodedToken = await firebase.auth().verifyIdToken(idToken);

    // Verify that the token is issued by your Firebase project
    const projectId = process.env.FIREBASE_PROJECT_ID; // Set your project ID in an environment variable
    if (
      decodedToken.aud !== projectId || // Verify audience
      decodedToken.iss !== `https://securetoken.google.com/${projectId}` // Verify issuer
    ) {
      return res.status(403).json({ error: "Token not issued by the correct Firebase project" });
    }

    // Attach user information to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      roles: decodedToken.roles || [], // Custom claims for roles, if any
    };

    next();
  } catch (error) {
    console.error("Firebase token verification error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

export default initFirebase;
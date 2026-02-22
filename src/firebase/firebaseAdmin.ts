import * as admin from "firebase-admin";

function getFirebaseAdmin() {
  if (admin.apps.length) {
    return admin;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!projectId || !clientEmail || !privateKey) {
    console.error("Firebase Admin: Missing required environment variables");
    console.error("FIREBASE_PROJECT_ID:", projectId ? "set" : "MISSING");
    console.error("FIREBASE_CLIENT_EMAIL:", clientEmail ? "set" : "MISSING");
    throw new Error("Firebase Admin credentials are not configured");
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
      storageBucket,
    });
  } catch (error) {
    console.error("Firebase Admin initialization failed:", error);
    throw error;
  }

  return admin;
}

const firebaseAdmin = getFirebaseAdmin();

export const adminDB = firebaseAdmin.firestore();

export const adminStorage = firebaseAdmin
  .storage()
  .bucket(process.env.FIREBASE_STORAGE_BUCKET);

export default firebaseAdmin;

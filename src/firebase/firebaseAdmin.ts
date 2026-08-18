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
    console.error("FIREBASE_PRIVATE_KEY:", privateKey ? "set" : "MISSING");
    throw new Error("Firebase Admin credentials are not configured");
  }

  // Normalise the private key regardless of how it was pasted:
  // 1. Strip surrounding double-quotes (common when copying from JSON)
  // 2. Convert literal \n sequences to real newlines
  // 3. If key has no PEM header (raw base64 only), wrap it in proper PEM format
  let normalizedKey = privateKey.trim();
  if (normalizedKey.startsWith('"') && normalizedKey.endsWith('"')) {
    normalizedKey = normalizedKey.slice(1, -1);
  }
  normalizedKey = normalizedKey.replace(/\\n/g, "\n");

  if (!normalizedKey.includes("-----BEGIN")) {
    // Raw base64 body — reconstruct proper PEM with 64-char line wrapping
    const body = normalizedKey.replace(/\s+/g, "");
    const lines = body.match(/.{1,64}/g) ?? [];
    normalizedKey = `-----BEGIN PRIVATE KEY-----\n${lines.join("\n")}\n-----END PRIVATE KEY-----\n`;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: normalizedKey,
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

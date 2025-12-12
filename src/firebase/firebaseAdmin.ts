import admin from "firebase-admin";

if (!admin.apps.length) {
  const raw = process.env.FIREBASE_ADMIN_CREDENTIALS!;
  const serviceAccount = JSON.parse(raw);

  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, 
  });
}

export const adminDB = admin.firestore();

// IMPORTANT FIX — use bucket()
export const adminStorage = admin.storage().bucket();

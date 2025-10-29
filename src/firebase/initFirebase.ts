// src/firebase/initFirebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import firebaseConfig from "./firebaseConfig";

// Prevent reinitializing in hot-reloading (Next.js dev mode)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export default app;

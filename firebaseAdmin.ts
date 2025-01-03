import {
  initializeApp,
  cert,
  getApp,
  getApps,
  applicationDefault,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK
const app =
  getApps().length === 0
    ? initializeApp({
        credential: applicationDefault(),
        projectId: "studysesh-be131",
      })
    : getApp(); // Use the existing app if already initialized

// Export Firebase Admin services
export const authAdmin = getAuth(app);
export const firestoreAdmin = getFirestore(app);

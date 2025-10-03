import {
  applicationDefault,
  getApp,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const app =
  getApps().length === 0
    ? initializeApp({
        credential: applicationDefault(),
        projectId: "studysesh-be131",
      })
    : getApp(); // Use the existing app if already initialized

export const authAdmin = getAuth(app);
export const firestoreAdmin = getFirestore(app);

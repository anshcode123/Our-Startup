import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

let cachedApp = null;
let cachedDb = null;

export function isFirebaseConfigured() {
  return Boolean(
    firebaseConfig.projectId &&
      firebaseConfig.apiKey &&
      firebaseConfig.projectId.trim().length > 0
  );
}

export function getFirebaseApp() {
  if (typeof window === "undefined" && !isFirebaseConfigured()) {
    return null;
  }
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (cachedApp) {
    return cachedApp;
  }

  try {
    cachedApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    return cachedApp;
  } catch (error) {
    console.warn("[Firebase] Initialization notice:", error.message);
    return null;
  }
}

export function getFirestoreDb() {
  if (cachedDb) return cachedDb;
  const app = getFirebaseApp();
  if (!app) return null;

  try {
    cachedDb = getFirestore(app);
    return cachedDb;
  } catch (error) {
    console.warn("[Firestore] Initialization notice:", error.message);
    return null;
  }
}

/**
 * Reads global theme from Firestore settings/site document.
 * Returns "dark" | "light" | null
 */
export async function fetchFirestoreTheme() {
  const db = getFirestoreDb();
  if (!db) return null;

  try {
    const docRef = doc(db, "settings", "site");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data?.theme === "light" || data?.theme === "dark") {
        return data.theme;
      }
    }
    return null;
  } catch (error) {
    console.warn("[Firestore] Failed to read settings/site:", error.message);
    return null;
  }
}

/**
 * Subscribes to real-time updates for Firestore settings/site document.
 * Returns unsubscribe function.
 */
export function subscribeFirestoreTheme(onThemeChange) {
  const db = getFirestoreDb();
  if (!db) return () => {};

  try {
    const docRef = doc(db, "settings", "site");
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data?.theme === "light" || data?.theme === "dark") {
            onThemeChange(data.theme);
          }
        }
      },
      (error) => {
        console.warn("[Firestore] Real-time listener notice:", error.message);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn("[Firestore] Failed to attach real-time listener:", error.message);
    return () => {};
  }
}

/**
 * Updates settings/site.theme in Firestore.
 */
export async function updateFirestoreTheme(newTheme) {
  if (newTheme !== "dark" && newTheme !== "light") {
    throw new Error("Invalid theme value. Allowed values: 'dark' | 'light'");
  }

  const db = getFirestoreDb();
  if (!db) {
    return false;
  }

  try {
    const docRef = doc(db, "settings", "site");
    await setDoc(
      docRef,
      {
        theme: newTheme,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.warn("[Firestore] Failed to update settings/site:", error.message);
    return false;
  }
}
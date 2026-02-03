import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

/**
 * Firebase Configuration
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to Firebase Console: https://console.firebase.google.com/
 * 2. Create a new project or select existing one
 * 3. Add a Web app to your project
 * 4. Copy the configuration values below
 * 5. Enable Authentication (Email/Password, Google, Apple)
 * 6. Create a Firestore Database
 * 7. Create a Storage bucket
 *
 * For Expo/React Native:
 * - Use the Web SDK configuration (not native SDKs)
 * - The web SDK works well with Expo managed workflow
 */

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// Check if Firebase is configured
const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

// Initialize Firebase (only once)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (getApps().length === 0) {
  if (!isConfigured) {
    console.warn(
      '⚠️ Firebase is not configured. Please update src/services/firebase/config.ts with your Firebase project credentials.'
    );
  }
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

export { app, auth, db, storage, isConfigured };

// Collection names (centralized for consistency)
export const COLLECTIONS = {
  USERS: 'users',
  PNJ_PROFILES: 'pnjProfiles',
  BOOKINGS: 'bookings',
  CHATS: 'chats',
  MESSAGES: 'messages', // Subcollection of chats
  REVIEWS: 'reviews',
  REPORTS: 'reports',
  EMERGENCIES: 'emergencies',
  MISSION_TEMPLATES: 'missionTemplates',
  CONFIG: 'config',
  // User subcollections
  USER_MISSIONS: 'missions',
  USER_SOUVENIRS: 'souvenirs',
  USER_NOTIFICATIONS: 'notifications',
} as const;

// Storage paths
export const STORAGE_PATHS = {
  AVATARS: 'avatars',
  PNJ_PHOTOS: 'pnj-photos',
  CHAT_IMAGES: 'chat-images',
} as const;

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  DocumentSnapshot,
  QueryConstraint,
  Timestamp,
  serverTimestamp,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove,
  GeoPoint,
} from 'firebase/firestore';
import { db } from './config';

// Re-export useful Firestore types and functions
export {
  Timestamp,
  serverTimestamp,
  GeoPoint,
  increment,
  arrayUnion,
  arrayRemove,
};

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PNJ_PROFILES: 'pnjProfiles',
  BOOKINGS: 'bookings',
  CHATS: 'chats',
  MESSAGES: 'messages',
  REVIEWS: 'reviews',
  REPORTS: 'reports',
  EMERGENCIES: 'emergencies',
  MISSION_TEMPLATES: 'missionTemplates',
  CONFIG: 'config',
} as const;

// Generic get document
export async function getDocument<T>(
  collectionName: string,
  documentId: string
): Promise<T | null> {
  const docRef = doc(db, collectionName, documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}

// Generic set document (create or overwrite)
export async function setDocument<T extends Record<string, unknown>>(
  collectionName: string,
  documentId: string,
  data: T,
  merge = false
): Promise<void> {
  const docRef = doc(db, collectionName, documentId);
  await setDoc(docRef, data, { merge });
}

// Generic update document
export async function updateDocument<T extends Record<string, unknown>>(
  collectionName: string,
  documentId: string,
  data: Partial<T>
): Promise<void> {
  const docRef = doc(db, collectionName, documentId);
  await updateDoc(docRef, data as Record<string, unknown>);
}

// Generic delete document
export async function deleteDocument(
  collectionName: string,
  documentId: string
): Promise<void> {
  const docRef = doc(db, collectionName, documentId);
  await deleteDoc(docRef);
}

// Generic query documents
export async function queryDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[]
): Promise<T[]> {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}

// Subscribe to document changes
export function subscribeToDocument<T>(
  collectionName: string,
  documentId: string,
  callback: (data: T | null) => void
): () => void {
  const docRef = doc(db, collectionName, documentId);

  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as T);
    } else {
      callback(null);
    }
  });
}

// Subscribe to collection/query changes
export function subscribeToQuery<T>(
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (data: T[]) => void
): () => void {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...constraints);

  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
    callback(data);
  });
}

// Batch write helper
export function createBatch() {
  return writeBatch(db);
}

// Get collection reference
export function getCollectionRef(collectionName: string) {
  return collection(db, collectionName);
}

// Get document reference
export function getDocRef(collectionName: string, documentId: string) {
  return doc(db, collectionName, documentId);
}

// Get subcollection reference
export function getSubcollectionRef(
  collectionName: string,
  documentId: string,
  subcollectionName: string
) {
  return collection(db, collectionName, documentId, subcollectionName);
}

// Query helpers
export { where, orderBy, limit, startAfter };

// Convert date to Timestamp
export function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

// Convert Timestamp to Date
export function timestampToDate(timestamp: Timestamp): Date {
  return timestamp.toDate();
}

// Create GeoPoint
export function createGeoPoint(latitude: number, longitude: number): GeoPoint {
  return new GeoPoint(latitude, longitude);
}

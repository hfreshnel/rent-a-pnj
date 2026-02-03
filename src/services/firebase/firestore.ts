import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  DocumentData,
  QueryConstraint,
  DocumentReference,
  CollectionReference,
  Timestamp,
  serverTimestamp,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove,
  GeoPoint,
} from 'firebase/firestore';
import { db, COLLECTIONS } from './config';

/**
 * Firestore Service
 *
 * Generic CRUD operations and helpers for Firestore
 */

// Get a document by ID
export const getDocument = async <T>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }

  return null;
};

// Get multiple documents with query
export const getDocuments = async <T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
};

// Create a document with auto-generated ID
export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> => {
  const collectionRef = collection(db, collectionName);
  const docRef = doc(collectionRef);
  await setDoc(docRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

// Create a document with specific ID
export const setDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T,
  merge: boolean = false
): Promise<void> => {
  const docRef = doc(db, collectionName, docId);
  await setDoc(
    docRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge }
  );
};

// Update a document
export const updateDocument = async <T extends Partial<DocumentData>>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// Delete a document
export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};

// Subscribe to a document
export const subscribeToDocument = <T>(
  collectionName: string,
  docId: string,
  callback: (data: T | null) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const docRef = doc(db, collectionName, docId);

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as T);
      } else {
        callback(null);
      }
    },
    onError
  );
};

// Subscribe to a collection with query
export const subscribeToCollection = <T>(
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (data: T[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...constraints);

  return onSnapshot(
    q,
    (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      callback(data);
    },
    onError
  );
};

// Batch write helper
export const batchWrite = async (
  operations: Array<{
    type: 'set' | 'update' | 'delete';
    collection: string;
    docId: string;
    data?: DocumentData;
  }>
): Promise<void> => {
  const batch = writeBatch(db);

  operations.forEach((op) => {
    const docRef = doc(db, op.collection, op.docId);
    switch (op.type) {
      case 'set':
        batch.set(docRef, { ...op.data, updatedAt: serverTimestamp() });
        break;
      case 'update':
        batch.update(docRef, { ...op.data, updatedAt: serverTimestamp() });
        break;
      case 'delete':
        batch.delete(docRef);
        break;
    }
  });

  await batch.commit();
};

// Helpers for common operations
export const firestoreHelpers = {
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp,
  GeoPoint,
  where,
  orderBy,
  limit,
  startAfter,
};

// Get subcollection reference
export const getSubcollection = (
  parentCollection: string,
  parentId: string,
  subcollectionName: string
): CollectionReference => {
  return collection(db, parentCollection, parentId, subcollectionName);
};

// Get document in subcollection
export const getSubcollectionDocument = async <T>(
  parentCollection: string,
  parentId: string,
  subcollectionName: string,
  docId: string
): Promise<T | null> => {
  const docRef = doc(db, parentCollection, parentId, subcollectionName, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }

  return null;
};

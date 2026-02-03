// Firebase configuration and instances
export {
  app,
  auth,
  db,
  storage,
  isConfigured,
  COLLECTIONS,
  STORAGE_PATHS,
} from './config';

// Authentication service
export {
  registerWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signInWithApple,
  logOut,
  resetPassword,
  resendEmailVerification,
  updateUserProfile,
  getCurrentUser,
  subscribeToAuthState,
  isEmailVerified,
  reloadUser,
} from './auth';

// Firestore service
export {
  getDocument,
  getDocuments,
  createDocument,
  setDocument,
  updateDocument,
  deleteDocument,
  subscribeToDocument,
  subscribeToCollection,
  batchWrite,
  firestoreHelpers,
  getSubcollection,
  getSubcollectionDocument,
} from './firestore';

// Storage service
export {
  uploadFile,
  uploadFileWithProgress,
  deleteFile,
  deleteFileByURL,
  getFileURL,
  listFiles,
  generateFilePath,
  uploadAvatar,
  uploadPNJPhoto,
  uploadChatImage,
  validateImage,
} from './storage';

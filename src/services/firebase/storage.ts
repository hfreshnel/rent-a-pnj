import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTask,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { storage, STORAGE_PATHS, isConfigured } from './config';

/**
 * Firebase Storage Service
 *
 * Provides methods for file upload/download/delete operations
 */

// Upload file from URI (React Native)
export const uploadFile = async (
  path: string,
  uri: string,
  contentType: string = 'image/jpeg'
): Promise<string> => {
  if (!isConfigured) {
    throw new Error('Firebase is not configured');
  }

  // Fetch the file as blob
  const response = await fetch(uri);
  const blob = await response.blob();

  // Create storage reference
  const storageRef = ref(storage, path);

  // Upload
  await uploadBytes(storageRef, blob, { contentType });

  // Get download URL
  return getDownloadURL(storageRef);
};

// Upload file with progress tracking
export const uploadFileWithProgress = (
  path: string,
  uri: string,
  contentType: string = 'image/jpeg',
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    if (!isConfigured) {
      reject(new Error('Firebase is not configured'));
      return;
    }

    try {
      // Fetch the file as blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Create storage reference
      const storageRef = ref(storage, path);

      // Upload with resumable
      const uploadTask = uploadBytesResumable(storageRef, blob, { contentType });

      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

// Delete file
export const deleteFile = async (path: string): Promise<void> => {
  if (!isConfigured) {
    throw new Error('Firebase is not configured');
  }

  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
};

// Delete file by URL
export const deleteFileByURL = async (url: string): Promise<void> => {
  if (!isConfigured) {
    throw new Error('Firebase is not configured');
  }

  const storageRef = ref(storage, url);
  await deleteObject(storageRef);
};

// Get download URL
export const getFileURL = async (path: string): Promise<string> => {
  if (!isConfigured) {
    throw new Error('Firebase is not configured');
  }

  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
};

// List files in a directory
export const listFiles = async (path: string): Promise<string[]> => {
  if (!isConfigured) {
    throw new Error('Firebase is not configured');
  }

  const storageRef = ref(storage, path);
  const result = await listAll(storageRef);
  return Promise.all(result.items.map((item) => getDownloadURL(item)));
};

// Helper to generate unique file path
export const generateFilePath = (
  folder: string,
  userId: string,
  fileName?: string
): string => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);
  const name = fileName || `${timestamp}_${randomId}`;
  return `${folder}/${userId}/${name}`;
};

// Upload avatar
export const uploadAvatar = async (userId: string, uri: string): Promise<string> => {
  const path = generateFilePath(STORAGE_PATHS.AVATARS, userId, 'avatar.jpg');
  return uploadFile(path, uri, 'image/jpeg');
};

// Upload PNJ photo
export const uploadPNJPhoto = async (
  userId: string,
  uri: string,
  index: number
): Promise<string> => {
  const path = generateFilePath(STORAGE_PATHS.PNJ_PHOTOS, userId, `photo_${index}.jpg`);
  return uploadFile(path, uri, 'image/jpeg');
};

// Upload chat image
export const uploadChatImage = async (
  chatId: string,
  uri: string
): Promise<string> => {
  const path = generateFilePath(STORAGE_PATHS.CHAT_IMAGES, chatId);
  return uploadFile(path, uri, 'image/jpeg');
};

// Validate image (check size, type)
export const validateImage = (fileSize: number, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return fileSize <= maxSizeBytes;
};

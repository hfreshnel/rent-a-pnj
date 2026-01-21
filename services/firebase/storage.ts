import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { storage } from './config';

// Storage paths
export const STORAGE_PATHS = {
  AVATARS: 'avatars',
  PNJ_PHOTOS: 'pnj-photos',
  CHAT_IMAGES: 'chat-images',
} as const;

// Upload a file and get download URL
export async function uploadFile(
  path: string,
  file: Blob | ArrayBuffer | Uint8Array,
  contentType?: string
): Promise<string> {
  const storageRef = ref(storage, path);
  const metadata = contentType ? { contentType } : undefined;

  await uploadBytes(storageRef, file, metadata);
  return getDownloadURL(storageRef);
}

// Upload file with progress tracking
export function uploadFileWithProgress(
  path: string,
  file: Blob | ArrayBuffer | Uint8Array,
  onProgress?: (progress: number) => void,
  contentType?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const metadata = contentType ? { contentType } : undefined;

    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

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
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

// Delete a file
export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

// Get download URL for existing file
export async function getFileUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}

// Helper to generate unique file path
export function generateFilePath(
  folder: string,
  userId: string,
  fileName: string
): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.]/g, '_');
  return `${folder}/${userId}/${timestamp}_${sanitizedFileName}`;
}

// Upload user avatar
export async function uploadAvatar(
  userId: string,
  file: Blob | ArrayBuffer | Uint8Array,
  contentType = 'image/jpeg'
): Promise<string> {
  const path = `${STORAGE_PATHS.AVATARS}/${userId}/avatar.jpg`;
  return uploadFile(path, file, contentType);
}

// Upload PNJ photo
export async function uploadPNJPhoto(
  userId: string,
  file: Blob | ArrayBuffer | Uint8Array,
  index: number,
  contentType = 'image/jpeg'
): Promise<string> {
  const path = `${STORAGE_PATHS.PNJ_PHOTOS}/${userId}/photo_${index}.jpg`;
  return uploadFile(path, file, contentType);
}

// Upload chat image
export async function uploadChatImage(
  chatId: string,
  file: Blob | ArrayBuffer | Uint8Array,
  fileName: string,
  contentType = 'image/jpeg'
): Promise<string> {
  const timestamp = Date.now();
  const path = `${STORAGE_PATHS.CHAT_IMAGES}/${chatId}/${timestamp}_${fileName}`;
  return uploadFile(path, file, contentType);
}

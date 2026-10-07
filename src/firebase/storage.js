// src/firebase/storage.js - Firebase Storage Service
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  updateMetadata
} from 'firebase/storage';
import { storage } from './config';

// ============ UPLOAD FUNCTIONS ============

export const uploadFile = async (path, file, metadata = {}) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { success: true, url: downloadURL, path: snapshot.ref.fullPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const uploadFileWithProgress = (path, file, onProgress, metadata = {}) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress, snapshot);
        }
      },
      (error) => {
        reject({ success: false, error: error.message });
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            success: true,
            url: downloadURL,
            path: uploadTask.snapshot.ref.fullPath
          });
        } catch (error) {
          reject({ success: false, error: error.message });
        }
      }
    );
  });
};

export const uploadMultipleFiles = async (files, basePath, onProgress) => {
  const results = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const path = `${basePath}/${timestamp}_${i}.${ext}`;
    
    const result = await uploadFile(path, file);
    results.push({ file: file.name, ...result });
    
    if (onProgress) {
      onProgress(((i + 1) / files.length) * 100);
    }
  }
  return results;
};

// ============ DELETE FUNCTIONS ============

export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteFiles = async (paths) => {
  try {
    const results = await Promise.all(paths.map(path => deleteFile(path)));
    return { success: true, results };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ============ GET FILE INFO ============

export const getFileURL = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return { success: true, url };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getFileMetadata = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const metadata = await getMetadata(storageRef);
    return { success: true, metadata };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateFileMetadata = async (path, metadata) => {
  try {
    const storageRef = ref(storage, path);
    await updateMetadata(storageRef, metadata);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ============ LIST FILES ============

export const listFiles = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    return {
      success: true,
      data: {
        prefixes: result.prefixes.map(ref => ref.fullPath),
        items: result.items.map(item => ({
          name: item.name,
          path: item.fullPath
        }))
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ============ PRODUCT IMAGE HELPERS ============

export const uploadProductImage = async (productId, file) => {
  const timestamp = Date.now();
  const ext = file.name.split('.').pop();
  const path = `products/${productId}/${timestamp}.${ext}`;
  return uploadFile(path, file);
};

export const uploadProductImages = async (productId, files) => {
  const basePath = `products/${productId}`;
  return uploadMultipleFiles(files, basePath);
};

export const deleteProductImages = async (productId) => {
  const result = await listFiles(`products/${productId}`);
  if (result.success && result.data.items.length > 0) {
    const paths = result.data.items.map(item => item.path);
    return deleteFiles(paths);
  }
  return { success: true };
};

// ============ USER AVATAR ============

export const uploadAvatar = async (userId, file) => {
  const ext = file.name.split('.').pop();
  const path = `avatars/${userId}.${ext}`;
  return uploadFile(path, file, {
    contentType: file.type,
    cacheControl: 'public, max-age=31536000'
  });
};

export const deleteAvatar = async (userId) => {
  // Try common extensions
  const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  for (const ext of extensions) {
    const result = await deleteFile(`avatars/${userId}.${ext}`);
    if (result.success) return result;
  }
  return { success: false, error: 'Avatar not found' };
};

// ============ CATEGORY IMAGES ============

export const uploadCategoryImage = async (categoryId, file) => {
  const ext = file.name.split('.').pop();
  const path = `categories/${categoryId}.${ext}`;
  return uploadFile(path, file);
};

// ============ BANNER IMAGES ============

export const uploadBannerImage = async (bannerId, file) => {
  const ext = file.name.split('.').pop();
  const path = `banners/${bannerId}.${ext}`;
  return uploadFile(path, file);
};

// ============ CHAT ATTACHMENTS ============

export const uploadChatAttachment = async (chatId, file) => {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const path = `chats/${chatId}/${timestamp}_${safeName}`;
  return uploadFile(path, file);
};

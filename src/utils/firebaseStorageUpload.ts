
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { storage } from "@/firebase/firebaseServices";

/**
 * Upload file to Firebase Storage
 * @param file - File to upload
 * @param folder - Target folder in Firebase Storage
 * @returns Promise<string> - The download URL
 */
export async function uploadToFirebaseStorage(
  file: File,
  folder: "blogs" | "events" | "retreats"
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const fileExtension = file.name.split(".").pop();
      const sanitizedName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase()
        .substring(0, 20);

      const fileName = `${sanitizedName}-${timestamp}-${random}.${fileExtension}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type,
        customMetadata: {
          uploadedAt: new Date().toISOString(),
        },
      });

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress.toFixed(2)}%`);
        },
        (error) => {
          console.error("Upload error:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Upload complete. Download URL:", downloadURL);
            resolve(downloadURL);
          } catch (error) {
            console.error("Error getting download URL:", error);
            reject(error);
          }
        }
      );
    } catch (error) {
      console.error("Error in uploadToFirebaseStorage:", error);
      reject(error);
    }
  });
}


export async function deleteFromFirebaseStorage(
  imageUrl: string
): Promise<void> {
  try {
    if (
      !imageUrl ||
      !(
        imageUrl.includes("firebasestorage.googleapis.com") ||
        imageUrl.includes("firebasestorage.app")
      )
    ) {
      console.log("Invalid or non-Firebase URL, skipping deletion:", imageUrl);
      return;
    }

    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/\/o\/(.+?)(\?|$)/);

    if (!pathMatch) {
      console.error("Could not extract file path from URL:", imageUrl);
      return;
    }

    const filePath = decodeURIComponent(pathMatch[1]);
    console.log("Attempting to delete file at path (client):", filePath);

    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);

    console.log("Successfully deleted file (client):", filePath);
  } catch (error: any) {
    if (error?.code === "storage/object-not-found") {
      console.log("File not found (may already be deleted):", imageUrl);
      return;
    }

    console.error("Error deleting from Firebase Storage (client):", error);
    throw error;
  }
}


/**
 * Wrapper function for image upload
 */
export const uploadImage = async (
  file: File,
  folder: "blogs" | "events" | "retreats"
): Promise<string | null> => {
  try {
    const downloadURL = await uploadToFirebaseStorage(file, folder);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    alert(
      "Failed to upload image: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
    return null;
  }
};


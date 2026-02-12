import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { storage } from "@/firebase/firebaseServices";

/**
 * Convert image to PNG or JPG format
 * @param file - Original file
 * @param targetFormat - 'png' or 'jpeg'
 * @returns Promise<File> - Converted file
 */
async function convertImageFormat(
  file: File,
  targetFormat: "png" | "jpeg" = "jpeg"
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Draw image on canvas
        ctx.drawImage(img, 0, 0);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to convert image"));
              return;
            }

            // Create new file with converted format
            const extension = targetFormat === "png" ? "png" : "jpg";
            const mimeType = targetFormat === "png" ? "image/png" : "image/jpeg";
            const originalName = file.name.replace(/\.[^/.]+$/, "");
            const convertedFile = new File(
              [blob],
              `${originalName}.${extension}`,
              { type: mimeType }
            );

            console.log(`Image converted from ${file.type} to ${mimeType}`);
            resolve(convertedFile);
          },
          targetFormat === "png" ? "image/png" : "image/jpeg",
          0.92 // Quality for JPEG (0.92 is high quality)
        );
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Check if file is an image
 */
function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Upload file to Firebase Storage
 * @param file - File to upload
 * @param folder - Target folder in Firebase Storage
 * @returns Promise<string> - The download URL
 */
export async function uploadToFirebaseStorage(
  file: File,
  folder: "blogs" | "events" | "retreats" | "products" | "about"

): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      let fileToUpload = file;

      // ALWAYS convert image files to JPEG before uploading
      if (isImageFile(file)) {
        console.log(`Converting ${file.name} (${file.type}) to JPEG...`);
        try {
          fileToUpload = await convertImageFormat(file, "jpeg");
          console.log("Image converted successfully to JPEG");
        } catch (conversionError) {
          console.error("Image conversion failed:", conversionError);
          // If conversion fails, try PNG as fallback
          try {
            fileToUpload = await convertImageFormat(file, "png");
            console.log("Image converted successfully to PNG (fallback)");
          } catch (pngError) {
            console.error("PNG conversion also failed, uploading original:", pngError);
            // If both fail, upload original
          }
        }
      }

      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const fileExtension = fileToUpload.name.split(".").pop();
      const sanitizedName = fileToUpload.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase()
        .substring(0, 20);

      const fileName = `${sanitizedName}-${timestamp}-${random}.${fileExtension}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);

      console.log(`Uploading file: ${fileName} (${fileToUpload.type})`);

      const uploadTask = uploadBytesResumable(storageRef, fileToUpload, {
        contentType: fileToUpload.type,
        customMetadata: {
          uploadedAt: new Date().toISOString(),
          originalFormat: file.type,
          originalName: file.name,
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

export const uploadImage = async (
  file: File,
  folder: "blogs" | "events" | "retreats" | "products" | "about"
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
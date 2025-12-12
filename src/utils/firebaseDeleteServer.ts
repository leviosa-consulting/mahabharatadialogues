
import { adminStorage } from "@/firebase/firebaseAdmin";

export async function deleteFromFirebaseStorageServer(
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
      console.log("Invalid or non-Firebase URL (server), skipping:", imageUrl);
      return;
    }

    const encodedPath = imageUrl.split("/o/")[1]?.split("?")[0];
    if (!encodedPath) {
      console.error(  
        "Could not extract file path from URL on server:",
        imageUrl
      );
      return;
    }

    const filePath = decodeURIComponent(encodedPath);
    console.log("Attempting to delete file at path (server):", filePath);

    const file = adminStorage.file(filePath);
    await file.delete().catch((err) => {
      // Ignore "not found"
      if (err?.code !== 404) throw err;
    });

    console.log("Successfully deleted file (server):", filePath);
  } catch (error) {
    console.error("Error deleting from Firebase Storage (server):", error);
  }
}

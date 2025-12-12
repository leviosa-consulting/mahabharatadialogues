import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/firebaseServices";

export async function uploadToFirebaseStorage(
  file: File,
  folder: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const ext = file.name.split(".").pop();
      const safe = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9]/gi, "-");

      const fileName = `${safe}-${timestamp}-${random}.${ext}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        () => {},
        reject,
        async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
      );
    } catch (error) {
      reject(error);
    }
  });
}

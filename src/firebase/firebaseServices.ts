
import app from './initFirebase';
import { getFirestore, collection, getDocs  } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const db = getFirestore(app);
export default db;
export const storage = getStorage(app);

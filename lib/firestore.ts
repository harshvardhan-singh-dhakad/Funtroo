import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  setDoc,
  getCountFromServer,
  increment,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';

export const getCollection = async <T = DocumentData>(
  collectionName: string, 
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  const q = query(collection(db, collectionName), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
};

export const getCollectionCount = async (
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<number> => {
  const q = query(collection(db, collectionName), ...constraints);
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};

export const getDocument = async <T = DocumentData>(
  collectionName: string, 
  id: string
): Promise<T | null> => {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as T;
  }
  return null;
};

export const createDocument = async <T extends object>(
  collectionName: string, 
  data: T,
  id?: string
): Promise<string> => {
  if (id) {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, data);
    return id;
  } else {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  }
};

export const updateDocument = async <T extends object>(
  collectionName: string, 
  id: string, 
  data: Partial<T>
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data as DocumentData);
};

export const deleteDocument = async (
  collectionName: string, 
  id: string
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

// Re-export common constraints for convenience
export { where, orderBy, limit, increment };

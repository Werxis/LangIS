import {
  getFirestore,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  addDoc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  // Timestamp
} from 'firebase/firestore';
import { app } from './app';

const db = getFirestore(app);

// - - - -

type UserRole = 'admin' | 'teacher' | 'student';

// User Collection
export type LangISUser = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  photoUrl: string | null;
  age: number | null;
  location: string | null;
  description: string | null;
};

export type LangIsUserWithId = LangISUser & { uid: string };

export const getUsersCollectionRef = () =>
  collection(db, 'users') as CollectionReference<LangISUser>;

export const getUserDocumentRef = (uid: string) =>
  doc(db, 'users', uid) as DocumentReference<LangISUser>;

export const getUsers = async () => {
  const usersCollectionRef = getUsersCollectionRef();
  const querySnapshot = await getDocs(usersCollectionRef);
  const users: LangIsUserWithId[] = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    uid: doc.id,
  }));
  return users;
};

export const getUser = async (uid: string) => {
  const userDocumentRef = getUserDocumentRef(uid);
  const documentSnapshot = await getDoc(userDocumentRef);
  if (documentSnapshot.exists()) {
    const user: LangIsUserWithId = {
      ...documentSnapshot.data(),
      uid: documentSnapshot.id,
    };
    return user;
  }
  return undefined;
};

export const addUserAutoId = async (fields: LangISUser) => {
  const usersCollectionRef = getUsersCollectionRef();
  const newUserDocRef = await addDoc(usersCollectionRef, {
    ...fields,
  });
  return newUserDocRef;
};

// Create or overwrites the user document, create the doc by using custom supplied UID
export const setUserById = async (uid: string, fields: LangISUser) => {
  const userDocRef = getUserDocumentRef(uid);
  await setDoc(userDocRef, {
    ...fields,
  });
};

export const updateUser = async (uid: string, fields: Partial<LangISUser>) => {
  const userDocRef = getUserDocumentRef(uid);
  await updateDoc(userDocRef, {
    ...fields,
  });
};

export const deleteUser = async (uid: string) => {
  const userDocRef = getUserDocumentRef(uid);
  await deleteDoc(userDocRef);
};

// - - - - -

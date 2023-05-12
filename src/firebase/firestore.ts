import {
  getFirestore,
  collection,
  query,
  where,
  CollectionReference,
  doc,
  DocumentReference,
  addDoc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  orderBy,
  // Timestamp
} from 'firebase/firestore';
import { app } from './app';

const db = getFirestore(app);

// - - - -

export type UserRole = 'admin' | 'teacher' | 'student';

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

export type Course = {
  name: string;
  description: string;
  language: string;
  level: string;
  price: number;
  capacity: number;
  students: string[];
  teacher: CourseTeacher;
};

export type CourseTeacher = {
  uid: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
};

export type CourseWithId = Course & { uid: string };

export type CourseWithTeacher = CourseWithId & LangIsUserWithId;

export const getCourseDocumentRef = (uid: string) =>
  doc(db, 'courses', uid) as DocumentReference<Course>;

export const getCoursesCollectionRef = () => {
  // TODO change to .withConverter()
  const coll = collection(db, 'courses') as CollectionReference<Course>;
  return coll;
};

export const getCourses = async () => {
  const coursesCollectionRef = getCoursesCollectionRef();
  const querySnapshot = await getDocs(coursesCollectionRef);
  const courses: CourseWithId[] = querySnapshot.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  }));
  return courses;
};

export const getUserCourses = async (userUid: string, userRole: string) => {
  const q = query(
    getCoursesCollectionRef(),
    where('students', 'array-contains', userUid)
  );
  const querySnapshot = await getDocs(q);
  const userCourses: CourseWithId[] = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    uid: doc.id,
  }));
  return userCourses;
};

export const getUserCoursesQuery = (userUid: string, userRole: string) => {
  if (userRole === 'teacher') {
    return query(
      getCoursesCollectionRef(),
      where('teacher.uid', '==', userUid)
    );
  } else {
    return query(
      getCoursesCollectionRef(),
      where('students', 'array-contains', userUid)
    );
  }
};

export const getTeachers = async () => {
  const q = query(getUsersCollectionRef(), where('role', '==', 'teacher'));
  const querySnapshot = await getDocs(q);
  const teachers: LangIsUserWithId[] = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    uid: doc.id,
  }));
  return teachers;
};

export const getTeachersQuery = () =>
  query(getUsersCollectionRef(), where('role', '==', 'teacher'));

export const updateCourse = async (uid: string, fields: Partial<Course>) => {
  const courseRef = getCourseDocumentRef(uid);
  await updateDoc(courseRef, { ...fields });
};

export const addCourse = async (course: Course) => {
  return await addDoc(getCoursesCollectionRef(), { ...course });
};

export const deleteCourse = async (courseUid: string) => {
  const courseDocRef = getCourseDocumentRef(courseUid);
  await deleteDoc(courseDocRef);
};

// - - - - -

export type Message = {
  contents: string;
  timestamp: Timestamp;
  userName: string;
  userPhotoUrl: string | null;
  userUid: string;
};

export type MessageWithId = Message & { uid: string };

export const getMessagesCollectionRef = (courseUid: string) => {
  const coll = collection(
    db,
    `courses/${courseUid}/messages`
  ) as CollectionReference<Message>;
  return coll;
};

export const getMessages = async (courseUid: string) => {
  const collectionRef = getMessagesCollectionRef(courseUid);
  const querySnaphot = await getDocs(collectionRef);
  const messages: MessageWithId[] = querySnaphot.docs.map((doc) => ({
    ...doc.data(),
    uid: doc.id,
  }));
  return messages;
};

export const getMessagesOrderedQuery = (courseUid: string) => {
  const messagesCollectionRef = getMessagesCollectionRef(courseUid);
  return query(messagesCollectionRef, orderBy('timestamp'));
};

export const addMessage = async (message: Message, courseUid: string) => {
  const collectionRef = getMessagesCollectionRef(courseUid);
  return await addDoc(collectionRef, { ...message });
};

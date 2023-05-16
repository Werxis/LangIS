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
  averageRating: number | null;
};

export type CourseTeacher = {
  uid: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
};

export type CourseWithId = Course & { uid: string };

export type CourseWithTeacher = CourseWithId & LangIsUserWithId;

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type CourseLanguage =
  | 'English'
  | 'español'
  | 'italiano'
  | 'Deutsch'
  | 'français';

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

// - - - - -
export type CourseRating = {
  // the document id is the id of the user who rated the course
  // this ensures 1:1 relationship course : userRating
  value: number;
};

export type CourseRatingWithId = CourseRating & { uid: string };

export const getRatingsCollectionRef = (courseUid: string) => {
  const coll = collection(
    db,
    `courses/${courseUid}/ratings`
  ) as CollectionReference<CourseRating>;
  return coll;
};

export const getRatingDocumentRef = (courseUid: string, userUid: string) => {
  return doc(getRatingsCollectionRef(courseUid), userUid);
};

export const getRating = async (courseUid: string, userUid: string) => {
  const documentRef = getRatingDocumentRef(courseUid, userUid);
  const documentSnapshot = await getDoc(documentRef);
  if (documentSnapshot.exists()) {
    const rating: CourseRatingWithId = {
      ...documentSnapshot.data(),
      uid: documentSnapshot.id,
    };
    return rating;
  }
  return undefined;
};

export const updateCourseAverageRating = async (courseUid: string) => {
  const collectionRef = getRatingsCollectionRef(courseUid);
  const querySnaphot = await getDocs(collectionRef);
  const ratingSum = querySnaphot.docs.reduce(
    (sum, doc) => sum + doc.data().value,
    0
  );
  const averageRating = ratingSum / querySnaphot.docs.length;
  updateCourse(courseUid, { averageRating });
};

export const addOrUpdateRating = async (
  courseUid: string,
  userUid: string,
  rating: number
) => {
  const documentRef = getRatingDocumentRef(courseUid, userUid);
  await setDoc(documentRef, { value: rating });
  await updateCourseAverageRating(courseUid);
};

// - - - - -
export type Lesson = {
  start: Timestamp;
  lengthMinutes: number;
  classroom: string;
  description: string;
  fileUrl: string | null;
};

export type LessonWithId = Lesson & { uid: string };

export const getLessonsCollectionRef = (courseUid: string) => {
  const coll = collection(
    db,
    `courses/${courseUid}/lessons`
  ) as CollectionReference<Lesson>;
  return coll;
};

export const getLessonDocumentRef = (courseUid: string, lessonUid: string) =>
  doc(
    getLessonsCollectionRef(courseUid),
    lessonUid
  ) as DocumentReference<Lesson>;

export const getLessons = async (courseUid: string) => {
  const collectionRef = getLessonsCollectionRef(courseUid);
  const querySnaphot = await getDocs(collectionRef);
  const lessons: LessonWithId[] = querySnaphot.docs.map((doc) => ({
    ...doc.data(),
    uid: doc.id,
  }));
  return lessons;
};

export const getLessonsOrderedQuery = (courseUid: string) => {
  const collectionRef = getLessonsCollectionRef(courseUid);
  return query(collectionRef, orderBy('start'));
};

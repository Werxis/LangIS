import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { app } from './app';

const auth = getAuth(app);

// Register handler
export const registerEmailPassword = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

// Login handler
export const loginEmailPassword = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

// Logout handler
export const logout = () => signOut(auth);

// Subscribe to auth state changes
export const onAuthChange = (callback: (u: User | null) => void) =>
  onAuthStateChanged(auth, callback);

// - - - - Google Provider - - - -

const googleProvider = new GoogleAuthProvider();
// Possible to set some optional parameters on googleProvider.setSomething()

export const loginGoogle = () => signInWithPopup(auth, googleProvider);

// - - - - GitHub Provider - - - -

const githubProvider = new GithubAuthProvider();
// Possible to set some optional parameters on githubProvider.setSomething()

export const loginGithub = () => signInWithPopup(auth, githubProvider);

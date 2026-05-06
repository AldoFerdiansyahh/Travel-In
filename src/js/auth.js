import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const ADMIN_EMAILS = ['admin@travel-in.com'];

export async function registerWithFirebase({ name, email, password, whatsapp = '' }) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  const profile = {
    uid,
    name,
    email,
    whatsapp,
    role: 'user',
    createdAt: new Date().toISOString(),
  };
  await setDoc(doc(db, 'users', uid), profile);
  return profile;
}

export async function loginWithFirebase(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return checkRole(userCredential.user);
}

export async function checkRole(user) {
  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return { uid: user.uid, ...snapshot.data() };
  }

  const profile = {
    uid: user.uid,
    name: user.displayName || '',
    email: user.email || '',
    whatsapp: '',
    role: ADMIN_EMAILS.includes(user.email) ? 'admin' : 'user',
    createdAt: new Date().toISOString(),
  };
  await setDoc(userRef, profile);
  return profile;
}

export async function logoutFirebase() {
  await signOut(auth);
}

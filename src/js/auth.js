import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function registerWithFirebase({ name, email, password }) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  const profile = {
    uid,
    name,
    email,
    role: 'user',
    createdAt: new Date().toISOString(),
  };
  await setDoc(doc(db, 'users', uid), profile);
  return profile;
}

export async function loginWithFirebase(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return checkRole(userCredential.user.uid);
}

export async function checkRole(uid) {
  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    throw new Error('Data pengguna tidak ditemukan di Firestore.');
  }
  return { uid, ...snapshot.data() };
}

export async function logoutFirebase() {
  await signOut(auth);
}

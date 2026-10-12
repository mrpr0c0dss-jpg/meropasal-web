import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Official WAStore Firebase configuration
export const firebaseConfig = {
  apiKey: 'AIzaSyC2gDuyZyJbTfxVkrULX2R6nUGAXKGlzos',
  authDomain: 'wastore-40be3.firebaseapp.com',
  databaseURL: 'https://wastore-40be3-default-rtdb.firebaseio.com',
  projectId: 'wastore-40be3',
  storageBucket: 'wastore-40be3.firebasestorage.app',
  messagingSenderId: '472990688459',
  appId: '1:472990688459:web:902a506a25ffcc7986a74e',
  measurementId: 'G-WG5VS8Y2FC',
};

// Initialize Firebase safely for SSR & Client
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);

export let analytics: any = null;
if (typeof window !== 'undefined') {
  import('firebase/analytics')
    .then(({ getAnalytics }) => {
      try {
        analytics = getAnalytics(app);
      } catch (err) {
        console.warn('Firebase Analytics not supported in this environment', err);
      }
    })
    .catch(() => {});
}

export default app;

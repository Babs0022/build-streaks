import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface DailyLog {
  id?: string;
  userAddress: string;
  date: string; // YYYY-MM-DD format
  note: string;
  timestamp: Timestamp;
}

export const addDailyLog = async (userAddress: string, note: string): Promise<string> => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const docRef = await addDoc(collection(db, 'dailyLogs'), {
      userAddress,
      date: today,
      note,
      timestamp: Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding daily log:', error);
    throw error;
  }
};

export const getDailyLogs = async (userAddress: string): Promise<DailyLog[]> => {
  try {
    const q = query(
      collection(db, 'dailyLogs'),
      where('userAddress', '==', userAddress),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const logs: DailyLog[] = [];
    
    querySnapshot.forEach((doc) => {
      logs.push({
        id: doc.id,
        ...doc.data()
      } as DailyLog);
    });
    
    return logs;
  } catch (error) {
    console.error('Error getting daily logs:', error);
    throw error;
  }
};

export const getTodayLog = async (userAddress: string): Promise<DailyLog | null> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, 'dailyLogs'),
      where('userAddress', '==', userAddress),
      where('date', '==', today)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as DailyLog;
  } catch (error) {
    console.error('Error getting today log:', error);
    throw error;
  }
};

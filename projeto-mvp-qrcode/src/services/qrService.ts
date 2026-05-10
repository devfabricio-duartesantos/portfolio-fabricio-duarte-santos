import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Options } from 'qr-code-styling';

export interface SavedQRCode {
  id: string;
  name: string;
  data: string;
  options: Options;
  createdBy: string;
  createdAt: any;
}

export interface HistoryItem {
  id: string;
  data: string;
  format: string;
  userId: string;
  createdAt: any;
}

export const qrService = {
  async saveQRCode(userId: string, name: string, data: string, options: Options) {
    return addDoc(collection(db, 'qrcodes'), {
      name,
      data,
      options,
      createdBy: userId,
      createdAt: serverTimestamp()
    });
  },

  async logGeneration(userId: string, data: string, format: string) {
    return addDoc(collection(db, 'history'), {
      userId,
      data,
      format,
      createdAt: serverTimestamp()
    });
  },

  async getGenerationHistory(userId: string) {
    const q = query(
      collection(db, 'history'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HistoryItem));
  },

  async getUserQRCodes(userId: string) {
    const q = query(
      collection(db, 'qrcodes'), 
      where('createdBy', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedQRCode));
  },

  async getAllQRCodes() {
    const q = query(collection(db, 'qrcodes'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedQRCode));
  },

  async deleteQRCode(id: string) {
    return deleteDoc(doc(db, 'qrcodes', id));
  },

  async updateQRCode(id: string, name: string, data: string, options: Options) {
    const { id: _, ...optionsWithoutId } = options as any;
    return updateDoc(doc(db, 'qrcodes', id), {
      name,
      data,
      options: optionsWithoutId,
      updatedAt: serverTimestamp()
    });
  },

  async getQRCode(id: string) {
    const docSnap = await getDoc(doc(db, 'qrcodes', id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as SavedQRCode;
    }
    return null;
  }
};

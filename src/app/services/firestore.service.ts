import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Firestore, getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from '../../../api_key';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore: Firestore;

  constructor() {
    const app = initializeApp(firebaseConfig)
    this.firestore = getFirestore(app)
  }

  async getDocument(): Promise<any> {
    const docRef = doc(this.firestore, 'data', 'Y0IoZlc9JCnPWttW46XD')
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      throw new Error('Document does not exist')
    }
  }
}

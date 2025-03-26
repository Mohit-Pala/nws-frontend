import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Firestore, getFirestore, doc, getDoc, collection, addDoc } from 'firebase/firestore';
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

  sampleData = {
    emotion: {
      anger: 0,
      disgust: 0,
      fear: 0,
      joy: 0,
      sadness: 0,
      surprise: 0,
      neutral: 0
    },

    sentiment: {
      posiitve: 0.5,
      negative: 0.4,
      neutral: 0.1
    },

    model: {
      cosineSim: 0.85,
      jaccardBigrams: 0.35,
      jaccardWords: 0.45,
      lenDif: 128,
      lenRatio: 0.9,
      normEditDist: 0.28,
      tfIdfSim: 0.72
    },

    title: "Smaple title NuMbEr 3",
  }

  async putSampleData() {
    const collectionRef = collection(this.firestore, "data")
    await addDoc(collectionRef, this.sampleData).then((res) => {
      console.log("Document written", res)
    }).catch((error) => {
      console.log("Error adding document", error)
    })
  }
}

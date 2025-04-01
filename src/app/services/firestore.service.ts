import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Firestore, getFirestore, doc, getDoc, getDocs, collection, addDoc, query, where } from 'firebase/firestore';
import { firebaseConfig } from '../../../api_key';
import { Search } from '../models/search.model';

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

    title: ['this', 'is', 'a', 'sample', 'title'],
  }

  async putSampleData() {
    const collectionRef = collection(this.firestore, "data")
    await addDoc(collectionRef, this.sampleData).then((res) => {
      console.log("Document written", res)
    }).catch((error) => {
      console.log("Error adding document", error)
    })
  }

  // Search for a document by title
  // Exact match
  async searchByTitle(searchTerm: string) {
    const collectionRef = collection(this.firestore, "data")
    const querySnapshot = await getDoc(doc(collectionRef, searchTerm))
    if (querySnapshot.exists()) {
      console.log("Document data:", querySnapshot.data())
    }
    else {
      console.log("No such document!")
    }
  }

  // Search for a document by title
  // search term is a word of the title
  async searchTitleSubstring(searchTerm: string) {
    const collectionRef = collection(this.firestore, "data")
    const q = query(collectionRef, where("title", "array-contains", searchTerm))
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) {
      console.log("No documents found!")
      return []
    }

    let data: Search[] = []

    querySnapshot.forEach((doc) => {
      data.push(doc.data() as Search)
    })
    return data
  }

  async searchByNewsSource(source: string) {
    const collectionRef = collection(this.firestore, "data")
    
  }
}

import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Firestore, getFirestore, doc, getDoc, getDocs, collection, addDoc, query, where } from 'firebase/firestore';
import { firebaseConfig } from '../../../api_key';
import { Search } from '../models/search.model';
import { FsSearch } from '../models/fs-search.model';

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

  newSampleData: Search = {
    title: ['Bpple', 'iPhone', '14', 'Pro', 'Max'],
    emotion: {
      anger: 0.1,
      disgust: 0.1,
      fear: 0.1,
      joy: 0.2,
      sadness: 0.1,
      surprise: 0.3,
      neutral: 0.1
    },
    sentiment: {
      positive: 0.85,
      negative: 0.05,
      neutral: 0.1
    },
    model: {
      cosineSim: 0.8,
      jaccardBigrams: 0.5,
      jaccardWords: 0.6,
      lenDif: 30,
      lenRatio: 0.3,
      normEditDist: 0.2,
      // normEditDist: 0.2,
      tfIdfSim: 0.1
    },
    // gemini: {
    //   facts: [
    //     'Apple released the iphone 14 pro max',
    //     'Sucessor to iphone 13 pro max',
    //   ],
    //   source: [
    //     'Apple',
    //     'Wikipedia',
    //     'Google',
    //   ],
    //   words: [
    //     'Apple',
    //     'iPhone',
    //     '14',
    //   ]
    // },
    gpt: {
      facts: [
        'Apple made this phone',
        'Not samsung',
      ],
      source: [
        'Apple',
        'Not Samsung'
      ],
      words: [
        'Apple',
        'iPhone',
        'samsung'
      ]
    }
  }

  async putSampleData() {
    const collectionRef = collection(this.firestore, "data")
    await addDoc(collectionRef, this.newSampleData).then((res) => {
      console.log("Document written", res)
    }).catch((error) => {
      console.log("Error adding document", error)
    })
  }


  async getAllData(): Promise<FsSearch[] | null> {
    const collectionRef = collection(this.firestore, "data")
    const querySnapshot = await getDocs(collectionRef)
    if (querySnapshot.empty) {
      console.log("No documents found!")
      return null
    }

    let out: FsSearch[] = []


    querySnapshot.forEach((doc) => {
      const tmpFsSearch: FsSearch = {
        item: doc.data() as Search,
        ids: doc.id
      }
      out.push(tmpFsSearch)
    })

    return out
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

    let out: FsSearch[] = []

    querySnapshot.forEach((doc) => {
      const tmpFsSearch: FsSearch = {
        item: doc.data() as Search,
        ids: doc.id
      }
      out.push(tmpFsSearch)
    })

    return out
  }

  async getDataById(id: string) {
    const docRef = doc(this.firestore, "data", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data())
      console.log("Document id:", docSnap.id)
      return docSnap.data() as Search
    } else {
      console.log("No such document!")
      return null
    }
  }
}

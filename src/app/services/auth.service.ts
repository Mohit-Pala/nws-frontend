import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  router = inject(Router)
  auth = inject(Auth)

  user = this.auth.currentUser

  createAccount(email: string, password: string) {
    createUserWithEmailAndPassword(this.auth, email, password).then(() => {
      console.log('Created user')
    }).catch((error) => {
      console.error(error)
    })
  }

  signIn(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password).then(() => {
      console.log('Signed in')
      this.router.navigate(['/search'])
    }).catch((error) => {
      console.error(error)
    })
  }

  logout() {
    signOut(this.auth)
  }
}

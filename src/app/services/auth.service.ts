import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth)
  private router: Router = inject(Router)

  async createAccount(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.auth, email, password)
  }

  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password)
  }

  async logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/'])
    })
  }
  async getCurrentUser() {
    return this.auth.currentUser
  }

  // Check if user is logged in
  async isLoggedIn() {
    return this.auth.currentUser !== null
  }
}

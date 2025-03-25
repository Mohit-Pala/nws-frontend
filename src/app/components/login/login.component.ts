import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  router = inject(Router)
  auth = inject(AuthService)

  createAccountErrorMessage = ''
  signInErrorMessage = ''

  createAccountShown = true

  createAccountDetails = {
    email: '',
    password: ''
  }

  loginDetails = {
    email: '',
    password: ''
  }

  createAccount() {
    this.auth.createAccount(this.createAccountDetails.email, this.createAccountDetails.password).then(() => {
      console.log('Account created')
      this.router.navigate(['/search'])
    }).catch((error) => {
      this.createAccountErrorMessage = error.message
    })
  }

  signIn() {
    this.auth.login(this.loginDetails.email, this.loginDetails.password).then(() => {
      console.log('Logged in')
      this.router.navigate(['/search'])
    }).catch((error) => {
      this.signInErrorMessage = error
    })
  }
}

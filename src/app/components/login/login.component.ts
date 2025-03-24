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
    try {
      this.auth.createAccount(this.createAccountDetails.email, this.createAccountDetails.password)
    } catch (error) {
      console.error(error)
    }
  }

  signIn() {
    try {
      this.auth.signIn(this.loginDetails.email, this.loginDetails.password)
    } catch (error) {
      console.error(error)
    }
  }
}

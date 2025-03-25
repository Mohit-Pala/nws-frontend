import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-list',
  imports: [CommonModule],
  templateUrl: './search-list.component.html',
  styleUrl: './search-list.component.css'
})
export class SearchListComponent implements OnInit {
  auth = inject(AuthService)
  signedIn = false

  ngOnInit() {
    this.auth.isLoggedIn().then((loggedIn) => {
      console.log(this.signedIn)
      this.signedIn = loggedIn
    })
  }

  signOut() {
    this.auth.logout()
  }
}

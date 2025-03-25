import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'app-search-list',
  imports: [CommonModule],
  templateUrl: './search-list.component.html',
  styleUrl: './search-list.component.css'
})
export class SearchListComponent implements OnInit {
  auth = inject(AuthService)
  restApi = inject(RestApiService)
  signedIn = false

  ngOnInit() {
    this.auth.isLoggedIn().then((loggedIn) => {
      console.log(this.signedIn)
      this.signedIn = loggedIn
    })

    this.restApi.getItems().then((items) => {
      console.log(items)
    })
  }

  signOut() {
    this.auth.logout()
  }
}

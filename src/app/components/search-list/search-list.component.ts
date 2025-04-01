import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

import { RestApiService } from '../../services/rest-api.service';

import { FirestoreService } from '../../services/firestore.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Search } from '../../models/search.model';


@Component({
  selector: 'app-search-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-list.component.html',
  styleUrl: './search-list.component.css'
})
export class SearchListComponent implements OnInit {
  auth = inject(AuthService)

  restApi = inject(RestApiService)

  firestore = inject(FirestoreService)

  items: Search[] = []
  signedIn = true


  ngOnInit() {
    this.firestore.searchTitleSubstring("title").then((res) => {
      console.log(res)
      if(!res) {
        return
      }
      this.items = res
    })

    this.restApi.getOutput('sus', 'amogus').then((output) => {
      console.log(output)
    })
  }

  signOut() {
    this.auth.logout()
  }

  onSubmit(form: NgForm) {
    console.log('submit')
  }
}

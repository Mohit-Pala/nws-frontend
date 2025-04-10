import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

import { RestApiService } from '../../services/rest-api.service';

import { FirestoreService } from '../../services/firestore.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Search } from '../../models/search.model';
import { FsSearch } from '../../models/fs-search.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-search-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-list.component.html',
  styleUrl: './search-list.component.css'
})
export class SearchListComponent implements OnInit {
  auth = inject(AuthService)
  router = inject(Router)

  restApi = inject(RestApiService)

  firestore = inject(FirestoreService)

  items: FsSearch[] = []
  signedIn = true


  ngOnInit() {
    this.firestore.getAllData().then((res) => {
      console.log(res)
      if(!res) {
        return
      }
      this.items = res
    })
  }

  signOut() {
    this.auth.logout()
  }

  onSubmit(form: NgForm) {
    this.items = []
  }

  navToId(id: string) {
    this.router.navigate(['/search', id])
  } 
}

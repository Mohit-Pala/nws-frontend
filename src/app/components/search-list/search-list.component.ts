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
  searchTerm = ''
  items: FsSearch[] = []
  signedIn = true


  ngOnInit() {
    this.getAllData()
  }

  getAllData() {
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

  navToId(id: string) {
    this.router.navigate(['/search', id])
  } 

  uploadNewData() {
    this.firestore.putSampleData()
  }

  reset() {
    this.searchTerm = ''
    this.items = []
    this.getAllData()
  }

  searchByKeyword() {
    this.firestore.searchTitleSubstring(this.searchTerm).then((res) => {
      if(!res) {
        return
      }
      if(res.length == 0) {
        alert('No results found')
        this.getAllData()
        return
      }
      this.items = res
    }).catch((err) => {
      alert(err)
      this.getAllData()
    })
  }
}

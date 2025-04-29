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
  searches: FsSearch[] = []
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
    this.searches = []
    this.getAllData()
  }

  filterBySubstring() {
    // fileter items list by the substring of title
    if(this.searchTerm.length < 3) {
      alert('Please enter at least 3 characters')
      return
    }
    this.searches = this.items.filter(item => {item.item.title.includes(this.searchTerm.toLowerCase())})
    if(this.searches.length == 0) {
      alert('No results found')
      this.getAllData()
      return
    }
  }
 

  // searchByKeyword() {
  //   this.firestore.searchTitleSubstring(this.searchTerm).then((res) => {
  //     if(!res) {
  //       return
  //     }
  //     if(res.length == 0) {
  //       alert('No results found')
  //       this.getAllData()
  //       return
  //     }
  //     this.items = res
  //   }).catch((err) => {
  //     alert(err)
  //     this.getAllData()
  //   })
  // }
}

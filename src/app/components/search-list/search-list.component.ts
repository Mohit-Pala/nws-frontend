import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-search-list',
  imports: [CommonModule],
  templateUrl: './search-list.component.html',
  styleUrl: './search-list.component.css'
})
export class SearchListComponent implements OnInit {
  auth = inject(AuthService)
  firestore = inject(FirestoreService)
  signedIn = false

  ngOnInit() {
    this.firestore.getDocument().then((doc) => {
      console.log(doc)
    }).catch((err) => {
      console.error(err)
    })
  }

  signOut() {
    this.auth.logout()
  }
}

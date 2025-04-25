import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'app-experimental',
  imports: [CommonModule, FormsModule],
  templateUrl: './experimental.component.html',
  styleUrl: './experimental.component.css'
})
export class ExperimentalComponent {

  restApi = inject(RestApiService)

  url = ''
  title = ''
  article = ''

  async onSubmit(form: NgForm) {
    await this.restApi.scrapeArticle(this.url).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }
}

import { Component } from '@angular/core';
import { ModelComponent } from "./model/model.component";

@Component({
  selector: 'app-main',
  imports: [ModelComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}

import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { SearchListComponent } from './components/search-list/search-list.component';
import { DisplayComponent } from './components/search-list/display/display.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [ 
    {path: '', component: MainComponent},
    {path: 'search', component: SearchListComponent},
    {path: 'search/:id', component: DisplayComponent},
    {path: 'about', component: AboutComponent},
    {path: 'login', component: LoginComponent}
];

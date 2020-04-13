import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { RouterModule, Routes } from '@angular/router';
import { CIComponent } from './ci/ci.component';
import {GithubService} from './services/github.service';

const appRoutes: Routes = [
  {path: '', component: AppComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CIComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthService,
    GithubService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

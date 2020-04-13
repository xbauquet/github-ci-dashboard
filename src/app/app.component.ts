import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public authService: AuthService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      const code = params.code;
      const state = params.state;
      if (code && state) {
        this.authService.requestToken(code, state);
      }
    });
  }
}

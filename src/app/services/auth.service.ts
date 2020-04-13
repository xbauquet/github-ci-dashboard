import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private TOKEN_KEY = 'github_token';
  private STATE_KEY = 'github_state';
  private CLIENT_ID = '98a0614180ea7e399a35';

  token: string = null;

  constructor(private httpClient: HttpClient,
              private router: Router) {
    this.getToken();
  }

  private setState(state: string) {
    localStorage.setItem(this.STATE_KEY, state);
  }

  private getState() {
    return localStorage.getItem(this.STATE_KEY);
  }

  private getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.token = token;
  }

  logout() {
    this.setToken(null);
  }

  login() {
    if (this.getState() === null || this.getState() === undefined || this.getState() === 'null') {
      this.setState(this.generateState());
    }
    const url = 'https://github.com/login/oauth/authorize?' +
      'client_id=' + this.CLIENT_ID + '&' +
      'scope=repo%20read:org%20read:user%20read:packages%20workflow&' +
      'state=' + this.getState();
    document.location.replace(url);
  }

  requestToken(code: string, state: string) {
    if (this.getState() === state) {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      const url = 'https://auth.ginny-ci.com/';
      const body = '{"code":"' + code + '", "state":"' + this.getState() + '"}';
      this.httpClient.post<Token>(url, body, { headers }).subscribe(
        value => {
          this.setToken(value.access_token);
          localStorage.removeItem(this.STATE_KEY);
          this.router.navigateByUrl('/').then();
        }
      );
    } else {
      console.error('Security error receiving code: Github states are different. Local state = ' +
        this.getState() + ', received state = ' + state + ';');
    }
  }

  private generateState() {
    return Array(10).fill(null).map(() => Math.random().toString(36).substr(2)).join('');
  }
}

export class Token {
  access_token: string;
}

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { GithubService } from '../services/github.service';

@Component({
  selector: 'app-ci',
  templateUrl: './ci.component.html',
  styleUrls: ['./ci.component.css']
})
export class CIComponent implements OnInit, OnDestroy {

  isInitializing = false;

  constructor(public githubService: GithubService) { }

  ngOnInit(): void {
    this.isInitializing = true;
    this.githubService.build().then(
      _ => {
        this.isInitializing = false;
        this.githubService.watchRepositories();
      }
    );
  }

  ngOnDestroy(): void {
    this.githubService.unwatchRepositories();
  }

  @HostListener('window:focus', ['$event'])
  onFocus(event: any) {
    this.githubService.watchRepositories();
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: any) {
    this.githubService.unwatchRepositories();
  }
}

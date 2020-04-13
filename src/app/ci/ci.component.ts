import { Component, OnInit } from '@angular/core';
import {GithubService} from '../services/github.service';

@Component({
  selector: 'app-ci',
  templateUrl: './ci.component.html',
  styleUrls: ['./ci.component.css']
})
export class CIComponent implements OnInit {

  constructor(private githubService: GithubService) { }

  ngOnInit(): void {
    this.githubService.build().then(
      _ => {
        console.log('Repositories : ' + this.githubService.repositories.length);
        console.log('Orgs: ' + JSON.stringify(this.githubService.organisations));
        console.log('User: ' + JSON.stringify(this.githubService.user));
        const repo = this.githubService.repositories[0];
        const subscription = this.githubService.requestUpdates(repo.owner, repo.name).subscribe(
          value => {
            console.log('CheckRun ' + JSON.stringify(value));
            subscription.unsubscribe();
          }
        );
      }
    );
  }
}

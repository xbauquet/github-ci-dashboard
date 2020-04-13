import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Repository } from '../model/repository';
import { User } from '../model/user';
import { Organisation } from '../model/organisation';
import { CheckRun } from '../model/check-run';
import { interval, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  constructor(private httpClient: HttpClient,
              private authService: AuthService) {
  }

  user: User;
  organisations: Organisation[];
  repositories: Repository[];
  isWatching = false;

  private static getBody(after: string, user: string, orgs: Organisation[]) {
    after = after ? '"' + after + '"' : 'null';
    let query = user ? 'user:' + user : '';
    if (orgs != null) {
      for (const org of orgs) {
        query = query + ' org:' + org.login;
      }
    }

    return 'query { \n' +
      '  search(query: "' + query + '", type: REPOSITORY, last: 100, after: ' + after + ') {\n' +
      '      pageInfo {\n' +
      '        startCursor\n' +
      '        hasNextPage\n' +
      '        endCursor\n' +
      '    \t}\n' +
      '      edges {\n' +
      '        node {\n' +
      '          ... on Repository {\n' +
      '          name\n' +
      '          url\n' +
      '          isPrivate\n' +
      '          owner {\n' +
      '            login\n' +
      '          }\n' +
      '          folder: object(expression: "master:.github/workflows") {\n' +
      '            id\n' +
      '          }\n' +
      '        } \n' +
      '      }\n' +
      '    }\n' +
      '  }\n' +
      '}';
  }

  async build() {
    this.user = await this.getUser();
    this.organisations = await this.getOrganisations();
    this.repositories = await this.getRepositories();
  }

  watchRepositories() {
    this.isWatching = true;
    for (const repo of this.repositories) {
      repo.subscription = this.requestUpdates(repo.owner, repo.name).subscribe(
        value => {
          value.state = value.status === 'in_progress' ? 'in_progress' : value.conclusion;
          repo.checkRun = value;
        }
      );
    }
  }

  unwatchRepositories() {
    this.isWatching = false;
    for (const repo of this.repositories) {
      repo.subscription.unsubscribe();
      repo.subscription = null;
    }
  }

  private requestUpdates(owner: string, repo: string) {
    return interval(10000).pipe(_ => this.getCheckRun(owner, repo));
  }

  private getHeaders() {
    return new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.authService.token);
  }

  private getOrganisations() {
    const url = 'https://api.github.com/user/orgs';
    return this.httpClient.get<Organisation[]>(url, { headers: this.getHeaders() }).toPromise();
  }

  private getUser() {
    const url = 'https://api.github.com/user';
    return this.httpClient.get<User>(url, { headers: this.getHeaders() }).toPromise();
  }

  private getGithubRepositories(after: string) {
    const url = 'https://api.github.com/graphql';
    const body = {query: GithubService.getBody(after, this.user.login, this.organisations)};
    return this.httpClient
      .post<RepositoryResponse>(url, body, { headers: this.getHeaders() })
      .toPromise();
  }

  private async getRepositories() {
    const repositories: Repository[] = [];
    let hasNext = false;
    let after = null;
    do {
      const response = await this.getGithubRepositories(after);
      for (const edge of response.data.search.edges) {
        if (edge.node.folder) {
          const repository = new Repository();
          repository.name = edge.node.name;
          repository.owner = edge.node.owner.login;
          repository.htmlUrl = edge.node.url;
          repository.private = edge.node.isPrivate;
          repositories.push(repository);
        }
      }
      hasNext = response.data.search.pageInfo.hasNextPage;
      after = response.data.search.pageInfo.endCursor;
    } while (hasNext);
    return repositories;
  }

  private getCheckRun(owner: string, repo: string) {
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.authService.token)
      .set('Accept', 'application/vnd.github.antiope-preview+json');
    const url = 'https://api.github.com/repos/' + owner + '/' + repo + '/commits/master/check-runs';
    return new Observable<CheckRun>(observer => {
      this.httpClient.get<CheckRuns>(url, { headers }).subscribe(
        value => {
          if (value.check_runs.length > 0) {
            observer.next(value.check_runs[0]);
          } else {
            observer.error('No checkRun for ' + owner + '/' + repo);
          }
          observer.complete();
        },
        error => {
          console.error('Error getting checkRuns for ' + owner + '/' + repo + ' : ' + JSON.stringify(error));
          observer.error('Error getting checkRuns for ' + owner + '/' + repo);
          observer.complete();
        }
      );
    });
  }
}

// DTOs for github repositories endpoint response
class RepositoryResponse {
  data: Data;
}

class Data {
  search: Search;
}

class Search {
  pageInfo: PageInfo;
  edges: Edge[];
}

class Edge {
  node: Node;
}

class Node {
  name: string;
  url: string;
  isPrivate: boolean;
  owner: Owner;
  folder: Folder;
}

class Folder {
  id: string;
}

class Owner {
  login: string;
}

class PageInfo {
  startCursor: string;
  hasNextPage: boolean;
  endCursor: string;
}

// DTO for github checkRun endpoint response
class CheckRuns {
  check_runs: CheckRun[] = [];
}


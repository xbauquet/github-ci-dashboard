import { Subscription } from 'rxjs';
import { CheckRun } from './check-run';

export class Repository {
  name = '';
  owner = '';
  htmlUrl = '';
  private = false;
  subscription: Subscription = null;
  checkRun = new CheckRun();
}

/*
  Statuses: queued, in_progress, completed
  Conclusions: success, failure, neutral, cancelled, timed_out, action_required
*/

export class CheckRun {
  html_url = '';
  head_sha = '';
  status = '';
  conclusion = '';
  started_at = '';
  completed_at = '';
  app = new CheckRunApp();
  state: string;
}

export class CheckRunApp {
  slug = '';
}

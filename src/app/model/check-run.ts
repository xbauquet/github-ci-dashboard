export class CheckRun {
  html_url = '';
  head_sha = '';
  status = '';
  conclusion = '';
  started_at = '';
  completed_at = '';
  app = new CheckRunApp();
}

export class CheckRunApp {
  slug = '';
}

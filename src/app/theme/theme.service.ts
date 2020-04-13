import { EventEmitter, Inject, Injectable } from '@angular/core';
import { ACTIVE_THEME, Theme, THEMES } from './theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  themeChange = new EventEmitter<Theme>();
  private THEME_KEY = 'ginny_theme';

  constructor(@Inject(THEMES) public themes: Theme[],
              @Inject(ACTIVE_THEME) public theme: string) {
    const t = localStorage.getItem(this.THEME_KEY);
    if (t) {
      this.setTheme(t);
    }
  }

  getActiveTheme() {
    return this.themes.find(t => t.name === this.theme);
  }

  setTheme(name: string) {
    this.theme = name;
    this.themeChange.emit( this.getActiveTheme());
    localStorage.setItem(this.THEME_KEY, name);
  }
}

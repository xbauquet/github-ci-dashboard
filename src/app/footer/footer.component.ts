import { Component, OnInit } from '@angular/core';
import {ThemeService} from '../theme/theme.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  toggleButtonText: string;

  constructor(public themeService: ThemeService) { }

  ngOnInit(): void {
    this.updateToggleButtonText();
  }

  private updateToggleButtonText() {
    const active = this.themeService.getActiveTheme();
    if (active.name === 'light') {
      this.toggleButtonText = 'Dark theme';
    } else {
      this.toggleButtonText = 'Light theme';
    }
  }

  toggleTheme() {
    const active = this.themeService.getActiveTheme();
    if (active.name === 'light') {
      this.themeService.setTheme('dark');
    } else {
      this.themeService.setTheme('light');
    }
    this.updateToggleButtonText()
  }

}

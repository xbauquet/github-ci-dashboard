import { Directive, ElementRef, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ThemeService } from './theme.service';
import { Theme } from './theme';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appTheme]'
})
export class ThemeDirective implements OnInit {

  private unsubscribe = new Subject();

  constructor(private elementRef: ElementRef,
              private themeService: ThemeService) { }

  ngOnInit() {
    const active = this.themeService.getActiveTheme();
    if (active) {
      this.updateTheme(active);
    }
    this.themeService.themeChange.pipe(takeUntil(this.unsubscribe))
      .subscribe((theme: Theme) => this.updateTheme(theme));
  }

  updateTheme(theme: Theme) {
    for (const key in theme.properties) {
      this.elementRef.nativeElement.style.setProperty(key, theme.properties[key]);
    }
  }
}

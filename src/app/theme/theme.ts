import { InjectionToken } from '@angular/core';

export const THEMES = new InjectionToken('THEMES');
export const ACTIVE_THEME = new InjectionToken('ACTIVE_THEME');

export interface Theme {
  name: string;
  properties: any;
}

export interface ThemeOptions {
  themes: Theme[];
  active: string;
}

export const darkTheme: Theme = {
  name: 'dark',
  properties: {
    '--background': '#1F2125',
    '--text-color': '#fff'
  }
};

export const lightTheme: Theme = {
  name: 'light',
  properties: {
    '--background': '#f6f7f9',
    '--text-color': '#000'
  }
};

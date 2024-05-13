import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkmodeService {

  darkModeSignal = signal<string>('null');

  updateDarkMode() {
    this.darkModeSignal.update((value) => (value === "dark" ? "null" : "dark"));
  }
  constructor() { }
}

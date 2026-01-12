import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({ selector: '[appToggleTheme]' })
export class ToggleThemeDirective {
  constructor(private elementRef: ElementRef) { }

  @HostListener('click') toggleTheme() {
    const htmlElement = document.querySelector('html');

    if (htmlElement) {
      const currentMode = htmlElement.getAttribute('data-theme-mode');

      if (currentMode === 'dark') {
        // Switch to light mode
        htmlElement.setAttribute('data-header-styles', 'light');
        htmlElement.setAttribute('data-theme-mode', 'light');
        htmlElement.setAttribute('data-menu-styles', 'light');

      } else {
        // Switch to dark mode
        htmlElement.setAttribute('data-header-styles', 'dark');
        htmlElement.setAttribute('data-theme-mode', 'dark');
        htmlElement.setAttribute('data-menu-styles', 'dark');

        // Update local storage
        localStorage.setItem('valexDarkTheme', 'true');
        localStorage.setItem('valexHeader', 'dark');
        localStorage.setItem('valexMenu', 'dark');
      }
    }

    // To clear local storage when switching to light theme
    const currentMode = htmlElement?.getAttribute('data-theme-mode');
    if (currentMode === 'light') {
      localStorage.removeItem('valexDarkTheme');
      localStorage.removeItem('valexHeader');
      localStorage.removeItem('valexMenu');
    }
  }
}

import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({ selector: '[appDropdownToggle]' })
export class DropdownDirective {
  private isOpen = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click')
  onClick(): void {
    this.isOpen = !this.isOpen;
    this.updateDropdownState();
  }

  private updateDropdownState(): void {
    const dropdownMenu = this.el.nativeElement.nextElementSibling;

    if (this.isOpen) {
      this.renderer.addClass(dropdownMenu, 'show');
    } else {
      this.renderer.removeClass(dropdownMenu, 'show');
    }
  }
}

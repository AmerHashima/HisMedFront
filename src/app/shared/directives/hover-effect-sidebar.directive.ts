import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({ selector: '[appHoverEffectSidebar]' })
export class HoverEffectSidebarDirective {
  constructor(private eleRef: ElementRef, private render: Renderer2){}

   @HostListener('mouseover') onHover() {
     if (window.innerWidth > 768) {
       document.querySelector('html')?.setAttribute('data-icon-overlay', 'open');
     }
   }
   @HostListener('mouseleave') onLeave() {
     if (window.innerWidth > 768) {
       document.querySelector('html')?.removeAttribute('data-icon-overlay');
     }
   }
}

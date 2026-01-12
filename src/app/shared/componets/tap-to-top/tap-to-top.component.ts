import { ViewportScroller, NgStyle } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
    selector: 'app-tap-to-top',
    standalone:true,
    templateUrl: './tap-to-top.component.html',
    styleUrls: ['./tap-to-top.component.scss'],
    imports: [NgStyle]
})
export class TapToTopComponent implements OnInit {

  public show: boolean = false;

  constructor(
    private viewScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
  }

  @HostListener("window:scroll", [])

  onWindowScroll(){
    let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (number > 100) {
      this.show = true;
    } else {
      this.show = false;
    }
  }

  taptotop(){
    let body:any = document.querySelector('body')
    body.style. scrollBehavior = 'smooth';
    this.viewScroller.scrollToPosition([0,0]);
  }

}

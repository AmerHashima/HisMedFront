import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbModal, NgbNav, NgbNavItem, NgbNavLink, NgbNavLinkBase, NgbNavContent, NgbNavOutlet, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { SidebarRightService } from '../../services/sidebar-right.service';

@Component({
    selector: 'app-notification-sidebar',
    standalone:true,
    templateUrl: './notification-sidebar.component.html',
    styleUrls: ['./notification-sidebar.component.scss'],
    imports: [NgbNav, NgbNavItem, NgbNavLink, NgbNavLinkBase, NgbNavContent, NgbNavOutlet, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem]
})
export class NotificationSidebarComponent implements OnInit {

  layoutSub: Subscription;
  isOpen: boolean | any  
  
  @ViewChild('sidebar', {static: true}) sidebar: ElementRef | any;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    sidebarRightService: SidebarRightService, 
    private modalService: NgbModal
  ) {
    this.layoutSub = sidebarRightService.SidebarNotifyChangeEmitted.subscribe(
      value => {
        this.isOpen = document.querySelector('.sidebar')
        this.isOpen.classList.value.includes('show')
        if ( this.isOpen == !this.isOpen) {
          this.renderer.removeClass(this.sidebar.nativeElement, 'show');
        }
        else {
          this.renderer.addClass(this.sidebar.nativeElement, 'show');
        }
      }
    );
     
     const modal = document.querySelector('.chatmodalopen');
     if (modal) {
       modal.classList.toggle('show');
     }

  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
  }

  onClose(){
    this.renderer.removeClass(this.sidebar.nativeElement, 'show')
  }
  ngAfterViewInit(){
  }

  ChatModal(chatmodel:any){
    this.modalService.open(chatmodel ,{modalDialogClass:"modal-dialog-right chat chatbox", windowClass:"chatmodalopen"});
  }
  audioModal(audiomodal:any){
    this.modalService.open(audiomodal,{modalDialogClass:"", windowClass:"audiomodalopen"});
  }
  videoModal(videomodal:any){
    this.modalService.open(videomodal,{modalDialogClass:"", windowClass:"Videomodalopen"});
  }
}

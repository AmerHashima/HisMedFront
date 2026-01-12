import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
 
export class SharedService {
  private isMenuOpenSubject = new BehaviorSubject<boolean>(false);
  public isMenuOpen$: Observable<boolean> =
    this.isMenuOpenSubject.asObservable();

  toggleMenu() {
    const currentState = this.isMenuOpenSubject.value;
    this.isMenuOpenSubject.next(!currentState);
  }
}

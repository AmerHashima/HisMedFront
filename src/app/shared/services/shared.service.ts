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

   to24Hour(time12h: string | null): string {

    if (!time12h) return '00:00:00';

    const [timePart, modifier] = time12h.trim().split(/\s+/);
    const [h, m] = timePart.split(':');

    let hours = Number(h);
    const minutes = Number(m);

    const mod = modifier?.toUpperCase();

    if (mod === 'PM' && hours < 12) hours += 12;
    if (mod === 'AM' && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:00`;
  }

  formatDateOnly(value: string | Date): string {
    const d = new Date(value);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}

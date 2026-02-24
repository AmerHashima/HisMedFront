import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LOOKUPStore } from '../../store/lookup.store';

@Component({
  selector: 'app-lookup-layout',
  imports: [RouterOutlet],
  templateUrl: './lookup-layout.component.html',
  styleUrl: './lookup-layout.component.scss',
  providers: [LOOKUPStore]
})
export class LookupLayoutComponent {

}

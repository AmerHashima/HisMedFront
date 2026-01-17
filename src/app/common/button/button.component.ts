import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  btnLabel = input<string>('');
  buttonType = input<string>('button');
  disabled = input<boolean>(false);
  mainBtn = input<boolean>(true);

}

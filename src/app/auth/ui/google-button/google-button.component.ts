import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-google-button',
  standalone: true,
  imports: [],
  templateUrl: './google-button.component.html',
  styleUrl: './google-button.component.css'
})
export class GoogleButtonComponent {

  @Input() tituloBoton = '';
  accionBoton = output<void>();
  
}

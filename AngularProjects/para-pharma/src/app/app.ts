import { Component, signal } from '@angular/core';
import { ProductFilter } from './product-filter/product-filter';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductFilter],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('para-pharma');
}

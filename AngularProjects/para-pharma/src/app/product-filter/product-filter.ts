import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-filter.html',
  styleUrls: ['./product-filter.css'] 
})
export class ProductFilter {
  // champ de recherche
  search = '';

  // liste statique des produits
  products: Product[] = [
    { id: 1, name: 'Gel antiseptique 70%', price: 4.5, category: 'Hygiène', stock: 12 },
    { id: 2, name: 'Crème cicatrisante', price: 9.9, category: 'Soins', stock: 3 },
    { id: 3, name: 'Masque chirurgical', price: 0.5, category: 'Protection', stock: 0 },
    { id: 4, name: 'Vitamine C 500mg', price: 7.0, category: 'Compléments', stock: 20 },
    { id: 5, name: 'Sérum hydratant', price: 14.5, category: 'Soins', stock: 2 },
  ];

  // filtrage insensible à la casse et sans espaces inutiles
  get filteredProducts(): Product[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.products;
    return this.products.filter(p => p.name.toLowerCase().includes(q));
  }
}

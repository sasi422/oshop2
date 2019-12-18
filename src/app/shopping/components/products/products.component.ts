import 'rxjs/add/operator/switchMap';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Product } from 'shared/models/product';
import { ShoppingCart } from 'shared/models/shopping-cart';
import { ProductService } from 'shared/services/product.service';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';

import { SpinnerService } from './../../../spinner.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  cart$: Observable<ShoppingCart>;
  filteredProducts: Product[] = [];
  category: string;
  
  
  constructor(
    private productService: ProductService, 
    private route: ActivatedRoute, 
    private shoppingCartService: ShoppingCartService,
    private spinner: SpinnerService) { }

  async ngOnInit() {
    this.cart$ = await this.shoppingCartService.getCart();    
    this.populateProducts();
  }

  private populateProducts() {
    this.spinner.changeStatus(true, true);
    this.productService.getAll()
    .switchMap(products => {
      this.products = products as Product[];
      return this.route.queryParamMap;
    })
    .subscribe(params => {
      this.category = params.get('category');
      this.applyFilter();
      this.spinner.changeStatus(false, false);
    }); 
  }

  private applyFilter() {
    this.filteredProducts = (this.category) ?
    this.products.filter(p => p.category === this.category) : this.products;
  }

}

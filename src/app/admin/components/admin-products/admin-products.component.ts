import { SpinnerService } from './../../../spinner.service';
import { ProductService } from 'shared/services/product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Product } from 'shared/models/product';
import { DataTableResource } from 'angular-4-data-table';

@Component({
  selector: 'admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy{
  products: Product[];
  subscription: Subscription;
  tableResource: DataTableResource<Product>;
  items: Product[] = [];
  itemCount: number;

  constructor(private productService: ProductService, private spinner: SpinnerService) { 
    this.subscription = this.productService.getAll().subscribe(products => {
      this.products = products;
      this.initializeTable(products);
    });
  }

  ngOnInit() {
    this.spinner.changeStatus(true, true); 
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private initializeTable(products: Product[]) {
    
    this.tableResource = new DataTableResource(products);
      this.tableResource.query({ offset: 0 }).then(items => this.items = items);
      this.tableResource.count().then(count => this.itemCount = count);
      this.spinner.changeStatus(false, false); 
  }

  reloadItems(params) {
    this.spinner.changeStatus(true, true); 
    if(!this.tableResource) return;
    this.tableResource.query(params).then(items => this.items = items);
    this.spinner.changeStatus(false, false); 
  }

  filter(query: string) {
    this.spinner.changeStatus(true, true); 
    let filteredProducts = (query) ? this.products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) : this.products;
    this.initializeTable(filteredProducts);
    this.spinner.changeStatus(false, false); 
  }

}

import { ShoppingCart } from 'shared/models/shopping-cart';
import { AuthService } from 'shared/services/auth.service';
import { OrderService } from 'shared/services/order.service';
import { Router } from '@angular/router';
import { Order } from 'shared/models/order';
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.css']
})
export class ShippingFormComponent {
  
  shipping = {
    name: '',
    city: '',
    addressLine1: '',
    addressLine2: ''
  };
  subscription:Subscription;
  userId: string;
  @Input('cart') cart: ShoppingCart;

  constructor(private router: Router, private orderService: OrderService,private authService: AuthService) { }

  ngOnInit() {
    this.subscription = this.authService.user$.subscribe(user => this.userId = user.uid);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async placeOrder() {
    let order = new Order(this.userId, this.shipping, this.cart);
    let result = await this.orderService.scoreOrder(order);
    this.router.navigate(['/order-success', result.key])
  } 

}

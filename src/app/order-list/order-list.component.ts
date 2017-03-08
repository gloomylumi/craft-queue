import { Component, OnInit } from '@angular/core';

import { Order } from '../order'
import { OrdersService } from '../orders.service'

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[]

  constructor(
    private ordersService: OrdersService
  ) { }

  getOrders(): void {
    console.log("getting orders")
    this.ordersService
      .getOrders()
      .then(orders => this.orders = orders)
  }

  trackByOrders(index: number, order: Order): number {
    return order.orderId
  }

  ngOnInit(): void {
    this.getOrders()
  }
}

import { Component, OnInit, Input } from '@angular/core';

import { Order } from '../order'



@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.css']
})
export class OrderCardComponent implements OnInit {
  @Input()
  order: Order
  orderId: number
  orderDate: Date
  buyerName: string
  buyerMessage: string
  totalPrice: number
  items: any[]
  shipBy: Date

  constructor(order: Order) {
    this.orderId = order.orderId
    this.orderDate = order.orderDate
    this.buyerName = order.buyerName
    this.buyerMessage = order.buyerMessage
    this.totalPrice = order.totalPrice
    this.items = order.items
    this.shipBy = order.shipBy
  }


  ngOnInit(): void {

  }

}

import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Item, Order } from '../order'
// import { slideInDownAnimation }   from '../animations';
import { OrdersService } from '../orders.service'

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent implements OnInit {
  // @HostBinding('@routeAnimation') routeAnimation = true;

  orders: Order[]
  sort: string = 'shipBy'


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService
  ) { }

  getOrders(): any {
    this.orders = []

    this.ordersService.getOrders().then(orders => {
      console.log(orders)

      console.log(orders)
      orders.forEach((element) => {
        let orderId = element.orderId
        let orderDate = element.orderDate
        let buyerName = element.buyerName
        let buyerMessage = element.buyerMessage
        let totalPrice = element.totalPrice

        let shipBy = element.shipBy

        let items = element.items.map((item) => {

          let itemId = item.itemId
          let orderId = item.orderId
          let listingId = item.listingId
          let title = item.title
          let quantity = item.quantity
          let price = item.price
          let transactionUrl = item.transactionUrl
          let variationName1 = item.variationName1
          let variationValue1 = item.variationValue1
          let variationName2 = item.variationName2
          let variationValue2 = item.variationValue2
          let imageThumbnailUrl = item.imageThumbnailUrl
          let imageFullUrl = item.imageFullUrl
          let processingTime = item.processingTime
          return new Item(itemId, orderId, listingId, title, quantity, price, transactionUrl, variationName1, variationValue1, variationName2, variationValue2, imageThumbnailUrl, imageFullUrl, processingTime)

        })

        let order = new Order(orderId, orderDate, buyerName, buyerMessage, totalPrice, items, shipBy)
        this.orders.push(order)
        console.log(JSON.stringify(order))
      })
    })
  }
  // getOrders(): void {
  //   this.route.data
  //     .subscribe((data: { orders: Order[] }) => {
  //       this.orders = data.orders;
  //     });
  // }

  trackByOrders(index: number, order: Order): number {
    return order.orderId
  }

  ngOnInit(): any {
    this.getOrders()
  }
}

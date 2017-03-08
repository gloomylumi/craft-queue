import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// import { Order } from '../order'
// import { slideInDownAnimation }   from '../animations';
import { Order, OrdersService } from '../orders.service'

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  // @HostBinding('@routeAnimation') routeAnimation = true;

  orders: Order[]


  sample: Order


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
        let items = element.items
        let shipBy = element.shipBy
        let order = new Order(orderId, orderDate, buyerName, buyerMessage, totalPrice, items, shipBy)
        this.orders.push(order)
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

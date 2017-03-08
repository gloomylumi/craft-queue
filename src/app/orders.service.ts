import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';


export class Order {
  orderId: number
  orderDate: Date
  buyerName: string
  buyerMessage: string
  totalPrice: number
  items: any[]
  shipBy: Date

  constructor(orderId: number, orderDate: Date, name: string, buyerMessage: string, totalPrice: number, items: any[], shipBy: Date) {
    this.orderId = orderId
    this.orderDate = orderDate
    this.buyerName = name
    this.buyerMessage = buyerMessage
    this.totalPrice = totalPrice
    this.items = []
    this.shipBy = shipBy

  }
}


@Injectable()
export class OrdersService {
  private ordersUrl = 'api/orders'

  constructor(private http: Http) { }

  getOrders(): any {
    return this.http.get(this.ordersUrl)
      .toPromise()
      .then(response => {
        console.log(response.json())
        return response.json() as any[]
      })
      .catch(this.handleError)

  }

  private handleError(error: any): Promise<any> {
    console.log(error)
    console.error('An error has occurred', error)
    return Promise.reject(error.message || error)
  }
}

import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';


import { Order } from './order'

@Injectable()
export class OrdersService {
  private ordersUrl = 'api/orders'

  constructor(private http: Http) { }

  getOrders(): Promise<Order[]> {
    return this.http.get(this.ordersUrl)
      .toPromise()
      .then(response => { response.json() as Order[] })
      .catch(this.handleError)
  }

  private handleError(error: any): Promise<any> {
    console.error('An error has occurred', error)
    return Promise.reject(error.message || error)
  }
}

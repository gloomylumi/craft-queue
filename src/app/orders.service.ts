import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Order } from './order'

import 'rxjs/add/operator/toPromise';

@Injectable()
export class OrdersService {
  private ordersUrl = '/api/orders'

  constructor(private http: Http) { }

  getOrders() {
    return this.http.get(this.ordersUrl)
      .toPromise()
      .then(response => {
        console.log("response:", response.json())
        let sorted: Array<Order> = this.quickSortByShipDate(response.json())
        console.log(sorted)
        return sorted
      })
      .catch(this.handleError)

  }

  quickSortByShipDate(list: Array<Order>): Order[] {
    if (list.length === 0) {
      return [];
    }
    var lesser = []; var greater = []; var pivot = list[0];
    var pivotParam: number = list[0].shipBy.valueOf();
    for (var i = 1; i < list.length; i++) {
      if (list[i].shipBy.valueOf() < pivotParam) {
        lesser.push(list[i]);
      } else {
        greater.push(list[i]);
      }
    }
    return this.quickSortByShipDate(lesser).concat(pivot, this.quickSortByShipDate(greater));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error has occurred', error)
    return Promise.reject(error.message || error)
  }
}

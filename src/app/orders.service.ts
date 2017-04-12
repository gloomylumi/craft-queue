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
        let sorted: Array<Order> = response.json()[0].sort(this.compareDates)
        console.log(sorted)
        return sorted
      })
      .catch(this.handleError)

  }

  compareDates(a: Order, b: Order): number {
    console.log(a, b)
    let dateA: number = a.shipBy.valueOf()
    let dateB: number = b.shipBy.valueOf()
    if (dateA < dateB) {
      return -1
    }
    if (dateA > dateB) {
      return 1
    }
    return 0

  }

  // quickSortByShipDate(list: any[]): any[] {
  //   if (list.length == 0) {
  //     return [];
  //   }
  //   var lesser = []; var greater = []; var pivot = list[0];
  //   var pivotParam = Date.UTC(list[0].shipBy);
  //   for (var i = 1; i < list.length; i++) {
  //     if (Date.UTC(list[i].shipBy) < pivotParam) {
  //       lesser.push(list[i]);
  //     } else {
  //       greater.push(list[i]);
  //     }
  //   }
  //   return this.quickSortByShipDate(lesser).concat(pivot, this.quickSortByShipDate(greater)).reverse();
  // }

  private handleError(error: any): Promise<any> {
    console.error('An error has occurred', error)
    return Promise.reject(error.message || error)
  }
}

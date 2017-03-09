import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';





@Injectable()
export class OrdersService {
  private ordersUrl = '/api/orders'

  constructor(private http: Http) { }

  getOrders(): any {
    return this.http.get(this.ordersUrl)
      .toPromise()
      .then(response => {
        let sorted = this.quickSortByShipDate(response.json())
        console.log(sorted)
        return sorted
      })
      .catch(this.handleError)

  }
  quickSortByShipDate(list: any[]): any[] {
    if (list.length == 0) {
      return [];
    }
    var lesser = []; var greater = []; var pivot = list[0];
    var pivotParam = list[0].shipBy;
    for (var i = 1; i < list.length; i++) {
      if (list[i].shipBy < pivotParam) {
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

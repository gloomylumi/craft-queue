import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
  ActivatedRouteSnapshot } from '@angular/router';

import { Order } from './order'
import { OrdersService} from './orders.service'

@Injectable()
export class OrdersResolverService implements Resolve<Order[]> {

  constructor(private os: OrdersService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Order[]> {
    return this.os.getOrders().then(orders => {
      if (orders) {
        return orders;
      } else {
        this.router.navigate(['/login']);
        return null;
      }
    });
  }
}

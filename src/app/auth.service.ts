import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router'

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  private authUrl = 'http://localhost:3000/api/auth'

  constructor(private http: Http, private router: Router) { }

  authenticate(): any {
    return this.http.get(this.authUrl)
      .toPromise()
      .then((response) => {
        this.router.navigate['/user/orders']
        return
      })

  }

}

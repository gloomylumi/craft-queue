import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Router } from '@angular/router'

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  private authUrl = '/api/auth'

  constructor(private http: Http, private router: Router) { }

  authenticate(): any {
    return this.http.get(this.authUrl)
      .toPromise()
      .then((response) => {
        console.log(response)
        return response._body
      })

  }

}

import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service'

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  redirectUrl: string

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.authenticate()
      .then(data => this.redirectUrl = data)
  }

}

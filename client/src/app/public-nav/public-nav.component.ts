import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'
@Component({
  selector: 'app-public-nav',
  templateUrl: './public-nav.component.html',
  styleUrls: ['./public-nav.component.css', '../app.component.css'],
  providers: [AuthService]
})
export class PublicNavComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

}

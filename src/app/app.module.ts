import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import "materialize-css"
import { MaterializeModule } from 'angular2-materialize';


import {AuthService} from './auth.service'
import {OrdersService} from './orders.service'
import {OrdersResolverService} from './orders-resolver.service'

import { AppComponent } from './app.component';
import { SplashComponent } from './splash/splash.component';
import { PublicNavComponent } from './public-nav/public-nav.component';
import { UserSignUpComponent } from './user-sign-up/user-sign-up.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderCardComponent } from './order-card/order-card.component';
import { MenuDrawerComponent } from './menu-drawer/menu-drawer.component';
import { OrderItemComponent } from './order-item/order-item.component';
import { AuthNavComponent } from './auth-nav/auth-nav.component';

const appRoutes: Routes = [
  // {path: '', component: PublicNavComponent}
  // { path: 'crisis-center', component: CrisisListComponent },
  // { path: 'hero/:id',      component: HeroDetailComponent },
  {
    path: 'welcome',
    component: SplashComponent,
  },
  {
    path: 'login',
    component: UserLoginComponent
  },
  {
    path: 'user',
    component: AuthNavComponent,
    children: [
      {
        path: 'orders',
        component: OrderListComponent
      }
    ]
  },
  {
    path: 'callback',
    redirectTo: '/user/orders'
  },
  {
    path: 'signup',
    component: UserSignUpComponent,
  },
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    PublicNavComponent,
    UserSignUpComponent,
    UserLoginComponent,
    OrderListComponent,
    OrderCardComponent,
    MenuDrawerComponent,
    OrderItemComponent,
    AuthNavComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    MaterializeModule,

  ],
  providers: [
    AuthService,
    OrdersService,
    OrdersResolverService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

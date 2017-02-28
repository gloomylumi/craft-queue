import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import { SplashComponent } from './splash/splash.component';
import { PublicNavComponent } from './public-nav/public-nav.component';
import { UserSignUpComponent } from './user-sign-up/user-sign-up.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderCardComponent } from './order-card/order-card.component';
import { MenuDrawerComponent } from './menu-drawer/menu-drawer.component';

const appRoutes: Routes = [
  // { path: 'crisis-center', component: CrisisListComponent },
  // { path: 'hero/:id',      component: HeroDetailComponent },
  // {
  //   path: 'heroes',
  //   component: HeroListComponent,
  //   data: { title: 'Heroes List' }
  // },
  // { path: '',
  //   redirectTo: '/heroes',
  //   pathMatch: 'full'
  // },
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
    MenuDrawerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
    // RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

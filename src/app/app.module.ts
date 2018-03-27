import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Component} from '@angular/core';
import { LottieAnimationViewModule } from 'ng-lottie';

import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms';
import { DataService } from './services/data.service';   // our custom service responsible of communications between the front-end and back-end of the application


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LottieAnimationComponent } from './lottie-animation/lottie-animation.component';
import { animationSuccess } from './lottie-animation/lottie-animation2.component';
import { ErrorComponent } from './error/error.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LottieAnimationComponent,
    animationSuccess,
    ErrorComponent

  ],
  imports: [
    BrowserModule,
    FormsModule, 
    HttpClientModule,
    LottieAnimationViewModule.forRoot(),
    RouterModule.forRoot([
      
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'error',
        component: ErrorComponent
      }
      
    ])
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

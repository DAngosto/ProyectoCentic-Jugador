import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Component} from '@angular/core';
import { LottieAnimationViewModule } from 'ng-lottie';

import { HttpClientModule } from '@angular/common/http'; 

import { HttpModule } from '@angular/http';

import { FormsModule } from '@angular/forms';
import { DataService } from './services/data.service';   // our custom service responsible of communications between the front-end and back-end of the application


import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LottieAnimationComponent } from './components/lottie-animation/lottie-animation.component';
import { animationSuccess } from './components/lottie-animation/lottie-animation2.component';
import { ErrorComponent } from './components/error/error.component';
import { Stage1Component } from './components/stage1/stage1.component';
import { Stage6Component } from './components/stage6/stage6.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LottieAnimationComponent,
    animationSuccess,
    ErrorComponent,
    Stage1Component,
    Stage6Component

  ],
  imports: [
    BrowserModule,
    FormsModule, 
    HttpClientModule,
    HttpModule,
    LottieAnimationViewModule.forRoot(),
    RouterModule.forRoot([
      
      {
        path: '',
        component: Stage6Component
      },
      { path: 'stage1', component: Stage1Component },
      { path: 'stage6', component: Stage6Component },
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

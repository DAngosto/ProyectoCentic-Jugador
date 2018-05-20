//MODULES
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { LottieAnimationViewModule } from 'ng-lottie';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//COMPONENTS
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LottieAnimationComponent } from './components/lottie-animation/lottie-animation.component';
import { animationSuccess } from './components/lottie-animation/lottie-animation2.component';
import { ErrorComponent } from './components/error/error.component';
import { Stage1Component } from './components/stage1/stage1.component';
import { Stage6Component } from './components/stage6/stage6.component';
import { Stage2Component } from './components/stage2/stage2.component';
import { Stage3Component } from './components/stage3/stage3.component';
import { Stage4Component } from './components/stage4/stage4.component';
import { Stage5Component } from './components/stage5/stage5.component';
import { FinalPageComponent } from './components/final-page/final-page.component';

//SERVICES
import { DataService } from './services/data.service';
import { GameplayService } from './services/gameplay.service'; 
import { ErrorService } from './services/error.service'; 

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LottieAnimationComponent,
    animationSuccess,
    ErrorComponent,
    Stage1Component,
    Stage6Component,
    Stage2Component,
    Stage3Component,
    Stage4Component,
    Stage5Component,
    FinalPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    HttpClientModule,
    BrowserAnimationsModule,
    LottieAnimationViewModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'stage1', component: Stage1Component },
      { path: 'stage2', component: Stage2Component },
      { path: 'stage3', component: Stage3Component },
      { path: 'stage4', component: Stage4Component },
      { path: 'stage5', component: Stage5Component },
      { path: 'stage6', component: Stage6Component },
      { path: 'final', component: FinalPageComponent },
      { path: 'error', component: ErrorComponent },
      { path: '**', redirectTo: '/home', pathMatch: 'full' }
    ])
  ],
  providers: [DataService, GameplayService, ErrorService],
  bootstrap: [AppComponent]
})

export class AppModule { }

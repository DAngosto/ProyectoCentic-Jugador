//MODULES
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'animation-success',
  template: `<div>
               <lottie-animation-view
                  [options]="lottieConfig"
                  [width]="300"
                  [height]="200"
                  (animCreated)="handleAnimation($event)">
              </lottie-animation-view>
            </div>`
})

export class animationSuccess {

  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;

  constructor() {
      this.lottieConfig = {
          path: 'assets/animations/trophy.json',
          autoplay: true,
          loop: true
      };
  }

  handleAnimation(anim: any) {
      this.anim = anim;
  }

  stopAnim(){
      this.anim.stop();
  }

}/// END OF COMPONENT animationSuccess ///

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {AppSettings} from '../appSettings';



@Injectable()
export class GameplayService {


  score: number = 0;
  private messageSource = new BehaviorSubject<number>(this.score);
  userScore = this.messageSource.asObservable();


  

  constructor() { }


  incrementScore(){
    this.score = this.score + AppSettings.SCORE_INCREMENT;
    console.log("score en el servicio" + this.score);
  }

  decrementScore(){
    if((this.score-AppSettings.SCORE_INCREMENT)<0){

      this.score = 0;
      console.log("score en el servicio" + this.score);
    }
    else{
      this.score = this.score - AppSettings.SCORE_DECREMENT;
      console.log("score en el servicio" + this.score);
    }
  }


  getActualScore(): number{
    return this.score;
  }
  
  changeStageSound(){
    var audio = new Audio();
    audio.src = "../../assets/changeStage.wav";
    audio.load();
    audio.play();
  }

  successSound(){
    var audio = new Audio();
    audio.src = "../../assets/success.wav";
    audio.load();
    audio.play();
  }

  looseSound(){
    var audio = new Audio();
    audio.src = "../../assets/loose.wav";
    audio.load();
    audio.play();
  }

  finalSound(){
    var audio = new Audio();
    audio.src = "../../assets/finalpage.wav";
    audio.load();
    audio.play();
  }

}

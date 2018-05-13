import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {AppSettings} from '../appSettings';



@Injectable()
export class GameplayService implements OnInit{


  score: number = 0;
  private messageSource = new BehaviorSubject<number>(this.score);
  userScore = this.messageSource.asObservable();

  gamemode: number;
  scoreIncrement: number; 
  scoreDecrement: number; 
  numberLives: number;


  

  constructor() { }

  ngOnInit() {

    /*
    console.log("puntos arcade servicio" + localStorage.getItem("arcadesuccesspoints"));
    this.gamemode = Number(localStorage.getItem("gamemode"));
    if(this.gamemode==0){
      this.scoreIncrement = Number(localStorage.getItem("arcadesuccesspoints"));
      this.scoreDecrement = Number(localStorage.getItem("arcadefailpoints"));
    }
    else if(this.gamemode==1){
      this.scoreIncrement = Number(localStorage.getItem("survivalsuccesspoints"));
      this.scoreDecrement = Number(localStorage.getItem("survivalfailpoints"));
      this.numberLives = Number(localStorage.getItem("survivallives"));
    }
    */
  }

  incrementScore(){
    this.score = this.score + Number(localStorage.getItem("successpoints"));
  }

  decrementScore(){
    if((this.score-Number(localStorage.getItem("failpoints")))<0){
      this.score = 0;
    }
    else{
      this.score = this.score - Number(localStorage.getItem("failpoints"));
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

  jokerMultiSound(){
    var audio = new Audio();
    audio.src = "../../assets/jokerMulti.wav";
    audio.load();
    audio.play();
  }

  jokerVolteoSound(){
    var audio = new Audio();
    audio.src = "../../assets/jokerVolteo.wav";
    audio.load();
    audio.play();
  }

}

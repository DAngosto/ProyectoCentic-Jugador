//MODULES
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

//SETTINGS
import {AppSettings} from '../appSettings';

@Injectable()
export class GameplayService implements OnInit{

  score: number = 0;
  private messageSource = new BehaviorSubject<number>(this.score);
  userScore = this.messageSource.asObservable();

  fails: number = 0;
  private messageSource3 = new BehaviorSubject<number>(this.fails);
  userFails = this.messageSource3.asObservable();

  lives: number;
  private messageSource2 = new BehaviorSubject<number>(this.lives);
  userLives = this.messageSource2.asObservable();

  gamemode: number;
  scoreIncrement: number; 
  scoreDecrement: number; 
  numberLives: number;

  constructor() { }

  ngOnInit() {
  }

  /*
  EN:Function in charge of increasing the player's score.
  ES:Función encargada de aumentar la puntuación del jugador.
  */
  incrementScore(){
    this.score = this.score + Number(localStorage.getItem("successpoints"));
  }

  /*
  EN:Function in charge of decreasing the player's score.
  ES:Función encargada de disminuir la puntuación del jugador.
  */
  decrementScore(){
    if((this.score-Number(localStorage.getItem("failpoints")))<0){
      this.score = 0;
    }else{
      this.score = this.score - Number(localStorage.getItem("failpoints"));
    }
  }

  setLives(quantity){
    this.lives = quantity;
  }

  getActualScore(): number{
    return this.score;
  }

  /*
  EN:Function in charge of decreasing the lives of the player and in case of being 0 return true to finish the game of the player.
  ES:Función encargada de disminuir las vidas del jugador y en caso de ser 0 devolver true para así acabar la partida del jugador.
  */
  decrementLives(): boolean{
    if((this.lives-1)>0){
      this.lives--;
      return false;
    }else{
      this.lives--;
      return true;
    }
  }

  getActualLives(): number{
    return this.lives;
  }

  incrementFails(){
    this.fails++;
  }

  getActualFails(): number{
    return this.fails;
  }
  

  /*
  EN:Below you will find all the functions for reproducing sounds according to events that took place during the game.
  ES:Hacia abajo se encuentran todas las funciones encargadas de reproducir sonidos según eventos sucedidos durante el juego.
  */

  changeStageSound(){
    var audio = new Audio();
    audio.src = "../../assets/audios/changeStage.wav";
    audio.load();
    audio.play();
  }

  successSound(){
    var audio = new Audio();
    audio.src = "../../assets/audios/success.wav";
    audio.load();
    audio.play();
  }

  looseSound(){
    var audio = new Audio();
    audio.src = "../../assets/audios/loose.wav";
    audio.load();
    audio.play();
  }

  finalSound(){
    var audio = new Audio();
    audio.src = "../../assets/audios/finalpage.wav";
    audio.load();
    audio.play();
    return audio;
  }

  jokerMultiSound(){
    var audio = new Audio();
    audio.src = "../../assets/audios/jokerMulti.wav";
    audio.load();
    audio.play();
  }

  jokerVolteoSound(){
    var audio = new Audio();
    audio.src = "../../assets/audios/jokerVolteo.wav";
    audio.load();
    audio.play();
  }

}// END OF SERVICE GameplayService

//MODULES
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { trigger, state, style, animate, transition} from '@angular/animations';

//SERVICES
import { DataService } from '../../services/data.service';
import { GameplayService } from '../../services/gameplay.service';
import { ErrorService } from '../../services/error.service';

//INTERFACES
import { Card } from '../../interfaces/Card';
import { Collection } from '../../interfaces/Collection';
import { Configuration } from '../../interfaces/Configuration';

//SETTINGS
import { AppSettings } from '../../appSettings';

@Component({
  selector: 'app-stage4',
  templateUrl: './stage4.component.html',
  styleUrls: ['./stage4.component.scss'],
  animations: [
    trigger('jokerAnimation', [
      state('hide',   style({
        opacity: 1
      })),
      state('spin',   style({
        transform: 'rotateY(180deg) ',
      })),
      transition('spin => hide', animate('600ms ease-out')),
      transition('hide => spin', animate('600ms ease-in'))
    ])
  ]
})

export class Stage4Component implements OnInit {

  url1: string = "";
  url2: string = "";
  url3: string = "";
  url4: string = "";
  url5: string = "";
  url6: string = "";
  url7: string = "";
  url8: string = "";
  url9: string = "";
  url10: string = "";
  url11: string = "";
  url12: string = "";
  info: any;
  cards: Card[] = [];
  gameConfig: Configuration;
  invitation:string = "";
  validation:string = "";
  checkCardsNext: boolean = false;
  cardCheck1: string;
  cardCheck2: number;
  correctIDs: string[] = [];
  counter: number = 0;
  randomCards: Card[] = [];
  urlFilesSplitted;
  userScore;
  userLives;
  gamemode;
  arcade: boolean;
  survival: boolean;
  comodinMultiplicador:boolean;
  jokerMultiWastedHere:boolean = false;
  comodinVolteo: boolean;
  cardName: string;
  cardHistory: string;
  cardURL: string;
  stageCard: Card;
  sawGame: boolean = false;
  show = false;

  sound: boolean;

  constructor(private _dataService: DataService, private router:Router, private activatedRoute: ActivatedRoute, private _gameplayService: GameplayService, private _errorService: ErrorService) { }

  ngOnInit() {
    if(Number(localStorage.getItem('comodinMulti'))==0){
      this.comodinMultiplicador = false;
    }else{
      this.comodinMultiplicador = true;
    }
    if(Number(localStorage.getItem('comodinVolteo'))==0){
       this.comodinVolteo = false;
    }else{
      this.comodinVolteo = true;
    }
    if((localStorage.getItem('sound'))=='Y'){
      this.sound = true;
    }else{
      this.sound = false;
    }
    this.gamemode = Number(localStorage.getItem("gamemode"));
    if(this.gamemode==0){
      this.arcade = true;
      this.survival = false;
    }else if(this.gamemode==1){
      this.survival = true;
      this.arcade = false;
      this.userLives = this._gameplayService.getActualLives();
    }
    this.stageCard = this._dataService.addNewCardDisplayed();
    if(!this.stageCard){
      this._errorService.setError("No habia carta para mostrar");
      this.router.navigate(["error"], {replaceUrl:true});
    }
    this.cardName = this.stageCard.name;
    this.cardHistory = this.stageCard.history;
    this.cardURL = AppSettings.API_ENDPOINT + this.stageCard.fileURL;
    this._dataService.currentCardsDisplayed.subscribe(cardsDisplayed => this.cards = cardsDisplayed);
    if (this.cards.length<=2){
      this._errorService.setError("El tamaño de la colección a mostrar no cumplía los mínimos");
      this.router.navigate(["error"], {replaceUrl:true});
    }else{
      this._dataService.gameConfiguration.subscribe(gameConfiguration => this.gameConfig = gameConfiguration);
      this.userScore = this._gameplayService.getActualScore();
      var arrayAux = this.cards.slice(0);
      var urlFiles: string;
      var iniLength = arrayAux.length;
      for (let i=0; i<iniLength;i++){
        var rand = Math.floor(Math.random() * arrayAux.length);
        this.randomCards.push(arrayAux[rand]);
        if (i==0) {
          urlFiles = AppSettings.API_ENDPOINT + arrayAux[rand].fileURL + ',';
        }else if (i==(iniLength-1)){
          urlFiles = urlFiles + AppSettings.API_ENDPOINT + arrayAux[rand].fileURL;
        }else{
          urlFiles = urlFiles + AppSettings.API_ENDPOINT + arrayAux[rand].fileURL + ',';
        }
        arrayAux.splice(rand,1);
      }
      this.urlFilesSplitted = urlFiles.split(',');
      this.url1 = this.gameConfig.cardCover;
      this.url2 = this.gameConfig.cardCover;
      this.url3 = '../../../assets/images/dorsoTransparente.png';
      this.url4 = '../../../assets/images/dorsoTransparente.png';
      this.url5 = this.gameConfig.cardCover;
      this.url6 = this.gameConfig.cardCover;
      this.url7 = this.gameConfig.cardCover;
      this.url8 = this.gameConfig.cardCover;
      this.url9 = '../../../assets/images/dorsoTransparente.png';
      this.url10 = '../../../assets/images/dorsoTransparente.png';
      this.url11 = this.gameConfig.cardCover;
      this.url12 = this.gameConfig.cardCover;
    }
  }

  get stateName() {
    return this.show ? 'spin' : 'hide'
  }
  /*
  EN:Functions in charge of performing the flip animation when pressing the flip joker.
  ES:Funciones encargadas de realizar la animación de volteo al pulsar el comodín de volteo.
  */
  toggle() {
    this.show = !this.show;
  }

  /*
  EN:Function in charge of hiding the information of the new card and allowing the player to play the current phase.
  ES:Función encargada de ocultar la información de la nueva carta y permitir al jugador jugar la fase actual.
  */
  playGame(){
    this.sawGame = true;
  }

  swapSoundState() {
    if (this.sound==true){
      localStorage.setItem("sound",'N');
      this.sound=false;

    }else{
      localStorage.setItem("sound",'Y');
      this.sound=true;
    }
  }

  /*
  EN:Function in charge of activating the joker selected by the player.
  ES:Función encargada de activar el comodín seleccionado por el jugador.
  */
 useJoker(idComodin){
  switch (idComodin){
    case 1:
          var aux = Number(localStorage.getItem('successpoints')) + Number(localStorage.getItem('successpoints'));
          this._dataService.setNewSuccessPoints(false,aux.toString());
          this.comodinMultiplicador=false;
          localStorage.setItem('comodinMulti', "0");
          this.jokerMultiWastedHere=true;
          this.userScore = this._gameplayService.getActualScore();
          if (this.sound){
            this._gameplayService.jokerMultiSound();
          }
          break;
    case 2:
          this.comodinVolteo = false;
          this.toggle();
          setTimeout(()=>{ 
            if (this.sound){
              this._gameplayService.jokerVolteoSound();
            }
            for(let i=0;i<this.urlFilesSplitted.length;i++){
              this.changeUrl(i,false);
            }
          },550);
          setTimeout(()=>{ 
            this.toggle();
          },3000); 
          setTimeout(()=>{    
            localStorage.setItem('comodinVolteo', "0");
            for(let i=0;i<this.urlFilesSplitted.length;i++){
              this.changeUrl(i,true);
            }
          },3500);
          break;
  }
}

  /*
  EN:Function in charge of showing or hiding the cards selected by the player.
  ES:Función encargada de mostrar u ocultar las cartas seleccionadas por el jugador.
  */
  changeUrl(id, reset){
    switch(id){
      case 0:
            if (reset){
              this.url1 = this.gameConfig.cardCover;
            }else{
              this.url1 = this.urlFilesSplitted[id];
            }
            break;
      case 1:
            if (reset){
              this.url2 = this.gameConfig.cardCover;
            }else{
              this.url2 = this.urlFilesSplitted[id];
            }
            break;
      case 2:
            if (reset){
              this.url5 = this.gameConfig.cardCover;
            }else{
              this.url5 = this.urlFilesSplitted[id];
            }
            break;
      case 3:
            if (reset){
              this.url6 = this.gameConfig.cardCover;
            }else{
              this.url6 = this.urlFilesSplitted[id];
            }
            break;
      case 4:
            if (reset){
              this.url7 = this.gameConfig.cardCover;
            }else{
              this.url7 = this.urlFilesSplitted[id];
            }
            break;
      case 5:
            if (reset){
              this.url8 = this.gameConfig.cardCover;
            }else{
              this.url8 = this.urlFilesSplitted[id];
            }
            break;
      case 6:
            if (reset){
              this.url11 = this.gameConfig.cardCover;
            }else{
              this.url11 = this.urlFilesSplitted[id];
            }
            break;
      case 7:
            if (reset){
              this.url12 = this.gameConfig.cardCover;
            }else{
              this.url12 = this.urlFilesSplitted[id];
            }
            break;
    }
  }

  /*
  EN:Function in charge of storing the first card selected by the player and comparing it with the second one to see if they match.
  ES:Función encargada de almacenar la primera carta seleccionada por el jugador y compararla con la segunda para ver si estas coinciden.
  */
  sawCard(id){
    if (!this.checkCardsNext){
      var cardDone = false;
      for(var i=0;i<this.correctIDs.length;i++){
        if(this.correctIDs[i]==this.randomCards[id]._id){
          cardDone=true;
          break;
        }
      }
      if(!cardDone){
        this.checkCardsNext = true;
        this.cardCheck1 = this.randomCards[id]._id;
        this.cardCheck2 = id;
        this.changeUrl(id,false);
      }
    }else{
      var cardDone = false;
      for(var i=0;i<this.correctIDs.length;i++){
        if(this.correctIDs[i]==this.randomCards[id]._id){
          cardDone=true;
          break;
        }
      }
      if(!cardDone){
        this.checkCardsNext = false;
        if(this.cardCheck2==id){
          this.checkCardsNext = true;
        }
        else{
          if(this.randomCards[id]._id==this.cardCheck1){
            if(this.gamemode==0){
              this.correctIDs.push(this.cardCheck1);
              this.counter++;
              this.changeUrl(id,false);
              if (this.sound){
                this._gameplayService.successSound();
              }
              this._gameplayService.incrementScore();
              this.userScore = this._gameplayService.getActualScore();
              if(this.counter==4){
                if(this.jokerMultiWastedHere){
                  this._dataService.setNewSuccessPoints(true, 0);
                }
                setTimeout(()=>{
                  if (this.sound){
                    this._gameplayService.changeStageSound();
                  }                  this.router.navigate(["stage5"], {replaceUrl:true});
                },1000);
              }
            }else if (this.gamemode==1){
              this.correctIDs.push(this.cardCheck1);
              this.counter++;
              this.changeUrl(id,false);
              if (this.sound){
                this._gameplayService.successSound();
              }
              if(this.counter==4){
                if (this.sound){
                  this._gameplayService.changeStageSound();
                }                setTimeout(()=>{
                  this.router.navigate(["stage5"], {replaceUrl:true});
                },1000);
              }
            }
          }else{
            if(this.gamemode==0){
              this.changeUrl(id,false);
              if (this.sound){
                this._gameplayService.looseSound();
              }
              this._gameplayService.decrementScore();
              this._gameplayService.incrementFails();
              this.userScore = this._gameplayService.getActualScore();
              setTimeout(()=>{
                this.changeUrl(id,true);
                this.changeUrl(this.cardCheck2,true);
              },500);
            }else if (this.gamemode==1){
              this.changeUrl(id,false);
              var aux =  this._gameplayService.decrementLives();
              this.userLives = this._gameplayService.getActualLives();
              if (this.sound){
                this._gameplayService.looseSound();
              }
              setTimeout(()=>{
                this.changeUrl(id,true);
                this.changeUrl(this.cardCheck2,true);
              },500);
              if(aux){
                this.router.navigate(["final"], {replaceUrl:true});
              }
            }
          }
        }  
      }
    }
  }

}/// END OF COMPONENT Stage4Component ///

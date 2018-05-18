//MODULES
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

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
  selector: 'app-stage1',
  templateUrl: './stage1.component.html',
  styleUrls: ['./stage1.component.scss']
})

export class Stage1Component implements OnInit {

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
  sawGame: boolean = false;
  comodinMultiplicador:boolean;
  jokerMultiWastedHere:boolean = false;
  comodinVolteo: boolean;
  cardName: string;
  cardHistory: string;
  cardURL: string;
  stageCard: Card;

  constructor(private _dataService: DataService, private router:Router, private activatedRoute: ActivatedRoute, private _gameplayService: GameplayService, private _errorService: ErrorService) { }

  ngOnInit() {
    localStorage.setItem('comodinMulti', "1");
    localStorage.setItem('comodinVolteo', "1");
    this.comodinMultiplicador = true;
    this.comodinVolteo = true;
    this.gamemode = Number(localStorage.getItem("gamemode"));
    if(this.gamemode==0){
      this.arcade = true;
      this.survival = false;
    }else if(this.gamemode==1){
      this.survival = true;
      this.arcade = false;
      this._gameplayService.setLives(Number(localStorage.getItem("survivallives")));
      this.userLives = this._gameplayService.getActualLives();
    }
    this.stageCard = this._dataService.addNewCardDisplayed();
    if(!this.stageCard){
      this._errorService.setError("No habia carta para mostrar");
      this.router.navigate(["error"]);
    }
    this.cardName = this.stageCard.name;
    this.cardHistory = this.stageCard.history;
    this.cardURL = AppSettings.API_ENDPOINT + this.stageCard.fileURL;
    this._dataService.currentCardsDisplayed.subscribe(cardsDisplayed => this.cards = cardsDisplayed);
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
      }
      arrayAux.splice(rand,1);
    }
    this.urlFilesSplitted = urlFiles.split(',');
    this.url1 = '../../../assets/images/dorsoTransparente.png';
    this.url2 = '../../../assets/images/dorsoTransparente.png';
    this.url3 = '../../../assets/images/dorsoTransparente.png';
    this.url4 = '../../../assets/images/dorsoTransparente.png';
    this.url5 = this.gameConfig.cardCover;
    this.url6 = '../../../assets/images/dorsoTransparente.png';
    this.url7 = this.gameConfig.cardCover;
    this.url8 = '../../../assets/images/dorsoTransparente.png';
    this.url9 = '../../../assets/images/dorsoTransparente.png';
    this.url10 = '../../../assets/images/dorsoTransparente.png';
    this.url11 = '../../../assets/images/dorsoTransparente.png';
    this.url12 = '../../../assets/images/dorsoTransparente.png';
  }

  playGame(){
    this.sawGame = true;
  }

  useJoker(idComodin){
    switch (idComodin){
      case 1:
            var aux = Number(localStorage.getItem('successpoints')) + Number(localStorage.getItem('successpoints'));
            this._dataService.setNewSuccessPoints(false,aux.toString());
            this.comodinMultiplicador=false;
            localStorage.setItem('comodinMulti', "0");
            this.jokerMultiWastedHere=true;
            this.userScore = this._gameplayService.getActualScore();
            this._gameplayService.jokerMultiSound();
            break;
      case 2:
            this._gameplayService.jokerVolteoSound();
            for(let i=0;i<this.urlFilesSplitted.length;i++){
              this.changeUrl(i,false);
            }
            setTimeout(()=>{
              this.comodinVolteo = false;
              localStorage.setItem('comodinVolteo', "0");
              for(let i=0;i<this.urlFilesSplitted.length;i++){
                this.changeUrl(i,true);
              }
            },3000);
            break;
    }
  }

  changeUrl(id, reset){
    switch(id){
      case 0:
            if (reset){
              this.url5 = this.gameConfig.cardCover;
            }else{
              this.url5 = this.urlFilesSplitted[id];
            }
            break;
      case 1:
            if (reset){
              this.url7 = this.gameConfig.cardCover;
            }else{
              this.url7 = this.urlFilesSplitted[id];
            }
            break;
    }
  }

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
      }else{
        this.changeUrl(id,true);
      }
    }else{
      //Primero comprobamos si esa carta ya se ha completado
      var cardDone = false;
      for(var i=0;i<this.correctIDs.length;i++){
        if(this.correctIDs[i]==this.randomCards[id]._id){
          cardDone=true;
          break;
        }
      }
      //En el caso de que no se haya compeltado procedemos a comprobar si es la misma carta
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
              this._gameplayService.successSound();
              this._gameplayService.incrementScore();
              this.userScore = this._gameplayService.getActualScore();
              if(this.counter==1){
                this._gameplayService.changeStageSound();
                if(this.jokerMultiWastedHere){
                  this._dataService.setNewSuccessPoints(true, 0);
                }
                setTimeout(()=>{
                  this.router.navigate(["stage2"]);
                },1000);
              }
            }else if (this.gamemode==1){
              this.correctIDs.push(this.cardCheck1);
              this.counter++;
              this.changeUrl(id,false);
              this._gameplayService.successSound();
              if(this.counter==1){
                this._gameplayService.changeStageSound();
                setTimeout(()=>{
                  this.router.navigate(["stage2"]);
                },1000);
              }
            }
          }else{
            if(this.gamemode==0){
              this.changeUrl(id,false);
              this._gameplayService.looseSound();
              this._gameplayService.decrementScore();
              this._gameplayService.incrementFails();
              this.userScore = this._gameplayService.getActualScore();
              setTimeout(()=>{
                this.changeUrl(id,true);
              },500);
            }
            else if (this.gamemode==1){
              this.changeUrl(id,false);
              var aux =  this._gameplayService.decrementLives();
              this.userLives = this._gameplayService.getActualLives();
              this._gameplayService.looseSound();
              setTimeout(()=>{ 
                this.changeUrl(id,true);
                this.changeUrl(this.cardCheck2,true);
              },500);
              if(aux){
                this.router.navigate(["final"]);
              }
            }
          }
        } 
      }else{
        this.changeUrl(id,true);
      }
    }
  }

}/// END OF COMPONENT Stage1Component ///

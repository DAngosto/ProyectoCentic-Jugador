import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { GameplayService } from '../../services/gameplay.service';


import { Card } from '../../interfaces/Card';
import { Collection } from '../../interfaces/Collection';
import { Configuration } from '../../interfaces/Configuration';

import { ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-stage5',
  templateUrl: './stage5.component.html',
  styleUrls: ['./stage5.component.scss']
})
export class Stage5Component implements OnInit {
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


  constructor(private _dataService: DataService, private router:Router, private activatedRoute: ActivatedRoute, private _gameplayService: GameplayService) { }

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

          this.gamemode = Number(localStorage.getItem("gamemode"));
          if(this.gamemode==0){
              this.arcade = true;
              this.survival = false;

          }
          else if(this.gamemode==1){
            this.survival = true;
            this.arcade = false;
            this.userLives = this._gameplayService.getActualLives();

          }




          this.stageCard = this._dataService.addNewCardDisplayed();
          this.cardName = this.stageCard.name;
          this.cardHistory = this.stageCard.history;
          this.cardURL = 'https://gameserver.centic.ovh' + this.stageCard.fileURL;
            this._dataService.currentCardsDisplayed.subscribe(cardsDisplayed => this.cards = cardsDisplayed);
            console.log(this.cards.length);

            if (this.cards.length<=2){
              this.router.navigate(["/home"]);
            }
            else{
              this._dataService.gameConfiguration.subscribe(gameConfiguration => this.gameConfig = gameConfiguration);
              this.userScore = this._gameplayService.getActualScore();
  
              var arrayAux = this.cards.slice(0);
              var urlFiles: string;
              var iniLength = arrayAux.length;
              for (let i=0; i<iniLength;i++){
                var rand = Math.floor(Math.random() * arrayAux.length);
                this.randomCards.push(arrayAux[rand]);
  
                if (i==0) {
                  urlFiles = 'https://gameserver.centic.ovh' + arrayAux[rand].fileURL + ',';
                }
                else if (i==(iniLength-1)){
                  urlFiles = urlFiles + 'https://gameserver.centic.ovh' + arrayAux[rand].fileURL;
                }
                else{
                  urlFiles = urlFiles + 'https://gameserver.centic.ovh' + arrayAux[rand].fileURL + ',';
                }
                arrayAux.splice(rand,1);
              }
  
          
              this.urlFilesSplitted = urlFiles.split(',');
              //for (let i=0; i<urlFilesSplitted.length;i++){
              //}
              this.url1 = this.gameConfig.cardCover;
              this.url2 = this.gameConfig.cardCover;
              this.url3 = this.gameConfig.cardCover;
              this.url4 = this.gameConfig.cardCover;
              this.url5 = '../../../assets/dorsoTransparente.png';
              this.url6 = this.gameConfig.cardCover;
              this.url7 = this.gameConfig.cardCover;;
              this.url8 = '../../../assets/dorsoTransparente.png';
              this.url9 = this.gameConfig.cardCover;
              this.url10 = this.gameConfig.cardCover;
              this.url11 = this.gameConfig.cardCover;
              this.url12 = this.gameConfig.cardCover;
              
        
              console.log("cartas en el stage 5 "  + this.cards.length);
              console.log(this.gameConfig);
              /*
        
        
              
        
              var arrayAux = this.cards;
              console.log(arrayAux.length);
              arrayAux.splice(3,2);
              console.log(arrayAux.length);
              //console.log(this.cards);
              //this._dataService.randomizeCards();
              //console.log(this.cards);
        */
            }
            
      
            
         
      //}else{
      //  this.router.navigate(["error"]);
      //}
    


    
    /*
      this._dataService.getPointsValue().subscribe(
         data => { console.log(data)},
         err => console.error(err)
       );
    
    */
    
    
  
  
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
        this._gameplayService.jokerMultiSound();
        this.userScore = this._gameplayService.getActualScore();

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

  setCard(_id,name,history,tags,fileURL,itemType, publish) : Card{
    var cardAux: Card = {_id,name,history,tags,fileURL,itemType, publish};
    cardAux._id = _id;
    cardAux.name = name;
    cardAux.history = history;
    cardAux.tags = tags;
    cardAux.fileURL = fileURL;
    cardAux.itemType = itemType;
    cardAux.publish = publish;
    return cardAux;
  }


  
  
 
  
  
  





  changeUrl(id, reset){
    switch(id){
      case 0:
        if (reset){
          this.url1 = this.gameConfig.cardCover;
        }
        else{
          this.url1 = this.urlFilesSplitted[id];
        }
        break;
      case 1:
      if (reset){
        this.url2 = this.gameConfig.cardCover;
      }
      else{
        this.url2 = this.urlFilesSplitted[id];
      }
      break;
      case 2:
      if (reset){
        this.url3 = this.gameConfig.cardCover;
      }
      else{
        this.url3 = this.urlFilesSplitted[id];
      }
      break;
      case 3:
      if (reset){
        this.url4 = this.gameConfig.cardCover;
      }
      else{
        this.url4 = this.urlFilesSplitted[id];
      }
      break;
      case 4:
      if (reset){
        this.url6 = this.gameConfig.cardCover;
      }
      else{
        this.url6 = this.urlFilesSplitted[id];
      }
      break;
      case 5:
      if (reset){
        this.url7 = this.gameConfig.cardCover;
      }
      else{
        this.url7 = this.urlFilesSplitted[id];
      }
      break;
      case 6:
      if (reset){
        this.url9 = this.gameConfig.cardCover;
      }
      else{
        this.url9 = this.urlFilesSplitted[id];
      }
      break;
      case 7:
      if (reset){
        this.url10 = this.gameConfig.cardCover;
      }
      else{
        this.url10 = this.urlFilesSplitted[id];
      }
      break;
      case 8:
      if (reset){
        this.url11 = this.gameConfig.cardCover;
      }
      else{
        this.url11 = this.urlFilesSplitted[id];
      }
      break;
      case 9:
      if (reset){
        this.url12 = this.gameConfig.cardCover;
      }
      else{
        this.url12 = this.urlFilesSplitted[id];
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
        console.log("guardo el id");
        this.checkCardsNext = true;
        this.cardCheck1 = this.randomCards[id]._id;
        this.cardCheck2 = id;

        this.changeUrl(id,false);




      }else{
        console.log("carta ya validada");
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
      //En el caso de que no se haya compeltado procedemos a comprobar si es la msima carta
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
            console.log("son la misma");
            console.log(this.correctIDs.length);
            this.changeUrl(id,false);
            this._gameplayService.successSound();

            this._gameplayService.incrementScore();
            this.userScore = this._gameplayService.getActualScore();
            if(this.counter==5){
              if(this.jokerMultiWastedHere){
                this._dataService.setNewSuccessPoints(true, 0);
              }
              setTimeout(()=>{
                this._gameplayService.changeStageSound();

                this.router.navigate(["stage6"]);
              },1000);
            }
          }else if (this.gamemode==1){
            this.correctIDs.push(this.cardCheck1);
            this.counter++;
            console.log("son la misma");
            console.log(this.correctIDs.length);
            this.changeUrl(id,false);
            this._gameplayService.successSound();
            if(this.counter==5){
              this._gameplayService.changeStageSound();
              setTimeout(()=>{
                this.router.navigate(["stage6"]);
              },1000);
            }
          }
          
          
        }else{
          if(this.gamemode==0){
            this.changeUrl(id,false);
              console.log(this.correctIDs.length);
              console.log("no son la misma");
              this._gameplayService.looseSound();
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
        console.log("carta ya validada");
      }


      

    }
    
    //this.router.navigate(["stage2"]);
  }

/*
  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    console.log("dentro del shuffle");
    console.log(array);
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    console.log(array);
    return array;
  }
  */

  /*
  avanzar(){
    
    this.router.navigate(['/stage1']);
  }
  */

}

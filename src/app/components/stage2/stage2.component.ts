import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

import { Card } from '../../interfaces/Card';
import { Collection } from '../../interfaces/Collection';
import { Configuration } from '../../interfaces/Configuration';

import { ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-stage2',
  templateUrl: './stage2.component.html',
  styleUrls: ['./stage2.component.scss']
})
export class Stage2Component implements OnInit {
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

  constructor(private _dataService: DataService, private router:Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

      //Sacamos la invitación y la validaciónn de los parametros que le llegan, si no llega nada redirigimos a la pagina error
      this.activatedRoute.queryParams.subscribe(params =>{
        localStorage.setItem('invitation', null);
        this.invitation = params["invitation"];
        localStorage.setItem('invitation', JSON.stringify({ invitation:this.invitation}));
        localStorage.setItem('validation', null);
        this.validation = params["validation"];
        localStorage.setItem('validation', JSON.stringify({ validation:this.validation}));
        //if(this.invitation!="" && this.validation!="" && typeof(params["invitation"]) != "undefined" && typeof(params["validation"]) != "undefined" ){
          //this.getPointsValue();
          this._dataService.getInfo().subscribe(response=>{
            this._dataService.addNewCardDisplayed();
            this._dataService.currentCardsDisplayed.subscribe(cardsDisplayed => this.cards = cardsDisplayed);
            this._dataService.gameConfiguration.subscribe(gameConfiguration => this.gameConfig = gameConfiguration);
            var arrayAux = this.cards.slice(0);
            var urlFiles: string;
            var iniLength = arrayAux.length;
            for (let i=0; i<iniLength;i++){
              var rand = Math.floor(Math.random() * arrayAux.length);
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

        
            var urlFilesSplitted = urlFiles.split(',');
            //for (let i=0; i<urlFilesSplitted.length;i++){
            //}
            this.url1 = '../../../assets/dorsoTransparente.png';
            this.url2 = urlFilesSplitted[0];
            this.url3 = '../../../assets/dorsoTransparente.png';
            this.url4 = '../../../assets/dorsoTransparente.png';
            this.url5 = urlFilesSplitted[1];
            this.url6 = '../../../assets/dorsoTransparente.png';
            this.url7 = urlFilesSplitted[2];
            this.url8 = '../../../assets/dorsoTransparente.png';
            this.url9 = '../../../assets/dorsoTransparente.png';
            this.url10 = urlFilesSplitted[3];
            this.url11 = '../../../assets/dorsoTransparente.png';
            this.url12 = '../../../assets/dorsoTransparente.png';
            
      
            console.log("cartas en el stage 1 "  + this.cards.length);
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
      
            
          });
      //}else{
      //  this.router.navigate(["error"]);
      //}
     });


    
    /*
      this._dataService.getPointsValue().subscribe(
         data => { console.log(data)},
         err => console.error(err)
       );
    
    */
    
    
  
  
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

  sawCard(id){
    this.router.navigate(["stage3"]);
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

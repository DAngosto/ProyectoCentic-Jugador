import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { Card } from '../interfaces/Card';
import { Collection } from '../interfaces/Collection';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Configuration } from '../interfaces/Configuration';

import { ErrorService } from '../services/error.service';

import { ActivatedRoute, Router} from '@angular/router';




 
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class DataService {

    //cards: string;
    //private messageSource = new BehaviorSubject<Card>(this.card);
    //currentCardUpdating = this.messageSource.asObservable();

    info: any;
    items: any;
    collections: Collection[] = [];
    allCards: Card[] = [];
    cards: Card[] = [];
    cardsCover: string = "";

    cardsDisplayed: Card[] = [];
    private messageSource = new BehaviorSubject<Card[]>(this.cardsDisplayed);
    currentCardsDisplayed = this.messageSource.asObservable();

    configuration: Configuration;
    private messageSource2 = new BehaviorSubject<Configuration>(this.configuration);
    gameConfiguration = this.messageSource2.asObservable();

    

    
 
    constructor(private http:HttpClient, private _errorService: ErrorService, private router:Router) {}
 

    getPointsValue() {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let invitation= localStorage.getItem('invitation');
        let invitationParsed= JSON.parse(invitation);
        return this.http.get('https://gameserver.centic.ovh/games/info/9f6c9e4e-471c-11e8-a9f8-005056992599', { headers: headers});
    }

    

    givePointsuser(points) {

        
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let invitation= localStorage.getItem('invitation');
        let invitationParsed= JSON.parse(invitation).invitation;
        let validation= localStorage.getItem('validation');
        let validationParsed= JSON.parse(validation).validation;

        console.log(invitationParsed);
        console.log(validationParsed);

        let message = {
          "validation": validationParsed,
          "invitation":invitationParsed,
          "percent": points,
          "title": "Puntos ganados",
          "resume": "Has ganado puntos con el juego",
          "message": "Como has jugado al juego dle TCM has recibido puntos por ello"
        }
      /*
     let message = {
        "validation": "ec08356e-577b-11e8-a9f8-005056992599",
        "invitation": "9f6c9e4e-471c-11e8-a9f8-005056992599",
        
        "percent": points,
        "title": "Puntos ganados",
        "resume": "Has ganado puntos con el juego",
        "message": "Como has jugado al juego dle TCM has recibido puntos por ello"
      }
      */
      


      let body= JSON.stringify(message);
      console.log("envio puntos");
      return this.http.post('https://gameserver.centic.ovh/games/send_points',body, { headers: headers});
    }

    

    getInfo(){
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json');
        let headers2 = new Headers();
        headers2.append('Content-Type', 'application/json');
        return this.http.get('https://gameserver.centic.ovh/games/info/9f6c9e4e-471c-11e8-a9f8-005056992599', { headers: headers }).map((response: Response)=>{
            /*
            console.log("en el servicio");
            console.log(response);
            console.log(response['config']['cardCover']);
            */
           this.items = response['items'];
           console.log(this.items.length);
           for(let i=0;i<this.items.length;i++){
                if (this.items[i].itemType=="0"){
                    this.allCards.push(this.items[i]);
                }
                else{
                    this.collections.push(this.items[i]);
                }
            }
            
            localStorage.setItem("dataPoints", response['data']['points']);
            this.messageSource2.next(response['config']);

            //Buscamos si está publish true la coleccion solciitada, en casod e estarlo se conjtinua normalmente y en su defecto se redirige a la ventana de error con su mensaje correspondiente
            var collection = localStorage.getItem('collection');
            let collectionParsed= JSON.parse(collection).collection;
            var wantedCollection: Collection;
            var collectionFound: boolean = false;
            for(let i=0;i<this.collections.length;i++){
                if(this.collections[i]._id==collectionParsed){
                    wantedCollection = this.collections[i];
                    collectionFound = true;
                    break;
                }
            }

            if(collectionFound){

                if(wantedCollection.gamemode==0){
                    console.log("arcade");
                    localStorage.setItem("gamemode", "0");
                    localStorage.setItem("successpoints", this.messageSource2.value['arcadesuccesspoints']);
                    localStorage.setItem("failpoints", this.messageSource2.value['arcadefailpoints']);
                }
                else if(wantedCollection.gamemode==1){
                    console.log("survival");
                    localStorage.setItem("gamemode", "1");
                    /*
                    localStorage.setItem("successpoints", this.messageSource2.value['survivalsuccesspoints']);
                    localStorage.setItem("failpoints", this.messageSource2.value['survivalfailpoints']);
                    */
                    localStorage.setItem("survivallives", this.messageSource2.value['survivallives']);
                }
    
                var cardsCollection = wantedCollection.cards.split(',');
                for(let i=0;i<cardsCollection.length;i++){
                    for(let j=0;j<this.allCards.length;j++){
                        if (cardsCollection[i]==this.allCards[j]._id){
                            this.cards.push(this.allCards[j]);
                        }
                    }
                }
                if (this.cards.length!=6){
                    this._errorService.setError("La colección que usted está intentando jugar no posee 6 cartas jugables y por lo tanto no está permitido jugarla.");
                    this.router.navigate(["error"]);
                }

                
        

                localStorage.setItem("collectionid",wantedCollection._id.toString());
                localStorage.setItem("collectionname",wantedCollection.name.toString());


            }
            else{
                this._errorService.setError("La colección que usted está intentando jugar no está disponible en estos momentos.");
                this.router.navigate(["error"]);
            }



            


            return response;
          });
    }

    updateStadistics(gamemode,score,fails,lives){
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json');
        let invitation= localStorage.getItem('invitation');
        let invitationParsed= JSON.parse(invitation).invitation;
        var collectionID =  localStorage.getItem("collectionid");
        var collectionName =  localStorage.getItem("collectionname");
        var today = new Date().toJSON().slice(0,10);
        var jokerMultiWasted:boolean = false;
        var jokerVolteoWasted:boolean = false;
        if(Number(localStorage.getItem('comodinMulti'))==0){
            jokerMultiWasted = true;
        }
        if(Number(localStorage.getItem('comodinVolteo'))==0){
            jokerVolteoWasted = true;
        }
        var message;
        if(gamemode==0){
            message = {
                "idCollection": collectionID,
                "nameCollection": collectionName,
                "gamemode": gamemode,
                "userScore" : score,
                "userFails": fails,
                "jokermultiwasted": jokerMultiWasted,
                "jokervolteowasted": jokerVolteoWasted,
                "date": today.toString(),
                "itemType": "2",
            }

        }
        else if(gamemode==1){
            message = {
                "idCollection": collectionID,
                "nameCollection": collectionName,
                "gamemode": gamemode,
                "userLives" : lives,
                "date": today.toString(),
                "itemType": "2",
            }
        }
        let body= JSON.stringify(message);
        return this.http.put('https://gameserver.centic.ovh/games/items/' + invitationParsed,body, { headers: headers });

    }


    /*
    setConfig(cardCover){
        var configAux: Configuration = {cardCover};
        return configAux;
    }
    */

    

    setNewSuccessPoints(reset, value){
        if (reset){
            console.log("valor del successpoints antes: " + Number(localStorage.getItem("successpoints")));

            var aux = Number(localStorage.getItem("successpoints")) - (Number(localStorage.getItem("successpoints"))/2);
            localStorage.setItem("successpoints", aux.toString());
            console.log("valor del successpoints despues: " + aux);
        }
        else{
            console.log("value recibido en el servicio" + value);
            localStorage.setItem("successpoints", value);
        }
    }

    addNewCardDisplayed(): Card{
        var rand = Math.floor(Math.random() * this.cards.length);
        var cardAux = this.cards[rand];
        this.cards.splice(rand,1);

        this.cardsDisplayed.push(cardAux);
        this.cardsDisplayed.push(cardAux);
        return cardAux;
    }

    /*
    randomizeCards(){
        this.shuffle(this.cardsDisplayed);
    }

    
    shuffle(arrayAux) {
        var array = arrayAux;
        console.log(array);
        var currentIndex = array.length, temporaryValue, randomIndex;
    
        //console.log("dentro del shuffle");
        //console.log(array);
      
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
        //console.log(array);
        return array;
      }
      */

    

}// END OF DATA SERVICE
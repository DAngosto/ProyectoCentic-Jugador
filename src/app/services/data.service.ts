import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { Card } from '../interfaces/Card';
import { Collection } from '../interfaces/Collection';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Configuration } from '../interfaces/Configuration';


 
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

    
 
    constructor(private http:HttpClient) {}
 

    getPointsValue() {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let invitation= localStorage.getItem('invitation');
        let invitationParsed= JSON.parse(invitation);
        return this.http.get('https://gameserver.centic.ovh/games/info/9f6c9e4e-471c-11e8-a9f8-005056992599', { headers: headers});
    }

    

    givePointsuser(points) {

        
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let invitation= localStorage.getItem('invitation');
        let invitationParsed= JSON.parse(invitation);
        let validation= localStorage.getItem('validation');
        let validationParsed= JSON.parse(validation);
        let message = {
          "validation": validationParsed.validation,
          "invitation":invitationParsed.invitation,
          "percent": points,
          "title": "Puntos ganados",
          "resume": "Has ganado puntos con el juego",
          "message": "Como has jugado al juego dle TCM has recibido puntos por ello"
      }
      let body= JSON.stringify(message);
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
            
            this.messageSource2.next(response['config']);

            //En vez de coger el 0 sería aquella coleccion que pasen por parametros
            var cardsCollection = this.collections[0].cards.split(',');
            for(let i=0;i<cardsCollection.length;i++){
                for(let j=0;j<this.allCards.length;j++){
                    if (cardsCollection[i]==this.allCards[j]._id){
                        this.cards.push(this.allCards[j]);
                    }
                }
            }
            if (this.cards.length!=6){
                    console.log("no se han encontrado las 6 cartas de la coleccion en el get info");
            }
            else{
                console.log("Se han encontrado las 6 cartas de la coleccion en el get info");
            }


            return response;
          });
    }

    /*
    setConfig(cardCover){
        var configAux: Configuration = {cardCover};
        return configAux;
    }
    */

    addNewCardDisplayed(){
        var rand = Math.floor(Math.random() * this.cards.length);
        var cardAux = this.cards[rand];
        this.cards.splice(rand,1);

        this.cardsDisplayed.push(cardAux);
        this.cardsDisplayed.push(cardAux);
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
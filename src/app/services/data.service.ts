//modules
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute, Router} from '@angular/router';

//SERVICES
import { ErrorService } from '../services/error.service';

//INTERFACES
import { Card } from '../interfaces/Card';
import { Collection } from '../interfaces/Collection';
import { Configuration } from '../interfaces/Configuration';

//SETTINGS
import { AppSettings } from '../appSettings';
 
@Injectable()
export class DataService {

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
 
    /*
    EN:Function in charge of obtaining the points value assigned in the API.
    ES:Función encargada de obtener el valor points asignado en la API.
    */
    getPointsValue() {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let invitation= localStorage.getItem('invitation');
        let invitationParsed= JSON.parse(invitation).invitation;
        return this.http.get(AppSettings.API_ENDPOINT_INFO + invitationParsed, { headers: headers});
    }

    /*
    EN:Function in charge of delivering the points assigned to the player for the game played in the API.
    ES:Función encargada de entregar los puntos asignados al jugador por la partida realizada en la API.
    */
    givePointsuser(points) {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let invitation= localStorage.getItem('invitation');
        let invitationParsed= JSON.parse(invitation).invitation;
        let validation= localStorage.getItem('validation');
        let validationParsed= JSON.parse(validation).validation;
        let message = {
          "validation": validationParsed,
          "invitation":invitationParsed,
          "percent": points,
          "title": "Puntos ganados",
          "resume": "Has ganado puntos con el juego",
          "message": "Como has jugado al juego dle TCM has recibido puntos por ello"
        }
        let body= JSON.stringify(message);
        return this.http.post(AppSettings.API_ENDPOINT_SENDPOINTS,body, { headers: headers});
    }

    /*
    EN:Function in charge of obtaining the necessary information to be able to perform the game of the player from the API.
    ES:Función encargada de obtener la información necesaria para poder realizar la partida del jugador de la API.
    */
    getInfo(){
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json');
        let headers2 = new Headers();
        headers2.append('Content-Type', 'application/json');
        let invitation= localStorage.getItem('invitation');
        let invitationParsed= JSON.parse(invitation).invitation;
        return this.http.get(AppSettings.API_ENDPOINT_INFO + invitationParsed, { headers: headers }).map((response: Response)=>{
           this.items = response['items'];
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
                    localStorage.setItem("gamemode", "0");
                    localStorage.setItem("successpoints", this.messageSource2.value['arcadesuccesspoints']);
                    localStorage.setItem("failpoints", this.messageSource2.value['arcadefailpoints']);
                }else if(wantedCollection.gamemode==1){
                    localStorage.setItem("gamemode", "1");
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
            }else{
                this._errorService.setError("La colección que usted está intentando jugar no está disponible en estos momentos.");
                this.router.navigate(["error"]);
            }
            return response;
        });
    }

    /*
    EN:Function in charge of sending the statistics of the player's game to the API.
    ES:Función encargada de enviar las estadísiticas de la partida del jugador a la API.
    */
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
        var initLives = Number(localStorage.getItem("survivallives"));
        if(Number(localStorage.getItem('comodinMulti'))==0){
            jokerMultiWasted = true;
        }
        if(Number(localStorage.getItem('comodinVolteo'))==0){
            jokerVolteoWasted = true;
        }
        var message;
        if(gamemode==0){
            message = {
                "collectionID": collectionID,
                "collectionName": collectionName,
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
                "collectionID": collectionID,
                "collectionName": collectionName,
                "gamemode": gamemode,
                "userLives" : lives,
                "initLives": initLives,
                "date": today.toString(),
                "itemType": "2",
            }
        }
        let body= JSON.stringify(message);
        return this.http.put(AppSettings.API_ENDPOINT_GAMEITEMS + invitationParsed,body, { headers: headers });
    }

    /*
    EN:Function in charge of modifying the value of the points by success due to the use of the multiplier joker.
    ES:Función encargada de modificar el valor de los puntos por acierto debido al uso del comodín multiplicador.
    */
    setNewSuccessPoints(reset, value){
        if (reset){
            var aux = Number(localStorage.getItem("successpoints")) - (Number(localStorage.getItem("successpoints"))/2);
            localStorage.setItem("successpoints", aux.toString());
        }else{
            localStorage.setItem("successpoints", value);
        }
    }

    /*
    EN:Function in charge of adding a new card from the general collection to the player's collection in the current phase.
    ES:Función encargada de añadir una nueva carta de la colección general a la colección del jugador en la fase actual.
    */
    addNewCardDisplayed(): Card{
        var rand = Math.floor(Math.random() * this.cards.length);
        var cardAux = this.cards[rand];
        this.cards.splice(rand,1);
        this.cardsDisplayed.push(cardAux);
        this.cardsDisplayed.push(cardAux);
        return cardAux;
    }

}// END OF SERVICE DataService
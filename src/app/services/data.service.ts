import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
 
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class DataService {
 
    constructor(private http:HttpClient) {}
 

    getPointsValue() {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let invitation= localStorage.getItem('invitation');
        let invitationParsed= JSON.parse(invitation);
        return this.http.get('https://gameserver.centic.ovh/games/info/' + +invitationParsed.invitation, { headers: headers});
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

}// END OF DATA SERVICE
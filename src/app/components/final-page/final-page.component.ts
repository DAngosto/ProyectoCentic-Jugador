//MODULES
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { map } from 'rxjs/operators';

//SERVICES
import { GameplayService } from '../../services/gameplay.service';
import { DataService } from '../../services/data.service';
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-final-page',
  templateUrl: './final-page.component.html',
  styleUrls: ['./final-page.component.scss']
})

export class FinalPageComponent implements OnInit {

  gamemode:number;
  userScore:number;
  userFails:number;
  userLives:number;
  tittle:string;
  encouragingMessage:string;
  gameRanking:string;
  gameScore:string;
  generalRanking:string;
  generalScore:string;
  pointsTogive:number = 0;
  selectedMessage:number = 0;

  //Alarm Conditions
  arcadeMode:boolean;
  survivalMode:boolean;

  constructor(private _gameplayService: GameplayService,private _dataService: DataService, private _errorService: ErrorService, private router:Router) { }

  ngOnInit() {
    this.gamemode = Number(localStorage.getItem("gamemode"));
    if(this.gamemode==0){
      this.arcadeMode=true;
      this.survivalMode=false;
      this.userScore = this._gameplayService.getActualScore();
      this.userFails = this._gameplayService.getActualFails();
      this.pointsTogive = this.calculationOfPointsToBeAwarded(0);
      this.finalScreenPreparation();
      this._dataService.givePointsuser(this.pointsTogive).subscribe(data=>{
        if(data["Error"]=="5002"){
          this._errorService.setError("La invitación con la que inició el juego ya ha sido usada.");
          this.router.navigate(["error"]);
        }else if(data["Error"]=="3008"){
          this._errorService.setError("Has jugado recientemente esta colección y por lo tanto es necesario que esperes un poco mas. Aguanta que falta ya poco :)");
          this.router.navigate(["error"]);
        }else if(data["Error"]=="3012"){
          this._errorService.setError("Has jugado todas las veces posibles. Lo siento pero esta partida no contará para tus estadísticas :(");
          this.router.navigate(["error"]);
        }else{
          this._gameplayService.finalSound();
          this.gameRanking = "Ranking en el juego: " + data['match_ranking'] +"º";
          this.gameScore = "Puntuación del juego: "+ data['match_score'] +" puntos";
          this.generalRanking = "Ranking en la aplicación del Centic: "+ data['session_ranking'] +"º";
          this.generalScore = "Puntuación general: " + data['session_score'] +" puntos";
          this._dataService.updateStadistics(0,this.userScore,this.userFails,0).subscribe(data=>{
          });
        }
      });
    }else if(this.gamemode==1){
      this.arcadeMode=false;
      this.survivalMode=true;
      this.userLives = this._gameplayService.getActualLives();
      this.pointsTogive = this.calculationOfPointsToBeAwarded(1);
      this.finalScreenPreparation();
      this._dataService.givePointsuser(this.pointsTogive).subscribe(data=>{
        if(data["Error"]=="5002"){
          this._errorService.setError("La invitación con la que inició el juego ya ha sido usada o el código de verificación es erroneo.");
          this.router.navigate(["error"]);
        }else if(data["Error"]=="3008"){
          this._errorService.setError("Has jugado recientemente esta colección y por lo tanto es necesario que esperes un poco mas. Aguanta que falta ya poco :)");
          this.router.navigate(["error"]);
        }else if(data["Error"]=="3012"){
          this._errorService.setError("Has jugado todas las veces posibles. Lo siento pero esta partida no contará para tus estadísticas :(");
          this.router.navigate(["error"]);
        }else{
          this._gameplayService.finalSound();
          this.gameRanking = "Ranking en el juego: " + data['match_ranking'] +"º";
          this.gameScore = "Puntuación del juego: "+ data['match_score'] +" puntos";
          this.generalRanking = "Ranking en la aplicación del Centic: "+ data['session_ranking'] +"º";
          this.generalScore = "Puntuación general: " + data['session_score'] +" puntos";
          this._dataService.updateStadistics(1,0,0,this.userLives).subscribe(data=>{
          });
        }
      });
    }
  }

  finalScreenPreparation(){
    switch(this.selectedMessage){
      case 0:
            this.tittle = "Bueno...";
            this.encouragingMessage = "¿Quiéres que te ayude a levantarte?";
            break;
      case 1:
            if(this.gamemode==0){
              this.tittle = "¡Podría haber sido peor!";
              this.encouragingMessage = "Intenta aprender de tus errores y reventar el score la próxima partida";
            }else{
              this.tittle = "¡Podría haber sido peor!";
              this.encouragingMessage = "¡Intenta aprender de tus errores y no fallar tanto con la misma carta!";
            }
            break;
      case 2:
            this.tittle = "¡Felicidades!";
            this.encouragingMessage = "Estás dentro de la media, sigue jugando y llegarás alto";
            break;
      case 3:
            this.tittle = "¡Esto si que no me lo esperaba!";
            this.encouragingMessage = "Te veo potencial joven padawan, estuviste cerca de tocar el cielo";
            break;
      case 4:
            this.tittle = "¡WOW! Eres increiblemente bueno";
            this.encouragingMessage = "Me has dejado sin palabras, ¡eres la leche! б（＞ε＜）∂";
            break;
      default:
            this.tittle = "Error";
            this.encouragingMessage = "Ocurrio un error al hacer el recuento de puntos. Lo sentimos";
            break;
    }
  }

  calculationOfPointsToBeAwarded(gamemode):number{
    var iniPoints = Number(localStorage.getItem("dataPoints"));
    //Establecemos los limites de puntuaciones
    var tenPercent = Math.round((10 * iniPoints)/100);
    var thirtyPercent = Math.round((30 * iniPoints)/100);
    var fiftyPercent = Math.round((50 * iniPoints)/100);
    var seventyPercent = Math.round((70 * iniPoints)/100);
    if(gamemode==0){
      if(this.userScore<(5*iniPoints)){
        this.selectedMessage = 0;
        return tenPercent;
      }else if ((this.userScore>=(5*iniPoints)) && (this.userScore<(10*iniPoints)) ){
        this.selectedMessage = 1;
        return thirtyPercent;
      }else if ((this.userScore>=(10*iniPoints)) && (this.userScore<(15*iniPoints)) ){
        this.selectedMessage = 2;
        return fiftyPercent;
      }else if ((this.userScore>=(15*iniPoints)) && (this.userScore<(20*iniPoints)) ){ 
        this.selectedMessage = 3;
        return seventyPercent;
      }else if ((this.userScore>=(20*iniPoints))){
        this.selectedMessage = 4;
        return iniPoints;
      }
      //1 + 2 + 3 + 4 + 5 + 6 = 21 * points sería una partida perfecta sin usar comodin x2. Debido a que existe este comodin le sumamos a ese resultado unos 200 puntos
      //21/4 = 5,25
    }else if(gamemode==1){
      var iniLives = Number(localStorage.getItem("survivallives"));
      //Establecemos los limites de puntuaciones
      var twentyPercentLives = Math.round((20 * iniLives)/100);
      var fourtyPercentLives = Math.round((40 * iniLives)/100);
      var sixtyPercentLives = Math.round((60 * iniLives)/100);
      var eightyPercentLives = Math.round((80 * iniLives)/100);
      //habra un minimo de 5 vidas siempre para que asi podamos dividir los puntos ya que sino sería imposible
      if(this.userLives<twentyPercentLives){
        this.selectedMessage = 0;
        return tenPercent;
      }else if ((this.userLives>=twentyPercentLives) && (this.userLives<fourtyPercentLives) ){
        this.selectedMessage = 1;
        return thirtyPercent;
      }else if ((this.userLives>=fourtyPercentLives) && (this.userLives<sixtyPercentLives) ){
        this.selectedMessage = 2;
        return fiftyPercent;
      }else if ((this.userLives>=sixtyPercentLives) && (this.userLives<eightyPercentLives) ){ 
        this.selectedMessage = 3;
        return seventyPercent;
      }else if ((this.userLives>=eightyPercentLives)){
        this.selectedMessage = 4;
        return iniPoints;
      }      
    }else{
      return iniPoints;
    }
  }

}/// END OF COMPONENT FinalPageComponent ///

//MODULES
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';

//SERVICES
import {DataService} from '../../services/data.service';
import { ErrorService } from '../../services/error.service';

//SETTINGS
import { AppSettings } from '../../appSettings';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: []
  
})

export class HomeComponent implements OnInit {

  puntos?:any = 0;
  invitation:string = "";
  validation:string = "";
  collection:string = "";
  gamemode;
  arcade:boolean;
  survival:boolean;
  gamemodeTittle:string;
  gameplayTutorial:string;

  constructor(private _dataService: DataService, private router:Router, private activatedRoute: ActivatedRoute, private _errorService: ErrorService) {
  }  

  ngOnInit() { 
    this.activatedRoute.queryParams.subscribe(params =>{
      localStorage.setItem('invitation', null);
      this.invitation = params["invitation"];
      localStorage.setItem('invitation', JSON.stringify({ invitation:this.invitation}));
      localStorage.setItem('validation', null);
      this.validation = params["validation"];
      localStorage.setItem('validation', JSON.stringify({ validation:this.validation}));
      localStorage.setItem('collection', null);
      this.collection = params["collection"];
      localStorage.setItem('collection', JSON.stringify({ collection:this.collection}));
      if(this.invitation!="" && this.validation!="" && typeof(params["invitation"]) != "undefined" && typeof(params["validation"]) != "undefined" ){
        this.getPointsValue();
        this._dataService.getInfo().subscribe(response=>{
          this.gamemode = Number(localStorage.getItem("gamemode"));
          if(this.gamemode==0){
            this.arcade = true;
            this.survival = false;
            this.gamemodeTittle = "Arcade";
            this.gameplayTutorial = AppSettings.TUTORIAL_ARCADE;
          }else if(this.gamemode==1){
            this.survival = true;
            this.arcade = false;
            this.gamemodeTittle = "Survival";
            this.gameplayTutorial = AppSettings.TUTORIAL_SURVIVAL;
          }
        });
      }else{
        this._errorService.setError("En la url falta el parámetro validation o invitation.");
        this.router.navigate(["error"], {replaceUrl:true});
      }
    });
   } 

  getPointsValue() {
    this._dataService.getPointsValue().subscribe(data => {
      this.puntos = data;
      },
      err => console.error(err)
    );
  }

  givePointsToUser(points) {
    this._dataService.givePointsuser(points).subscribe(data => {
             return true;
           },
           error => {
             return Observable.throw(error);
           }    
    );
  }

  /*
  EN:Function in charge of redirecting the player to the first phase of the game.
  ES:Función encargada de redirigir al jugador a la primera fase del juego.
  */
  startGame(){
    this.router.navigate(["stage1"], {replaceUrl:true});
  }

}/// END OF COMPONENT HomeComponent ///

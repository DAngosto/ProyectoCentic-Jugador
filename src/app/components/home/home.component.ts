import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {Observable} from 'rxjs/Rx';
import { AppSettings } from '../../appSettings';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: []
  
})
export class HomeComponent implements OnInit {

  private swapAnimations : boolean = false;
  private hideAnimation : boolean = false;
  public puntos?:any = 0;


  invitation:string = "";
  validation:string = "";
  collection:string = "";

  titulo:string="ucam2";
  gamemode;

  arcade:boolean;
  survival:boolean;
  gamemodeTittle:string;

  gameplayTutorial:string;

  constructor(private _dataService: DataService, private router:Router, private activatedRoute: ActivatedRoute) {
      //Sacamos la invitación y la validaciónn de los parametros que le llegan, si no llega nada redirigimos a la pagina error
      this.activatedRoute.queryParams.subscribe(params =>{
        
        localStorage.setItem('invitation', null);
        this.invitation = params["invitation"];
        console.log(this.invitation);
        localStorage.setItem('invitation', JSON.stringify({ invitation:this.invitation}));


        //localStorage.setItem('invitation', this.invitation);

        localStorage.setItem('validation', null);

        this.validation = params["validation"];
        console.log(this.validation);
        localStorage.setItem('validation', JSON.stringify({ validation:this.validation}));

        
        localStorage.setItem('collection', null);
        this.collection = params["collection"];
        console.log(this.collection);
        localStorage.setItem('collection', JSON.stringify({ collection:this.collection}));
        //localStorage.setItem('validation', this.validation);

        

        

        //if(this.invitation!="" && this.validation!="" && typeof(params["invitation"]) != "undefined" && typeof(params["validation"]) != "undefined" ){
          this.getPointsValue();


          /*
          let invitation2= localStorage.getItem('invitation');
          console.log(JSON.parse(invitation2));
          let validation2= localStorage.getItem('validation');
          console.log(JSON.parse(validation2));

          console.log('"validation":' +  JSON.parse(validation2).validation);
        */
       this._dataService.getInfo().subscribe(response=>{
        console.log(this.gamemode);
        this.gamemode = Number(localStorage.getItem("gamemode"));
        if(this.gamemode==0){
          this.arcade = true;
          this.survival = false;
          this.gamemodeTittle = "Arcade";
          this.gameplayTutorial = AppSettings.TUTORIAL_ARCADE;

        }
        else if(this.gamemode==1){
          this.survival = true;
          this.arcade = false;
          this.gamemodeTittle = "Survival";
          this.gameplayTutorial = AppSettings.TUTORIAL_SURVIVAL;
        }
        });
      //}else{
        //this.router.navigate(["error"]);
      //}
     });

     /*
     this._dataService.givePointsuser(20).subscribe(
      data => { this.puntos = data; console.log(data)},
      err => console.error(err)
    );
    */
  
    
   }  


   final(){
    this.router.navigate(["final"]);
   }

   ngOnInit(): void { 
     //this.getPointsValue();
   } 

   sawConfirmation(){
    this.swapAnimations = true;
    this.hideAnimation = true;
    setTimeout(() => {
      this.swapAnimations = false;
      this.hideAnimation = false;
    }, 1600)
  }

  getPointsValue() {
    this._dataService.getPointsValue().subscribe(
       data => { this.puntos = data; console.log(data)},
       err => console.error(err)
     );
  }

  givePointsToUser(points) {
    this._dataService.givePointsuser(points).subscribe(
        data => {
             this.getPointsValue();
             return true;
           },
           error => {
             console.error("Error saving the user who wanted free points!");
             return Observable.throw(error);
           }
    );
    this.sawConfirmation();
  }

  startGame(){
    this.router.navigate(["stage1"]);
  }



}// END OF HOME COMPONENT

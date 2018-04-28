import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

import { Card } from '../../interfaces/Card';
import { Collection } from '../../interfaces/Collection';
import { Configuration } from '../../interfaces/Configuration';

@Component({
  selector: 'app-stage1',
  templateUrl: './stage1.component.html',
  styleUrls: ['./stage1.component.css']
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

  cards: Card[] = [];
  gameConfig: Configuration;

  constructor(private _dataService: DataService) { }

  ngOnInit() {
    console.log("stage 1");
    console.log(this.cards.length);
    console.log(this.gameConfig);
    this.url5 = "https://gameserver.centic.ovh/files/1524860900077-DbN_V3aVMAIzrTf.jpg";
    this.url8 = "https://gameserver.centic.ovh/files/1524860900077-DbN_V3aVMAIzrTf.jpg";
    this._dataService.currentCardsDisplayed.subscribe(cardsDisplayed => this.cards = cardsDisplayed);
      this._dataService.gameConfiguration.subscribe(gameConfiguration => this.gameConfig = gameConfiguration);
      console.log(this.cards.length);
      console.log(this.gameConfig);
  }

}

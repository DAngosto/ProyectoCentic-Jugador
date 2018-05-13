import { Component, OnInit } from '@angular/core';
import { GameplayService } from '../../services/gameplay.service';

@Component({
  selector: 'app-final-page',
  templateUrl: './final-page.component.html',
  styleUrls: ['./final-page.component.scss']
})
export class FinalPageComponent implements OnInit {

  constructor(private _gameplayService: GameplayService) { }

  ngOnInit() {
    this._gameplayService.finalSound();

  }



}

//MODULES
import { Component, OnInit } from '@angular/core';

//SERVICES
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})

export class ErrorComponent implements OnInit {

  ocurredError: string;

  constructor(private _errorService: ErrorService) { }

  ngOnInit() {
    this._errorService.receivedError.subscribe(error => this.ocurredError = error);
  }

}/// END OF COMPONENT ErrorComponent ///

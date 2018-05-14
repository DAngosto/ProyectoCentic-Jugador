import { Component, OnInit } from '@angular/core';
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

      let invitation= localStorage.getItem('invitation');
        console.log(JSON.parse(invitation));
        let validation= localStorage.getItem('validation');
        console.log(JSON.parse(validation));
  }

}

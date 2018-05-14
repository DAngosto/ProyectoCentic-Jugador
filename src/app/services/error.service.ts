import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';



@Injectable()
export class ErrorService {

  error: string;
  private messageSource = new BehaviorSubject<string>(this.error);
  receivedError = this.messageSource.asObservable();

  constructor() { }




  getActualError(): string{
    return this.error;
  }


  setError(error: string){
    this.error = error;
    this.messageSource.next(error);
  }

}

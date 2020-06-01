import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AccountsService {
accountsListUrl = 'https://platform.ibanfirst.com/js/dataTestDevFront.json';
retrieveRateUrl = 'https://api.ibanfirst.com/PublicAPI/Rate/';

  constructor(private http: HttpClient) { }

  getAcountsList(): Observable<any>  {
    return this.http.get<any>(this.accountsListUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  convertToEuro(instrument) {
    return this.http.get<any>(this.retrieveRateUrl + instrument)
    .pipe(
      catchError(this.handleError)
    );
  }


  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
    // Get client-side error
    errorMessage = error.error.message;
    } else {
    // Get server-side error
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
    }
}

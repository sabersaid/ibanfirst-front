import { Component } from '@angular/core';
import {AccountsService} from 'src/app/services/accounts.service';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'ibanfirst-front';
  accountsList: any = [];
  isLoading = false;

  constructor(public AccountsService: AccountsService) {

  }

  ngOnInit() {
    this.getAccountsList();
    // this.getAccontsByCountry('BE');
    let svgMap = (document.getElementById('svg-map'))
    svgMap.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      console.log(target.id);
      this.getAccontsByCountry(target.id)
  })
  }

  getAccountsList() {
   this.isLoading = true;
   this.AccountsService.getAcountsList().subscribe(
     result => {
      this.accountsList = result.accounts;
      this.accountsList = this.AddsoldeInEuroField(this.accountsList);
      this.isLoading = false;
     },
     error => {
      console.log(error);
     }
   )
  }

   convertSoldToEuro(instrument) {
    const resultSubject = new ReplaySubject(1);
    this.isLoading = true;
    this.AccountsService.convertToEuro( 'EUR' + instrument).subscribe(
      result => {
        console.log('result', result);
        resultSubject.next(result.rate.rate);
        this.isLoading = false;
      },
      error => {
       console.log(error);
       return error;
      }
    );
    return resultSubject;
  }

  AddsoldeInEuroField(accountsList) {
    for (let index = 0; index < accountsList.length; index++) {

      const element = accountsList[index];
      if(element.currency !== 'EUR') {
      this.convertSoldToEuro(element.currency).subscribe(result => {
        const rate = Number(result);
        console.log('rate:', rate);
        element.soldeInEuro = element.amount / rate;
      });
    } else {
      element.soldeInEuro = element.amount;
    }
    }
    return accountsList;
  }


  getAccontsByCountry(country) {
    this.isLoading = true;
    this.AccountsService.getAcountsList().subscribe(
      result => {
       this.accountsList = result.accounts;
       this.accountsList = this.accountsList.filter(
        account => account.holderBank.address.country === country);
       this.accountsList = this.AddsoldeInEuroField(this.accountsList);
       this.isLoading = false;
      },
      error => {
       console.log(error);
      }
    );


  }

  reset(){ 
    
      this.getAccountsList()
  }

}

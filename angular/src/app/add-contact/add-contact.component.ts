
import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { AppStateService } from '../services/app-state.service';
import { ZendeskService } from '../services/zendesk.service';
// import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-add-contact',
  host: { class: 'app-add-contact' },
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddContactComponent {

  createForm: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    apiKEY: ['', Validators.required]
  });
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  context: any;

  constructor(
    private appStateService: AppStateService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private zendeskService: ZendeskService
  ) {
    this.zendeskService.context().pipe(
      tap(context => this.context = context),
    ).subscribe();
  }

  public createContact() {
    if (this.createForm.invalid) {
      this.zendeskService.showNotification('Form is not complete', 'alert');
      return;
    }
    const data = { ...this.createForm.value };
    data.subdomain = this.context.account.subdomain;
    // data.iv = this.makeid(16);
    // data.apiKEY = this.aesEncrypt(data.apiKEY, data.iv);

    // return;

    this.appStateService.startLoading('Sending info');

    this.http.post('https://hook.integromat.com/ofr0eejkr89t1x5j0akpv87uiduotk8i', data, { headers: this.headers, responseType: 'text' })
      .pipe(
        tap(() => this.zendeskService.showNotification('Account created or updated correctly!')),
        tap(() => this.appStateService.stopLoading()),
        catchError(
          err => {
            err = (err?.error?.errors && err.error.errors[0]?.message) || err;
            this.zendeskService.showNotification(err, 'error', { sticky: true });
            this.appStateService.stopLoading();
            return err;
          }
        ),
      ).subscribe();
  }

  // private aesEncrypt(data: string, iv: string) {
  //   const key = '10izM1LG7AVx8CF6QfvgVmMmCYJi8xdd';
  //   const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
  //     iv: CryptoJS.enc.Utf8.parse(iv)
  //   });

  //   return cipher.toString();
  // }

  // private aesDecrypt(data: string, iv: string) {
  //   const key = '10izM1LG7AVx8CF6QfvgVmMmCYJi8xdd';
  //   const cipher = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
  //     iv: CryptoJS.enc.Utf8.parse(iv)
  //   });

  //   return cipher.toString(CryptoJS.enc.Utf8);
  // }

  // private makeid(length: number) {
  //   const result = [];
  //   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   const charactersLength = characters.length;
  //   for (let i = 0; i < length; i++) {
  //     result.push(characters.charAt(Math.floor(Math.random() *
  //       charactersLength)));
  //   }
  //   return result.join('');
  // }
}


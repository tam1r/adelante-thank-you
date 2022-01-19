
import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { AppStateService } from '../services/app-state.service';
import { ZendeskService } from '../services/zendesk.service';
import locales from './locales';

interface Language {
  value: string;
  text: string;
}

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
    apiKEY: ['', Validators.required],
    language: ['', Validators.required],
    emailSubscription: [true],
  });
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  context: any;
  languages: Language[] = locales;
  subdomain = window.location.hostname.split('.')[0];
  isCreated = false;
  isLoading = true;
  isConnected = false;
  connectionErrorReason = '';

  constructor(
    private appStateService: AppStateService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private zendeskService: ZendeskService
  ) {
    this.zendeskService.context().pipe(
      tap(context => {
        this.context = context;
        const data = {
          subdomain: this.context.account.subdomain
        };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        this.http.post('https://hook.integromat.com/ilroyoo8vg38ol4rftdoifedllmsrl2b', data, { headers, responseType: 'text' })
          .pipe(
            tap((response) => {
              const result = JSON.parse(response)?.result;
              if (result === 'false') {
                this.isConnected = false;
                this.connectionErrorReason = JSON.parse(response)?.reason || 'unexpected error';
              } else if (result === 'true') {
                this.isConnected = true;
              }
              this.isLoading = false;
            }),
            catchError(
              err => {
                this.isLoading = false;
                err = (err?.error?.errors && err.error.errors[0]?.message) || err;
                return err;
              }
            ),
          ).subscribe();
      }),
    ).subscribe();
  }

  public createContact() {
    if (this.createForm.invalid) {
      this.zendeskService.showNotification('Form is not complete', 'alert');
      return;
    }
    const data = { ...this.createForm.value };
    data.subdomain = this.context.account.subdomain;

    this.appStateService.startLoading('Sending info');

    this.http.post('https://hook.integromat.com/ofr0eejkr89t1x5j0akpv87uiduotk8i', data, { headers: this.headers, responseType: 'text' })
      .pipe(
        tap(() => {
          this.createForm.reset();
          this.createForm.get('username')!.clearValidators();
          this.createForm.get('apiKEY')!.clearValidators();
          this.createForm.get('language')!.clearValidators();
          this.createForm.get('username')!.updateValueAndValidity();
          this.createForm.get('apiKEY')!.updateValueAndValidity();
          this.createForm.get('language')!.updateValueAndValidity();
        }),
        tap(() => this.isCreated = !this.isCreated),
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

  public showChangeSettings() {
    this.isCreated = false;
    this.isConnected = false;
  }

}


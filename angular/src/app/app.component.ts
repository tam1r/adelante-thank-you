import { Component } from '@angular/core';
import { AppView, AppViewLiteral } from './app.model';
import { tap } from 'rxjs/operators';
import { AppStateService } from './services/app-state.service';
import { ZendeskService } from './services/zendesk.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  state: AppViewLiteral | undefined;
  appView = AppView;
  toastService: any;

  constructor(
    private appStateService: AppStateService,
    private zendeskService: ZendeskService
  ) {
    this.zendeskService.init();
    this.appStateService.SetState(this.appView.addAccount);

    this.appStateService.appState.pipe(
      tap(state => this.state = state)
    ).subscribe();
  }

}

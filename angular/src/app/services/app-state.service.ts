import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppViewLiteral } from '../app.model';
import { LoaderComponent } from '../loader/loader.component';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  readonly appState: Subject<AppViewLiteral> = new Subject<AppViewLiteral>();
  private readonly loaderRef: OverlayRef;

  constructor(
    private overlay: Overlay,
  ) {
    this.loaderRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true
    });
  }

  /**
   * SetState
   */
  SetState(state: AppViewLiteral) {
    this.appState.next(state);
  }

  startLoading(msg: string) {
    LoaderComponent.msg = msg;
    this.loaderRef.attach(new ComponentPortal(LoaderComponent));
  }
  stopLoading() {
    this.loaderRef.detach();

  }

}

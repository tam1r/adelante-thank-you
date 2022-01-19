import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
declare let ZAFClient: any;

@Injectable({
  providedIn: 'root'
})
export class ZendeskService {

  records: any = {};
  client: any | undefined;

  constructor(
  ) {
  }

  init() {
    this.client = ZAFClient.init();
    this.client.on('app.willDestroy', () => { });
  }

  resize(size: any) {
    this.client.invoke('resize', size);
  }

  showNotification(msg: Error | any, type?: 'notice' | 'alert' | 'error', duration?: number | { sticky: boolean }) {
    let text = '';
    try {
      text = msg.message || msg.name || msg;
      this.client.invoke('notify', text, type, duration);
    } catch {
      this.client.invoke('notify', msg, type, duration);
    }
  }

  metadata(): Observable<any> {
    return from(this.client.metadata());
  }

  context(): Observable<{ location: string }> {
    return from(this.client.context()) as Observable<{ location: string }>;
  }

  get(path: string): Observable<any> {
    return from(this.client.get(path)).pipe(
      map((x: any) => x ? x[path] : x),
    );
  }

  set(path: string, value: string): Observable<any> {
    return from(this.client.set(path, value)).pipe(
      tap(() => this.records[path] = value)
    );
  }
}

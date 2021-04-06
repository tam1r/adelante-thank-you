import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html'
})
export class LoaderComponent implements OnInit {

  static msg: string | undefined;
  _msg: string | undefined;

  constructor(
  ) {
    this._msg = LoaderComponent.msg;
  }

  ngOnInit() {
  }
}

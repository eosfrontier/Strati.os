import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

  errorCode: string | number;

  constructor() { }

  // default error. Why define like this? For keeping options open for later.
  ngOnInit() {
    this.errorCode = 404;
  }

}

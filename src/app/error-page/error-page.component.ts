import { Component, OnInit } from '@angular/core';
import { faSatellite } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

  errorCode: string | number;
  faSatellite = faSatellite

  constructor() { }

  // default error. Why define like this? For keeping options open for later.
  ngOnInit() {
    this.errorCode = 404;
  }

}

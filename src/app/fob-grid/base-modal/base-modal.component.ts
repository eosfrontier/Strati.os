import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-base-modal',
  templateUrl: './base-modal.component.html',
  styleUrls: ['./base-modal.component.scss']
})
export class BaseModalComponent implements OnInit {
  @Input() fobData;

  constructor() { }

  ngOnInit() {
  }

}

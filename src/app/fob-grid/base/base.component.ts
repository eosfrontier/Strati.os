import { Component, OnInit, Input } from '@angular/core';
import { SupplyBreakpoints } from '../../shared/models/supplybreakpoints';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {
  @Input() fobData;
  supplyBreakpoints: SupplyBreakpoints;

  constructor() { }

  ngOnInit() {
    this.supplyBreakpoints = new SupplyBreakpoints();
  }

}

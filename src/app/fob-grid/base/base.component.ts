import { Component, OnInit, Input } from '@angular/core';
import { SupplyBreakpoints } from '../../shared/models/supplybreakpoints';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {
  @Input() fobData;
  supplyBreakpoints: SupplyBreakpoints;

  faMapMarkerAlt = faMapMarkerAlt

  constructor() { }

  ngOnInit() {
    this.supplyBreakpoints = new SupplyBreakpoints();
  }

}

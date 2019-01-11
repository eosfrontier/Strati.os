import { Component, OnInit } from '@angular/core';

import * as MockFobs from '../mockfobs';
import { Fob } from '../../shared/models/fob';

@Component({
  selector: 'app-fob-overview',
  templateUrl: './fob-overview.component.html',
  styleUrls: ['./fob-overview.component.scss']
})
export class FobOverviewComponent implements OnInit {

  fobList: Fob[];
  selectedFob: Fob;

  constructor() { }

  ngOnInit() {
    this.setFobList(MockFobs.MOCKFOBS);
  }

  private setFobList(list): void {
    console.log(list);
    this.fobList = list;
  }

  public openFobModal(selected: Fob): void {
    this.selectedFob = selected;
  }

  public closeFobModal(): void {
    this.selectedFob = null;
  }

}

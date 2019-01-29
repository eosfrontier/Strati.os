import { Pipe, PipeTransform } from '@angular/core';
import { SupplyBreakpoints } from '../models/supplybreakpoints';

@Pipe({
  name: 'supplyBreakpoint'
})
export class SupplyBreakpointPipe implements PipeTransform {

  supplyBreakpoints: SupplyBreakpoints;

  constructor() {
    this.supplyBreakpoints = new SupplyBreakpoints();
  }

  transform(value: any): any {
    if (value < this.supplyBreakpoints.medium) {
      return value + '% (!)';
    } else if (value >= this.supplyBreakpoints.medium && value < this.supplyBreakpoints.high) {
      return value + '%';
    } else {
      return value + '%';
    }
  }

}

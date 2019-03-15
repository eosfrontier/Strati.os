import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

  /**
 * @description utilities for validation
 */
  public displayFieldCss(field: any): {} {
    return { 'error': field.invalid && (field.touched || field.dirty) };
  }

  public isFieldValid(field: any): boolean {
    return !field.valid && field.touched;
  }

}

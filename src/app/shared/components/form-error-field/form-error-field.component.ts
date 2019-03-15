import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-form-error-field',
  templateUrl: './form-error-field.component.html',
  styleUrls: ['./form-error-field.component.scss']
})
export class FormErrorFieldComponent implements OnInit {

  @Input() errorMsg: string;
  @Input() displayError: boolean;

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ShuttleService } from '../../../shared/services/shuttle.service';
import { AdminMenuService } from '../../admin-menu.service';
import { ValidatorService } from '../../../shared/services/form/validator.service';

@Component({
  selector: 'app-shuttle-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class ShuttlesAddComponent implements OnInit, OnDestroy {

  shuttleForm: FormGroup;

  constructor(
    private shuttleService: ShuttleService,
    private adminRouter: AdminMenuService,
    private validator: ValidatorService
  ) { }

  ngOnInit() {
    this.shuttleForm = this.generateShuttleFormGroup();
  }

  fieldCss(field: any): {} {
    return this.validator.displayFieldCss(field);
  }

  isValid(field: any): boolean {
    return this.validator.isFieldValid(field);
  }

  get name() { return this.shuttleForm.controls.name; }
  get serial_number() { return this.shuttleForm.controls.serial_number; }
  get shuttleClass() { return this.shuttleForm.controls.class; }
  get type() { return this.shuttleForm.controls.type; }
  get capacity() { return this.shuttleForm.controls.capacity; }
  get base() { return this.shuttleForm.controls.base; }
  get state() { return this.shuttleForm.controls.state; }
  get status_name() { return this.shuttleForm.controls.status_name; }
  get required_skill() { return this.shuttleForm.controls.required_skill; }

  generateShuttleFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(64)]),
      serial_number: new FormControl('', [Validators.required, Validators.maxLength(32)]),
      class: new FormControl('', [Validators.required, Validators.maxLength(64)]),
      type: new FormControl('', [Validators.maxLength(64)]),
      capacity: new FormControl('', [Validators.min(0)]),
      base: new FormControl('Bastion', [Validators.maxLength(64)]),
      state: new FormControl('Fully operational', [Validators.maxLength(64)]),
      status_name: new FormControl('Ready', [Validators.maxLength(64)]),
      operable: new FormControl(true),
      required_skill: new FormControl('', [Validators.maxLength(64)])
    });
  }

  submitShuttle(): void {
    const shuttle = this.shuttleService.convertFormDataToShuttle(this.shuttleForm.value);
    this.shuttleService.createNewShuttle(shuttle);
    this.adminRouter.setSelectedMenuItem('shuttleView');
  }

  goBack(): void {
    this.adminRouter.setSelectedMenuItem('shuttleView');
  }

  ngOnDestroy() {
    this.shuttleForm = null;
  }
}

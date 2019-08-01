import { Component, OnInit, OnDestroy } from '@angular/core';
import { FobService } from '../../../shared/services/fob.service';
import { Fob } from '../../../shared/models/fob';
import { Subscription } from 'rxjs';
import { ValidatorService } from '../../../shared/services/form/validator.service';
import { AdminMenuService } from '../../admin-menu.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-fob-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditFobComponent implements OnInit, OnDestroy {

  currentFob: Fob;
  fobSubscription: Subscription;
  fobForm: FormGroup;

  constructor(
    private fobService: FobService,
    private validator: ValidatorService,
    private adminRouter: AdminMenuService,
  ) { }

  ngOnInit() {
    this.fobSubscription = this.fobService.getSelectedFob().subscribe(fob => {
      this.currentFob = fob;
    });
    this.fobForm = this.generateForm();
  }

  fieldCss(field: any): {} {
    return this.validator.displayFieldCss(field);
  }
  isValid(field: any): boolean {
    return this.validator.isFieldValid(field);
  }

  goBack(): void {
    this.fobService.unselectFob();
    this.adminRouter.setSelectedMenuItem('fobView');
  }

  onSubmit(): void {
    this.fobService.updateFob(this.fobForm.value);
    this.goBack();
  }

  private generateForm(): FormGroup {
    const formGroup = new FormGroup({
      _id: new FormControl(this.currentFob._id),
      name: new FormControl(this.currentFob.name, [Validators.required, Validators.maxLength(32)]),
      coordinates: new FormControl(this.currentFob.coordinates, [Validators.required]),
      status: new FormControl(this.currentFob.status, [Validators.required]),
      orderCode: new FormControl(this.currentFob.orderCode, [Validators.required, Validators.max(99), Validators.min(0)]),
      forces: new FormControl(this.currentFob.forces, [Validators.required]),

      weaponSupplyPercentage: new FormControl(this.currentFob.weaponSupplyPercentage, [
        Validators.required, Validators.max(100), Validators.min(0)
      ]),
      foodSupplyPercentage: new FormControl(this.currentFob.foodSupplyPercentage, [
        Validators.required, Validators.max(100), Validators.min(0)
      ]),
      medicalSupplyPercentage: new FormControl(this.currentFob.medicalSupplyPercentage, [
        Validators.required, Validators.max(100), Validators.min(0)
      ]),
    });
    return formGroup;
  }

  get name() { return this.fobForm.controls.name; }
  get coordinates() { return this.fobForm.controls.coordinates; }
  get status() { return this.fobForm.controls.status; }
  get orderCode() { return this.fobForm.controls.orderCode; }
  get forces() { return this.fobForm.controls.forces; }
  get weaponSupplyPercentage() { return this.fobForm.controls.weaponSupplyPercentage; }
  get foodSupplyPercentage() { return this.fobForm.controls.foodSupplyPercentage; }
  get medicalSupplyPercentage() { return this.fobForm.controls.medicalSupplyPercentage; }

  ngOnDestroy() {
    this.fobSubscription.unsubscribe();
  }
}

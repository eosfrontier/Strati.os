// import { BaseModalComponent } from './base-modal.component';
// import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
// import { Pipe, PipeTransform } from '@angular/core';
// import { Fob } from 'src/app/shared/models/fob';
// import { of } from 'rxjs';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { HttpClientModule } from '@angular/common/http';

// @Pipe({ name: 'supplyBreakpoint' })
// class MockPipe implements PipeTransform {
//     transform(value: number): any {
//         return value + '%';
//     }
// }

// const selectedFob = {
//     _id: 'testID',
//     coordinates: 'A0',
//     name: 'TestCitadel',
//     forces: 300,
//     orderCode: 0,
//     status: 'OK',
//     foodSupplyPercentage: 75,
//     weaponSupplyPercentage: 50,
//     medicalSupplyPercentage: 25
// };

// class MockFobService {

//     selectedFob = {
//         _id: 'testID',
//         coordinates: 'A0',
//         name: 'TestCitadel',
//         forces: 300,
//         orderCode: 0,
//         status: 'OK',
//         foodSupplyPercentage: 75,
//         weaponSupplyPercentage: 50,
//         medicalSupplyPercentage: 25
//     };

//     getSelectedFob() {
//         return this.selectedFob;
//     }


// }

// describe('BaseModalComponent', () => {

//     let component: BaseModalComponent;
//     let fixture: ComponentFixture<BaseModalComponent>;
//     let mockFobService;

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             imports: [FontAwesomeModule, HttpClientModule],
//             providers: [MockFobService],
//             declarations: [BaseModalComponent, MockPipe]
//         }).compileComponents();

//         // mock fobdata
//         mockFobService = jasmine.createSpyObj(['getSelectedFob']);

//         fixture = TestBed.createComponent(BaseModalComponent);
//         component = fixture.componentInstance;

//         component.supplyBreakpoints = {
//             full: 100,
//             high: 70,
//             medium: 35,
//         };
//         fixture.detectChanges();
//     });

//     it('UNUSED: should create the Base Modal Component', inject([MockFobService], () => {
//         component.fobData = this.selectedFob;
//         fixture.detectChanges();
//         expect(component).toBeTruthy();
//     }));

// });

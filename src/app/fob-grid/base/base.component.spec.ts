import { BaseComponent } from './base.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('BaseComponent (Hexagon inside FOB Grid)', () => {

    let component: BaseComponent;
    let fixture: ComponentFixture<BaseComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [FontAwesomeModule],
            declarations: [BaseComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(BaseComponent);
        component = fixture.componentInstance;

        component.supplyBreakpoints = {
            full: 100,
            high: 70,
            medium: 35,
        };
        component.fobData = {
            coordinates: 'A0',
            name: 'TestCitadel',
            foodSupplyPercentage: 75,
            weaponSupplyPercentage: 50,
            medicalSupplyPercentage: 25
        };

        fixture.detectChanges();
    });

    it('should create the Base Component', async () => {
        expect(component).toBeTruthy();
    });

    it('should contain the coordinates A0 on top', async () => {
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('.hex__coordinates').textContent).toContain('A0');
    });

    it('should have a H1 title displaying the name TestCitadel', async () => {
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toEqual('TestCitadel');
    });

    // it('should have a green dot when food supplies are equal to 75', async () => {
    //     const compiled = fixture.debugElement.nativeElement;
    //     expect(compiled.querySelector('#foodSupplies .dot').getAttribute('class')).toContain('dot--green');
    // });

});

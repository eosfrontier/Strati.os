import { ClockComponent } from './clock.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';

describe('ClockComponent', () => {

    let component: ClockComponent;
    let fixture: ComponentFixture<ClockComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ClockComponent]
        }).compileComponents();
        fixture = TestBed.createComponent(ClockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the Clock Component', () => {
        expect(component).toBeTruthy();
    });

    it('should display the time as being 10:00:00', () => {
        component.time = new Date('2019-01-07T09:00:00.000Z');
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h2').textContent).toContain('10:00:00');
    });

});

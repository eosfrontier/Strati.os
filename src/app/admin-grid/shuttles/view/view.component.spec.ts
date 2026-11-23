import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderModule } from 'ngx-order-pipe';
import { ShuttlesViewComponent } from './view.component';
import { ShuttleService } from '../../../shared/services/shuttle.service';
import { AdminMenuService } from '../../admin-menu.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Shuttle } from '../../../shared/models/shuttle';
import { environment } from '../../../../environments/environment';

function buildShuttle(id: string, name: string, statusName: string, operable = '1'): Shuttle {
  const shuttle = new Shuttle();
  shuttle.id = id;
  shuttle.name = name;
  shuttle.serial_number = `SN-${id}`;
  shuttle.class = 'Runner-Class';
  shuttle.type = 'Scout';
  shuttle.capacity = '4';
  shuttle.base = 'Bastion';
  shuttle.state = 'Fully operational';
  shuttle.status_name = statusName;
  shuttle.operable = operable;
  return shuttle;
}

describe('ShuttlesViewComponent', () => {
  let component: ShuttlesViewComponent;
  let fixture: ComponentFixture<ShuttlesViewComponent>;
  let shuttleService: ShuttleService;
  let adminMenu: AdminMenuService;
  let auth: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OrderModule],
      declarations: [ShuttlesViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    auth = TestBed.inject(AuthService);
    auth.setAuthStatus(34471);
    shuttleService = TestBed.inject(ShuttleService);
    adminMenu = TestBed.inject(AdminMenuService);
    httpMock = TestBed.inject(HttpTestingController);
    httpMock.match(environment.SHUTTLE.API_URL);

    fixture = TestBed.createComponent(ShuttlesViewComponent);
    component = fixture.componentInstance;
  });

  it('should render shuttles ordered by name with extended fields and status border class', () => {
    shuttleService.shuttleList.next([
      buildShuttle('2', 'Najat', 'On Mission'),
      buildShuttle('1', 'Ambrotos', 'Ready'),
      buildShuttle('3', 'Weasel', 'Grounded', '0')
    ]);
    fixture.detectChanges();

    const rows: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.shuttles__row');
    expect(rows.length).toEqual(3);
    expect(rows[0].textContent).toContain('Ambrotos');
    expect(rows[0].textContent).toContain('SN-1');
    expect(rows[0].textContent).toContain('Bastion');
    expect(rows[0].textContent).toContain('Ready');
    expect(rows[0].classList).toContain('green');

    expect(rows[1].textContent).toContain('Najat');
    expect(rows[1].classList).toContain('blue');

    expect(rows[2].textContent).toContain('Weasel');
    expect(rows[2].classList).toContain('red');
  });

  it('should navigate to shuttleAdd, select shuttle for edit, and delegate delete', () => {
    const shuttle = buildShuttle('5', 'Ambrotos', 'Ready');
    spyOn(shuttleService, 'deleteShuttle');

    component.addShuttle();
    expect(adminMenu.selectedMenuItem.getValue()).toEqual('shuttleAdd');

    component.selectShuttle(shuttle);
    expect(shuttleService.selectedShuttle.getValue()).toEqual(shuttle);
    expect(adminMenu.selectedMenuItem.getValue()).toEqual('shuttleEdit');

    component.deleteShuttle(shuttle);
    expect(shuttleService.deleteShuttle).toHaveBeenCalledWith(shuttle);
  });

  it('should display an error banner when shuttle loading fails', () => {
    shuttleService.shuttleError.next('Unauthorized (401): invalid or missing Orthanc API token.');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.shuttles__error').textContent).toContain('401');
  });
});

import { TestBed } from '@angular/core/testing';
import { AdminMenuService } from './admin-menu.service';
import { AuthService } from '../shared/services/auth.service';

describe('Service: AdminMenuService', () => {
  let adminMenu: AdminMenuService;
  let auth: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, AdminMenuService]
    });
    auth = TestBed.inject(AuthService);
    adminMenu = TestBed.inject(AdminMenuService);
  });

  it('should allow access to mission views without authentication', () => {
    adminMenu.setSelectedMenuItem('missionAdd');
    expect(adminMenu.selectedMenuItem.getValue()).toEqual('missionAdd');

    adminMenu.setSelectedMenuItem('missionView');
    expect(adminMenu.selectedMenuItem.getValue()).toEqual('missionView');
  });

  it('should protect fob and shuttle routes behind passcode and remember post-login target', () => {
    adminMenu.setSelectedMenuItem('shuttleView');
    expect(adminMenu.selectedMenuItem.getValue()).toEqual('authFirst');
    expect(adminMenu.getPostLoginMenuItem()).toEqual('shuttleView');

    adminMenu.setSelectedMenuItem('shuttleAdd');
    expect(adminMenu.selectedMenuItem.getValue()).toEqual('authFirst');
    expect(adminMenu.getPostLoginMenuItem()).toEqual('shuttleAdd');

    adminMenu.setSelectedMenuItem('shuttleEdit');
    expect(adminMenu.selectedMenuItem.getValue()).toEqual('authFirst');
    expect(adminMenu.getPostLoginMenuItem()).toEqual('shuttleEdit');

    adminMenu.setSelectedMenuItem('fobView');
    expect(adminMenu.selectedMenuItem.getValue()).toEqual('authFirst');
    expect(adminMenu.getPostLoginMenuItem()).toEqual('fobView');

    // Defaults to fobView once pending target has been consumed
    expect(adminMenu.getPostLoginMenuItem()).toEqual('fobView');
  });

  it('should navigate directly to shuttles when authenticated and return to missionView on logout', () => {
    expect(auth.setAuthStatus(34471)).toBeTruthy();

    adminMenu.setSelectedMenuItem('shuttleView');
    expect(adminMenu.selectedMenuItem.getValue()).toEqual('shuttleView');

    adminMenu.logout();
    expect(adminMenu.selectedMenuItem.getValue()).toEqual('missionView');

    adminMenu.setSelectedMenuItem('shuttleView');
    expect(adminMenu.selectedMenuItem.getValue()).toEqual('authFirst');
  });
});

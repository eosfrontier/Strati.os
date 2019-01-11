import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridModule } from './home-grid/grid.module';
import { SharedModule } from './shared/shared.module';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AdminGridModule } from './admin-grid/admin-grid.module';
import { FobGridModule } from './fob-grid/fob-grid.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHome,
  faProjectDiagram,
  faPlaneDeparture,
  faLock,
  faLockOpen,
  faSatellite,
  faBroadcastTower,
  faUserCog,
  faUserShield,
  faSatelliteDish,
  faMapMarkerAlt,
  faBoxes,
} from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GridModule,
    AdminGridModule,
    SharedModule,
    FobGridModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // add only the FA icons that we're using to prevent potential bloat.
    library.add(
      faHome,
      faProjectDiagram,
      faPlaneDeparture,
      faLock,
      faLockOpen,
      faSatellite,
      faBroadcastTower,
      faUserCog,
      faUserShield,
      faSatelliteDish,
      faMapMarkerAlt,
      faBoxes
    );
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridModule } from './grid/grid.module';
import { Routes, RouterModule } from '@angular/router';
import { GridComponent } from './grid/grid.component';
import { SharedModule } from './shared/shared.module';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AdminGridModule } from './admin-grid/admin-grid.module';
import { AdminGridComponent } from './admin-grid/admin-grid.component';


const appRoutes: Routes = [
  { path: 'admin', component: AdminGridComponent },
  { path: '**', component: GridComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    AppRoutingModule,
    GridModule,
    AdminGridModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

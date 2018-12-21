import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridModule } from './grid/grid.module';
import { Routes, RouterModule } from '@angular/router';
import { GridComponent } from './grid/grid.component';
import { SharedModule } from './shared/shared.module';

const appRoutes: Routes = [
  { path: '**', component: GridComponent }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    AppRoutingModule,
    GridModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

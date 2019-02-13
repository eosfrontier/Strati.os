import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GridComponent } from './home-grid/grid.component';
import { AdminGridComponent } from './admin-grid/admin-grid.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { FobGridComponent } from './fob-grid/fob-grid.component';

const routes: Routes = [
  { path: 'home', component: GridComponent },
  { path: 'admin', component: AdminGridComponent },
  // { path: 'shuttle', component: ShuttleGridComponent },
  { path: 'fobview', component: FobGridComponent },
  { path: '', component: GridComponent, pathMatch: 'full' },
  { path: '**', component: ErrorPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

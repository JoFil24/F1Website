import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DriverList  } from './drivers/driver-list/driver-list';
import { DriverForm } from './drivers/driver-form/driver-form';

export const routes: Routes = [
    { path: 'drivers', component: DriverList },
    { path: 'drivers/new', component: DriverForm },
    { path: 'drivers/edit/:id', component: DriverForm },

    { path: '', redirectTo: 'drivers', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  
  export class AppRoutingModule {}

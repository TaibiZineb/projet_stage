import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomersComponent } from './customers/customers.component';
import { LoginComponent } from './login/login.component';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { AuthentificationGuard } from './guards/authentification.guard';
import { HomeComponent } from './home/home.component';
import { ImporterComponent } from './importer/importer.component';
import { CreeationCompteComponent } from './creeation-compte/creeation-compte.component';





const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'creationcompte', component: CreeationCompteComponent },
  { path: '', redirectTo: 'admin/home', pathMatch: 'full' },
  { path: 'admin', component: AdminTemplateComponent, canActivate: [AuthentificationGuard],
    children: [
      { path: 'importer', component: ImporterComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'home', component: HomeComponent },
    ]
  },
  { path: '**', redirectTo: 'admin/home' }, 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

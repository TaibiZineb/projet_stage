import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { AuthentificationGuard } from './guards/authentification.guard';
import { HomeComponent } from './home/home.component';
import { ImporterComponent } from './importer/importer.component';
import { CreeationCompteComponent } from './creeation-compte/creeation-compte.component';
import { GestionCompteComponent } from './gestion-compte/gestion-compte.component';
import { CompteComponent } from './compte/compte.component';
import { InfoCompteComponent } from './info-compte/info-compte.component';





const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'creationcompte', component: CreeationCompteComponent },
  { path: '', redirectTo: 'admin/home', pathMatch: 'full' },
  { path: 'admin', component: AdminTemplateComponent, canActivate: [AuthentificationGuard],
    children: [
      { path: 'importer', component: ImporterComponent },
      { path: 'home', component: HomeComponent },
      { path: 'gestion', component: GestionCompteComponent },
      { path: 'compte', component: CompteComponent },
      { path: 'Infocompte', component: InfoCompteComponent },
      
    ]
  },
  { path: '**', redirectTo: 'admin/home' }, 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

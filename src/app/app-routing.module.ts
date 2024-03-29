import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { AuthentificationGuard } from './guards/authentification.guard';
import { ImporterComponent } from './importer/importer.component';
import { CompteComponent } from './compte/compte.component';
import { InfoCompteComponent } from './info-compte/info-compte.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { CVtemplateComponent } from './cvtemplate/cvtemplate.component';
import { VisualisationComponent } from './visualisation/visualisation.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin', component: AdminTemplateComponent, canActivate: [AuthentificationGuard],
    children: [
      { path: 'importer', component: ImporterComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'visualisation', component: VisualisationComponent },
      { path: 'visualisation/:cvId/:fileName', component: VisualisationComponent },
      { path: 'compte', component: CompteComponent },
      { path: 'Infocompte', component: InfoCompteComponent },
      { path: 'workspace', component: WorkspaceComponent },
      { path: 'cvtemplate', component: CVtemplateComponent },
    ]
  },
  
  //{ path: '**', redirectTo: 'login' }, 
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
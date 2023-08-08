import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ImporterComponent } from './importer/importer.component';
import { createClient } from '@supabase/supabase-js';
import { CompteComponent } from './compte/compte.component';
import { InfoCompteComponent } from './info-compte/info-compte.component';
import { RouterModule, Routes } from '@angular/router';
import { VisualisationComponent } from './visualisation/visualisation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { CVtemplateComponent } from './cvtemplate/cvtemplate.component';
import { VisualComponent } from './visual/visual.component';
@NgModule({
  declarations: [
    AppComponent,
    ImporterComponent,
    LoginComponent,
    AdminTemplateComponent,
    CompteComponent,
    InfoCompteComponent,
    VisualisationComponent,
    DashboardComponent,
    WorkspaceComponent,
    CVtemplateComponent,
    VisualComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

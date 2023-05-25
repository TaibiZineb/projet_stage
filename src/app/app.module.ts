import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ImporterComponent } from './importer/importer.component';
import { CreeationCompteComponent } from './creeation-compte/creeation-compte.component';
import { createClient } from '@supabase/supabase-js';
import { GestionCompteComponent } from './gestion-compte/gestion-compte.component';
import { CompteComponent } from './compte/compte.component';
import { InfoCompteComponent } from './info-compte/info-compte.component';
import { CreationConnecteComponent } from './creation-connecte/creation-connecte.component';

@NgModule({
  declarations: [
    AppComponent,
    ImporterComponent,
    LoginComponent,
    AdminTemplateComponent,
    HomeComponent,
    CreeationCompteComponent,
    GestionCompteComponent,
    CompteComponent,
    InfoCompteComponent,
    CreationConnecteComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

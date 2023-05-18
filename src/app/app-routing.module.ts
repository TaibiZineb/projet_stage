import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { CustomersComponent } from './customers/customers.component';
import { LoginComponent } from './login/login.component';
import { AdminTemplateComponent } from './admin-template/admin-template.component';
import { AuthentificationGuard } from './guards/authentification.guard';
import { HomeComponent } from './home/home.component';



const routes: Routes = [
  {path: 'login',component: LoginComponent},
  {path: "", component: HomeComponent,canActivate : [AuthentificationGuard]},
  {path: 'admin',component: AdminTemplateComponent, canActivate : [AuthentificationGuard],
  children : [
    {path: 'products', component: ProductsComponent},
    {path: 'customers', component:CustomersComponent},
    {path: 'home', component: HomeComponent},
   ]},
   
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Component,OnInit, AfterViewInit, OnDestroy, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';

import { AppUser } from '../model/user.model';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 
  userFromGroup!: FormGroup;
  errorMessage : any;
  


  constructor(private fb: FormBuilder, 
              private authService : AuthentificationService,
              private router : Router
             
              ){}

  ngOnInit(): void {
    this.userFromGroup = this.fb.group({
      Email : this.fb.control(""),
      password : this.fb.control("")

    })
   
   
  }
 

  handleLogin(): void{
    let Email = this.userFromGroup.value.Email;
    let password = this.userFromGroup.value.password;
    this.authService.login(Email, password).then((observable: Observable<AppUser>) => {
      observable.subscribe({
        next: (appUser: AppUser) => {
          this.authService.authenticateUser(appUser).subscribe({
            next: (data: boolean) => {
              this.router.navigateByUrl('admin/home');
            }
          });
        },
      error : (err: any) =>{
        this.errorMessage = err;
      }
    });
  });
  }
  signIn():void{
    
  }
  
  

}
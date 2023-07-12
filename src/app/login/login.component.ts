import { Component,OnInit, AfterViewInit, OnDestroy, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SupabaseClientService } from '../services/supabase-client.service';
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

  supabase!: SupabaseClient;
  userFromGroup!: FormGroup;
  errorMessage : any;
  


  constructor(private fb: FormBuilder, 
              
              private router : Router,
              private supabaseAuth: SupabaseClientService
             
              ){}

  ngOnInit(): void {
    
   
   
  }
 


  signIn(){
    this.supabaseAuth.signIn();
  }
  
}
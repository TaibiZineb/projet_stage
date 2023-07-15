import { Component,OnInit } from '@angular/core';
import { SupabaseClientService } from '../services/supabase-client.service';
import { Router } from '@angular/router';
import { SupabaseClient } from '@supabase/supabase-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  supabase!: SupabaseClient;

  
  constructor( 
              private router : Router,
              private supabaseAuth: SupabaseClientService
              ){}

  ngOnInit(): void { }
 


  signIn(){
    this.supabaseAuth.signIn();
  }
  
}
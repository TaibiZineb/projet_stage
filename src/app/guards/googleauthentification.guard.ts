import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';
import { SupabaseClientService } from '../services/supabase-client.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleauthentificationGuard implements CanActivate {
  constructor(
              private router: Router,
              private supabaseAuth: SupabaseClientService
              ){ }
  canActivate(): boolean {
    if (this.supabaseAuth.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}


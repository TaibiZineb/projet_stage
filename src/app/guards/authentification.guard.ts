import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { SupabaseClientService } from '../services/supabase-client.service';
import { Session } from '@supabase/gotrue-js';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationGuard implements CanActivate {
  constructor(private authService: SupabaseClientService, private router: Router) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.getSession().then((session: Session | null) => {
      if (!session) {
        this.router.navigateByUrl("/login");
        return false;
      }
      else
        return true
    });

  }


}


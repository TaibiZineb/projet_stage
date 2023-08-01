import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { SupabaseClientService } from '../services/supabase-client.service';
import { Session } from '@supabase/gotrue-js';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationGuard implements CanActivate {
  private canActivateCalled = false;
  constructor(private supabaseAuth: SupabaseClientService, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (this.canActivateCalled) {
      return true;
    }

    this.canActivateCalled = true;
    
    const session: Session | null = await this.supabaseAuth.getSession();
    if (!session) {
      console.log('User not authenticated, redirecting to login page');
      this.router.navigate(['/login']);
      return false;
    } else {
      // Vérifie si l'utilisateur a un workspace
      const hasWorkspace = await this.supabaseAuth.checkUserHasWorkspace(session.user.id);
      if (hasWorkspace) {
        console.log('User has a workspace, redirecting to admin/dashboard');
        this.router.navigate(['/admin/dashboard']);
      } else {
        console.log('User does not have a workspace, redirecting to admin/workspace');
        this.router.navigate(['/admin/workspace']);
      }
      return true;
    }
  }
}

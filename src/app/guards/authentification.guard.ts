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
        return true; // L'utilisateur a un espace de travail, on lui permet l'accès à la route demandée.
      } else {
        console.log('User does not have a workspace, redirecting to admin/workspace');
        this.router.navigate(['/admin/workspace']); // L'utilisateur n'a pas d'espace de travail, on le redirige vers la page de création d'espace de travail.
        return false;
      }
    }
  }
}

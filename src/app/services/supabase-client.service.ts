import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User,UserMetadata } from '@supabase/supabase-js';
import { Session } from '@supabase/gotrue-js';
import { Router } from '@angular/router';
import { AppUser } from '../model/user.model';
import { from, Observable, of, throwError } from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { Role } from '../model/user.model';
@Injectable({
  providedIn: 'root'
})
export class SupabaseClientService {
  supabase!: SupabaseClient;
  supabaseAuth: any;
  users : AppUser[] = [];
  authentificateUser : AppUser | null = null;
  constructor(private router: Router) {
    this.supabase = createClient('https://mljtanxsvdnervhrjnbs.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY');
  }
  signIn() {
  const signInWithOAuth = async () => {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: "/", 
        },
      });
      if (error) {
        console.error('Erreur lors de l\'authentification avec Google:', error);
      } else {
        console.log('Données de l\'utilisateur après l\'authentification:', data);
      }
    } catch (error) {
      console.error('Erreur lors de l\'authentification avec Google:', error);
    }
  };
  signInWithOAuth();
  }
  getSession = (): Promise<Session | null> => {
    return this.supabase.auth.getSession()
      .then((response) => {
        if (response?.data?.session) {
          return response.data.session;
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération de la session', error);
        return null;
      });
  }
  getCurrentUser(): Observable<AppUser | null> {
  return from(this.supabase.auth.getSession()).pipe(
    map((response: any) => {
      console.log('Réponse de getSession :', response);
      if (response?.data?.session?.user) {
        
        const user: any = response.data.session.user;
        console.log('Données utilisateur fournies par Google:', user);
        const fullName = user.user_metadata.full_name || '';
        const email = user.email || '';
        const photo = user.user_metadata.picture || '';
        return {
          id: user.id,
          email: email,
          prenom: fullName.split(' ')[0],
          nom: fullName.split(' ')[1] || '',
          photo:photo
        };
      } else {
          return null;
        }
      }),
      catchError((error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
        return of(null);
      })
    );
  }

  
  handleLogout(): void {
    this.supabase.auth.signOut()
      .then(() => {
        this.router.navigateByUrl('/login');
      })
      .catch((error: any) => {
        console.error('Erreur lors de la déconnexion:', error);
      });
  }
  public authenticateUser(AppUser : AppUser) :Observable<boolean>{
    this.authentificateUser = AppUser;
      if (AppUser.email) {
      localStorage.setItem("authUser", JSON.stringify({ email: AppUser.email, prenom: AppUser.prenom, nom:AppUser.nom ,jwt: "JWT_TOKEN" }));
      return of(true);
    } else {
      console.error("L'objet AppUser doit avoir une propriété 'email'");
      return throwError("L'objet AppUser doit avoir une propriété 'email'");
    }
  }
  async getRoleById(roleName: string): Promise<Role | null> {
    try {
      const { data, error } = await this.supabase.from('Role').select('*').eq('idRole', roleName).single();
      if (error) {
        console.error('Erreur lors de la récupération du rôle :', error);
        return null;
      } else {
        return data;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du rôle :', error);
      return null;
    }
  }
  async insertWorkspaceWithUserRole(userId: string, workspaceId: number, roleId: number): Promise<any> {
    try {
      // Insérer les données dans la table UserRoleWorkspace
      const { data: userRoleWorkspace, error: userRoleWorkspaceError } = await this.supabase
        .from('UserRoleWorkspace')
        .insert([
          {
            id_users: userId,
            idRole: roleId,
            idWorkspace: workspaceId
          }
        ]);
      if (userRoleWorkspaceError) {
        console.error('Erreur lors de l\'insertion dans UserRoleWorkspace :', userRoleWorkspaceError);
        return null;
      } else {
        return userRoleWorkspace;
      }
    } catch (error) {
      console.error('Erreur lors de l\'insertion dans UserRoleWorkspace :', error);
      return null;
    }
  }
  async getRoleByName(roleName: string): Promise<Role | null> {
    try {
      const { data, error } = await this.supabase.from('Role').select('*').eq('designationRole', roleName).single();
      if (error) {
        console.error('Erreur lors de la récupération du rôle :', error);
        return null;
      } else {
        return data;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du rôle :', error);
      return null;
    }
  }
  async insertWorkspace(nomEspace: string): Promise<any> {
    try {
      const response = await this.supabase.from('Workspace').insert([{ nomEspace }]);
      if (response.error) {
        console.error('Erreur lors de l\'enregistrement du workspace:', response.error);
        return { data: null, error: response.error }; // Retourne un objet avec data: null
      }
  
      const data = response.data;
      if (data) {
        return { data: data, error: null }; // Retourne un objet avec data
      } else {
        console.error('Erreur lors de l\'enregistrement du workspace : Aucune donnée renvoyée');
        return { data: null, error: 'Aucune donnée renvoyée' }; // Retourne un objet avec data: null
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du workspace:', error);
      return { data: null, error: error }; // Retourne un objet avec data: null
    }
  }
  
  
}

import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, UserMetadata } from '@supabase/supabase-js';
import { Session } from '@supabase/gotrue-js';
import { Router } from '@angular/router';
import { AppUser } from '../model/user.model';
import { from, Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Role,Workspace,WorkspaceData } from '../model/user.model';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
@Injectable({
  providedIn: 'root'
})
export class SupabaseClientService {
  supabase!: SupabaseClient;
  supabaseAuth: any;
  users: AppUser[] = [];
  authentificateUser: AppUser | null = null;
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
            photo: photo
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
  public authenticateUser(AppUser: AppUser): Observable<boolean> {
    this.authentificateUser = AppUser;
    if (AppUser.email) {
      localStorage.setItem("authUser", JSON.stringify({ email: AppUser.email, prenom: AppUser.prenom, nom: AppUser.nom, jwt: "JWT_TOKEN" }));
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
  async getRoleByName(roleName: string): Promise<Role | null> {
    try {
      console.log(roleName)
      const { data, error } = await this.supabase.from('Role').select().eq('designationRole', "Stage");
      console.log(JSON.stringify(data))
      if (error) {
        console.error('Erreur lors de la récupération du rôle :', error);
        return null;
      } else {
        return data[0];
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du rôle :', error);
      return null;
    }
  }
  async insertWorkspace(nomEspace: string): Promise<any> {
    console.log('nom Espace:', nomEspace);
    try {
      const response: PostgrestSingleResponse<any> = await this.supabase.from('Workspace').insert({ nomEspace }).select().single();
      console.log('Response from Supabase:', response);
      if (response === null) {
        console.error('Supabase response is null.');
        return null;
      }
      if (response.hasOwnProperty('error') && response.error) {
        console.error('Erreur lors de l\'enregistrement du workspace:', response.error);
        return { error: response.error };
      }
      console.log('Données enregistrées avec succès dans Workspace');
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du workspace:', error);
      return { error };
    }
  }
  async insertWorkspaceWithUserRole(id_user: string, idWorkspace: number, idRole: number): Promise<any> {
    try {
      console.log('Insertion dans UserRoleWorkspace:', { id_user, idWorkspace, idRole });
      const { data: UserRoleWorkspace, error: UserRoleWorkspaceError } = await this.supabase
        .from('UserRoleWorkspace')
        .insert({
          id_user: id_user,
          idWorkspace: idWorkspace,
          idRole: idRole
        });
      console.log('Réponse de UserRoleWorkspace:', { UserRoleWorkspace, UserRoleWorkspaceError });
  
      if (UserRoleWorkspaceError !== null) {
        console.error('Erreur lors de l\'insertion dans UserRoleWorkspace:', UserRoleWorkspaceError);
        return { error: UserRoleWorkspaceError };
      } else {
        return UserRoleWorkspace;
      }
    } catch (error) {
      console.error('Erreur lors de l\'insertion dans UserRoleWorkspace:', error);
      return { error };
    }
  }
  async checkUserHasWorkspace(userId: string): Promise<boolean> {
    try {
      const { data: userWorkspaces, error } = await this.supabase
        .from('UserRoleWorkspace')
        .select()
        .eq('id_user', userId);
  
      if (error) {
        console.error('Erreur lors de la vérification de l\'espace de travail de l\'utilisateur:', error);
        return false;
      }
      return userWorkspaces.length > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'espace de travail de l\'utilisateur:', error);
      return false;
    }
  }
  async getWorkspaceByUserId(userId: string): Promise<Workspace | null> {
    try {
      console.log('Début de la fonction getWorkspaceByUserId');
      console.log('ID de l\'utilisateur :', userId);
      const { data: userWorkspaces, error: workspaceError } = await this.supabase
        .from('UserRoleWorkspace')
        .select('idWorkspace')
        .eq('id_user', userId);
  
      if (workspaceError) {
        console.error('Erreur lors de la récupération de l\'espace de l\'utilisateur :', workspaceError);
        return null;
      }
      if (userWorkspaces.length === 0) {
        console.error('Aucun espace de travail associé à cet utilisateur.');
        return null;
      }
      const workspaceIds = userWorkspaces.map((userWorkspace) => userWorkspace.idWorkspace);
      const { data, error } = await this.supabase
        .from('Workspace')
        .select('idWorkspace, nomEspace, icon')
        .in('idWorkspace', workspaceIds)
        .limit(1);
      console.log('Data from Supabase:', data);
      console.log('Error from Supabase:', error);
      if (error) {
        console.error('Erreur lors de la récupération de l\'espace de l\'utilisateur :', error);
        return null;
      }
      if (data && data.length > 0) {
        const workspaceData: WorkspaceData = data[0];
        if (workspaceData) {
          const workspace: Workspace = {
            idWorkspace: workspaceData.idWorkspace,
            nomEspace: workspaceData.nomEspace,
            icon: workspaceData.icon,
          };
          console.log('Espace de l\'utilisateur :', workspace);
          return workspace;
        } else {
          console.error('Aucun espace de travail associé à cet utilisateur.');
          return null;
        }
      } else {
        console.error('Aucun espace de travail associé à cet utilisateur.');
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'espace de l\'utilisateur :', error);
      return null;
    }
  }
}

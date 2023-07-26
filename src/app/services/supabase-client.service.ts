import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User,UserMetadata } from '@supabase/supabase-js';
import { Session } from '@supabase/gotrue-js';
import { Router } from '@angular/router';
import { AppUser } from '../model/user.model';
import { from, Observable, of, throwError } from 'rxjs';
import { map,catchError } from 'rxjs/operators';
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
 
}
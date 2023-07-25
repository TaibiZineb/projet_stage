import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js';
import { Session } from '@supabase/gotrue-js';
import { Router } from '@angular/router';
import { AppUser } from '../model/user.model';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupabaseClientService {
  supabase!: SupabaseClient;
  supabaseAuth: any;
  users : AppUser[] = [];
  authentificateUser : AppUser | undefined;
  constructor(private router: Router) {

    this.supabase = createClient('https://mljtanxsvdnervhrjnbs.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY');
  }
  signIn() {
    const signInWithOAuth = async () => {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: "/", 
        },
      });
    };
    signInWithOAuth();
  }
  getSession = (): Promise<Session | null> => {

    return this.supabase.auth.getSession()
      .then((response) => {
        if (response.data) {
          return response.data.session;
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.error('Error getting session:', error);
        return null;
      });

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
      localStorage.setItem("authUser", JSON.stringify({ email: AppUser.email, prenom: AppUser.prenom, jwt: "JWT_TOKEN" }));
      return of(true);
    } else {
      // Gérer le cas où l'objet AppUser n'a pas de propriété 'email'
      console.error("L'objet AppUser doit avoir une propriété 'email'");
      return throwError("L'objet AppUser doit avoir une propriété 'email'");
    }
  }
  getUsersFromDatabase(): Observable<AppUser[]> {
    return from(
      this.supabase
        .from('users')
        .select('email, prenom, nom')
        .then((response) => {
          if (response.data) {
            return response.data;
          } else {
            return [];
          }
        })
    ).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        throw error;
      })
    );
  }


}





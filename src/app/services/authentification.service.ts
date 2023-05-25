import { Injectable } from '@angular/core';
import { AppUser } from '../model/user.model';
import { Observable, of, throwError } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  users : AppUser[] = [];
  authentificateUser : AppUser | undefined;
  supabase!: SupabaseClient;
  supabaseUrl!: string;
  supabaseKey!: string;

  constructor() { 

    this.supabaseUrl = 'https://mljtanxsvdnervhrjnbs.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY';
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    
  }

  public async login(Email: string, password: string): Promise<Observable<AppUser>> {
    const { data, error } = await this.supabase
      .from('Compte')
      .select()
      .eq('Email', Email)
      .single();

    if (error) {
      console.error('Error executing query:', error);
      return throwError(() => new Error('Une erreur s\'est produite.'));
    }

    if (!data) {
      return throwError(() => new Error('Utilisateur non trouvé.'));
    }

    const user = data;
    if (user['mot-de-passe'] !== password) {
      return throwError(() => new Error('Mauvaises informations d\'identification'));
    }

    const appUser: AppUser = {
      userId: user['userId'],
      Email: user['Email'],
      password: user['mot-de-passe'],
      isDirecteurChecked: user['isDirecteur'],
      isRHChecked: user['isRH'],
      Nom_Societe: user['Nom_Societe'],
      nom: user['nom'],
      prenom: user['prenom'],
      num: user['Num'],
      Date_integration: user['Date-integration'],
      pays: user['pays'],
      ville: user['ville'],
      genre: user['Genre']
    };

    return of(appUser);
  }

  public authenticateUser(AppUser : AppUser) :Observable<boolean>{
    this.authentificateUser = AppUser;
    localStorage.setItem("authUser", JSON.stringify({Email: AppUser.Email, isDirecteurCheked : AppUser.isDirecteurChecked, isRHCheked : AppUser.isRHChecked, Nom_Societe :AppUser.Nom_Societe, jwt:"JWT_TOKEN"}));
    return of(true);
  }
 
  public logout(): Observable<boolean>{
    this.authentificateUser = undefined;
    localStorage.removeItem("authUser");
    return of (true);
  }
  public isAuthenticated() : boolean{
    return this.authentificateUser!= undefined;
  }

}

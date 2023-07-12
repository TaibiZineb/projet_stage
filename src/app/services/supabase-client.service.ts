import { Injectable } from '@angular/core';
import { createClient, SupabaseClient,Session } from '@supabase/supabase-js';


@Injectable({
  providedIn: 'root'
})
export class SupabaseClientService {

  supabase!: SupabaseClient;
  constructor() { 
 
    this.supabase = createClient('https://mljtanxsvdnervhrjnbs.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY');
  }
  signIn(){
    const signInWithOAuth = async () => {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
      redirectTo: "/",
      },
      });
      if (error) {
        alert('Erreur lors de la connexion ');
      }
      if (!data) {
        throw new Error('Utilisateur non trouvé.');
      }
    
      const user = data;
      
      };
     
      signInWithOAuth();
  }
  isAuthenticated(): boolean {
    const session: Session | null = this.supabase.auth.session();
    return session !== null && session.user !== null;
  }
}
import { Injectable } from '@angular/core';
import { createClient, Session, SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseClientService {
  supabase!: SupabaseClient;
<
  constructor() {

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
  


}


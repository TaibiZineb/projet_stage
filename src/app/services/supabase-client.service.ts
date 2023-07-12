import { Injectable } from '@angular/core';
import { createClient, SupabaseClient,SupabaseClientOptions } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseClientService {
  supabase!: SupabaseClient;
  supabaseUrl!: 'https://mljtanxsvdnervhrjnbs.supabase.co';
  supabaseKey!: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY';
  constructor() { 
 
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }
  signIn(){
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
}

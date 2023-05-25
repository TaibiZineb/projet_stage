import { Component,OnInit } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';
import { createClient} from '@supabase/supabase-js';

@Component({
  selector: 'app-info-compte',
  templateUrl: './info-compte.component.html',
  styleUrls: ['./info-compte.component.css']
})
export class InfoCompteComponent implements OnInit{
  supabaseUrl!: string;
  supabaseKey!: string;
  supabase: any;
  constructor(public authService : AuthentificationService){
    this.supabaseUrl = 'https://mljtanxsvdnervhrjnbs.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY';
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }
  ngOnInit(): void {
    
  }

}

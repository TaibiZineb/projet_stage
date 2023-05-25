import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { createClient,SupabaseClient} from '@supabase/supabase-js';
import { AuthentificationService } from '../services/authentification.service';

@Component({
  selector: 'app-gestion-compte',
  templateUrl: './gestion-compte.component.html',
  styleUrls: ['./gestion-compte.component.css']
})
export class GestionCompteComponent implements OnInit{
  GestionCompteForm!: FormGroup;
  supabaseUrl!: string;
  supabaseKey!: string;
  supabase: any;
  genre!: string;
  constructor(private formBuilder: FormBuilder, public authService : AuthentificationService){
    this.supabaseUrl = 'https://mljtanxsvdnervhrjnbs.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY';
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }
  onSubmit(): void{

  }
  ngOnInit(): void{

  }

}

import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { createClient} from '@supabase/supabase-js';

@Component({
  selector: 'app-creeation-compte',
  templateUrl: './creeation-compte.component.html',
  styleUrls: ['./creeation-compte.component.css']
})
export class CreeationCompteComponent implements OnInit{
  supabaseUrl!: string;
  supabaseKey!: string;
  supabase: any;
  creationCompteForm!: FormGroup;
  isDirecteurChecked: boolean = false;
  isRHChecked: boolean = false;

  constructor( private formBuilder: FormBuilder){
    this.supabaseUrl = 'https://mljtanxsvdnervhrjnbs.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY';
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }
  ngOnInit(): void {
    this.creationCompteForm = this.formBuilder.group({
      Genre: [''],
      nom: [''],
      prenom: [''],
      Nom_Societe: [''],
      Num: [''],
      Email: [''],
      'mot-de-passe': [''],
      isDirecteur: [''],
      isRH: [''],
      Date_integration: [this.getCurrentDate()],
      pays: [''],
      ville: ['']
    });
  }
  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); 
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  onSubmit(): void {
    if (this.creationCompteForm.valid) {
      const formData = this.creationCompteForm.value;
      formData.isDirecteur = this.isDirecteurChecked;
      formData.isRH = this.isRHChecked;


      this.supabase
        .from('Compte')
        .insert([formData])
        .then((response: any) => {
          alert('Enregistrement réussi.');
          this.creationCompteForm.reset();
        })
        .catch((error: any) => {
          alert('Erreur lors de l\'enregistrement.');
          console.error("Erreur lors de l'enregistrement :", error);
        });
    }
  }
  
}



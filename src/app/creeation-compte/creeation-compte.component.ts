import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
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
    const telephonePattern = /^\d{4}\.\d{3}\.\d{3}$/;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    this.creationCompteForm = this.formBuilder.group({
      Genre: ['',Validators.required],
      nom: ['',Validators.required],
      prenom: ['',Validators.required],
      Nom_Societe: ['',Validators.required],
      Num: ['',[Validators.required, Validators.pattern(telephonePattern)]],
      Email: ['',[Validators.required, Validators.email]],
      'mot-de-passe': ['',[Validators.required, Validators.pattern(passwordPattern)]],
      isDirecteur: [false, Validators.requiredTrue],
      isRH: [false, Validators.requiredTrue],
      Date_integration: [this.getCurrentDate()],
      pays: ['',Validators.required],
      ville: ['',Validators.required]
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


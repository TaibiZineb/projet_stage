import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,FormsModule,ReactiveFormsModule} from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';
import { AppUser } from '../model/user.model';
import { createClient} from '@supabase/supabase-js';

@Component({
  selector: 'app-gestion-compte',
  templateUrl: './gestion-compte.component.html',
  styleUrls: ['./gestion-compte.component.css']
})
export class GestionCompteComponent implements OnInit{
  users : AppUser[] = [];
  GestionCompteForm!: FormGroup;
  supabaseUrl!: string;
  supabaseKey!: string;
  supabase: any;
  genre!: string;
  isDirecteurChecked: boolean = true;
  isRHChecked: boolean = true;
  genreControl!: FormControl;

  constructor(private formBuilder: FormBuilder, public authService : AuthentificationService){
    this.supabaseUrl = 'https://mljtanxsvdnervhrjnbs.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY';
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }
  ngOnInit(): void{
    const data: any =null;
    const user = data;
    this.GestionCompteForm = this.formBuilder.group({
  
     
      Email: user['Email'],
      password: user['mot-de-passe'],
      
      Nom_Societe: user['Nom_Societe'],
      nom: user['nom'],
      prenom: user['prenom'],
      num: user['Num'],
     
    });
    

  }
  onSubmit(): void{
    const formData = {
    
      
      nom: this.GestionCompteForm.value.nom,
      prenom: this.GestionCompteForm.value.prenom,
      Nom_Socete: this.GestionCompteForm.value.Nom_Socete,
      Num: this.GestionCompteForm.value.Num,
      Email: this.GestionCompteForm.value.Email,
      password: this.GestionCompteForm.value.password,
      




    };
    this.supabase
        .from('User')
        .update([formData])
        .then((response: any) => {
          console.log('Enregistrement réussi :', response);
          alert('Enregistrement réussi.');
        })
        .catch((error: any) => {
          alert('Erreur lors de l\'enregistrement.');
          console.error("Erreur lors de l'enregistrement :", error);
        });
  }


}

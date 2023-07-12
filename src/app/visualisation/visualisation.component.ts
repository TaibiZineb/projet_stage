import { Component,OnInit,AfterViewInit } from '@angular/core';
import {  FormBuilder, FormGroup, Validators} from '@angular/forms';
import { createClient} from '@supabase/supabase-js';

@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.css']
})
export class VisualisationComponent implements OnInit,AfterViewInit{
  visualisationForm !: FormGroup;
  supabaseUrl!: string;
  supabaseKey!: string;
  supabase: any;



  constructor(private formBuilder: FormBuilder){
    this.supabaseUrl = 'https://mljtanxsvdnervhrjnbs.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY';
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);

  }
  ngOnInit(): void {
    const telephonePattern = /^\d{4}\.\d{3}\.\d{3}$/;
    this.visualisationForm = this.formBuilder.group({
      nomCandidat: ['',Validators.required],
      prenomCandidat: ['',Validators.required],
      emailCandidat: ['',Validators.email],
      telephone: ['',Validators.pattern(telephonePattern)],
      role: ['',Validators.required],
      Annéesexpérience: [''],
      Nomentreprise:['',Validators.required],
      Intituléposte:['',Validators.required],
      Datedebut:['',Validators.required],
      Datefin:['',Validators.required],
      description:[''],
      Nom_ecole:[''],
      Diplome:[''],
      VilleE:[''],
      DatedebutF:[''],
      datefinF:[''],
      titre_comp:[''],
      titre_certificat:[''],
      dateCert:[''],
      titre_langue:[''],
      niveaulang:['']

    });
  }
  ngAfterViewInit(): void {
    const addButton = document.getElementById("addButton");
    if (addButton) {
      addButton.addEventListener("click", this.ajouterBloc.bind(this));
    }
  }
  ajouterBloc() {
    const blocExistant = document.querySelector(".blocks") as HTMLElement;
    if (blocExistant) {
      const nouveauBloc = blocExistant.cloneNode(true) as HTMLElement;
      const container = document.getElementById("container");
      if (container) {
        container.appendChild(nouveauBloc);
      }
    }
  }
  ajouterBlocEdu() {
    const blocExistant = document.querySelector(".blocksEdu") as HTMLElement;
    if (blocExistant) {
      const nouveauBloc = blocExistant.cloneNode(true) as HTMLElement;
      const containerEdu = document.getElementById("containerEdu");
      if (containerEdu) {
        containerEdu.appendChild(nouveauBloc);
      }
    }
  }
  ajouterBlocLang() {
    const blocExistant = document.querySelector(".blocksLang") as HTMLElement;
    if (blocExistant) {
      const nouveauBloc = blocExistant.cloneNode(true) as HTMLElement;
      const containerLang = document.getElementById("containerLang");
      if (containerLang) {
        containerLang.appendChild(nouveauBloc);
      }
    }
  }
  ajouterBlocCertif() {
    const blocExistant = document.querySelector(".blocksCertif") as HTMLElement;
    if (blocExistant) {
      const nouveauBloc = blocExistant.cloneNode(true) as HTMLElement;
      const containerCertif = document.getElementById("containerCertif");
      if (containerCertif) {
        containerCertif.appendChild(nouveauBloc);
      }
    }
  }
  ajouterBlocCopet() {
    const blocExistant = document.querySelector(".blocksCopet") as HTMLElement;
    if (blocExistant) {
      const nouveauBloc = blocExistant.cloneNode(true) as HTMLElement;
      const containerCopet = document.getElementById("containerCopet");
      if (containerCopet) {
        containerCopet.appendChild(nouveauBloc);
      }
    }
  }
  onSubmit(): void {
    const formData = this.visualisationForm.value;

        this.supabase
        .from('candidat')
        .insert([
          {
            nomCandidat: formData.nomCandidat,
            prenomCandidat: formData.prenomCandidat,
            emailCandidat: formData.emailCandidat,
            telephone: formData.telephone,
            role: formData.role,
            Annéesexpérience: formData.Anneesexperience
          }
        ])
        .then((response: any) => {
          console.log('Enregistrement réussi :', response);
          alert('Enregistrement réussi.');
          this.visualisationForm.reset();
        })
        .catch((error: any) => {
          alert('Erreur lors de l\'enregistrement.');
          console.error("Erreur lors de l'enregistrement :", error);
        });
        this.supabase
        .from('experience')
        .insert([
          {
            Nomentreprise: formData.Nomentreprise,
            Intituléposte: formData.Intituleposte,
            Datedebut: formData.Datedebut,
            Datefin: formData.Datefin,
            description: formData.description
          }
        ])
        .then((response: any) => {
          console.log('Enregistrement réussi :', response);
          alert('Enregistrement réussi.');
          this.visualisationForm.reset();
        })
        .catch((error: any) => {
          alert('Erreur lors de l\'enregistrement.');
          console.error("Erreur lors de l'enregistrement :", error);
        });
        this.supabase
        .from('Formation')
        .insert([
          {
            Nom_ecole: formData.Nom_ecole,
            DatedebutF: formData.DatedebutF,
            Diplome: formData.Diplome,
            VilleE: formData.VilleE,
            datefinF: formData.datefinF
          }
        ])
        .then((response: any) => {
          console.log('Enregistrement réussi :', response);
          alert('Enregistrement réussi.');
          this.visualisationForm.reset();
        })
        .catch((error: any) => {
          alert('Erreur lors de l\'enregistrement.');
          console.error("Erreur lors de l'enregistrement :", error);
        });
        this.supabase
        .from('competance')
        .insert([
          {
            titre_comp: formData.titre_comp
          }
        ])
        .then((response: any) => {
          console.log('Enregistrement réussi :', response);
          alert('Enregistrement réussi.');
          this.visualisationForm.reset();
        })
        .catch((error: any) => {
          alert('Erreur lors de l\'enregistrement.');
          console.error("Erreur lors de l'enregistrement :", error);
        });
        this.supabase
        .from('certificat')
        .insert([
          {
            titre_certificat: formData.titre_certificat,
            dateCert:formData.dateCert
            
          }
        ])
        .then((response: any) => {
          console.log('Enregistrement réussi :', response);
          alert('Enregistrement réussi.');
          this.visualisationForm.reset();
        })
        .catch((error: any) => {
          alert('Erreur lors de l\'enregistrement.');
          console.error("Erreur lors de l'enregistrement :", error);
        });
        this.supabase
        .from('langue')
        .insert([
          {
            titre_langue: formData.titre_langue,
            niveaulang:formData.niveaulang
            
          }
        ])
        .then((response: any) => {
          console.log('Enregistrement réussi :', response);
          alert('Enregistrement réussi.');
          this.visualisationForm.reset();
        })
        .catch((error: any) => {
          alert('Erreur lors de l\'enregistrement.');
          console.error("Erreur lors de l'enregistrement :", error);
        });
    }
  }





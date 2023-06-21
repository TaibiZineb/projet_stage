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
      nom: ['',Validators.required],
      prenom: ['',Validators.required],
      email: ['',Validators.email],
      telephone: ['',Validators.pattern(telephonePattern)],
      role: [''],
      Annéesexpérience: ['']
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
    if (this.visualisationForm.valid) {
      const formData = this.visualisationForm.value;
        this.supabase
        .from('candidat')
        .insert([formData])
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
}

  




import { Component,OnInit,AfterViewInit } from '@angular/core';
import {  FormBuilder, FormGroup, Validators} from '@angular/forms';
import { createClient} from '@supabase/supabase-js';
import { map, startWith} from 'rxjs/operators';

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
  submittedData:any = {};
  submittedDataArray: any[] = [];

  constructor(private formBuilder: FormBuilder){
    this.supabaseUrl = 'https://mljtanxsvdnervhrjnbs.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY';
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);

  }
  ngOnInit(): void {
    const telephonePattern = /^\d{4}\.\d{3}\.\d{3}$/;
    this.visualisationForm = this.formBuilder.group({
      firstName: ['',Validators.required],
      lastName: ['',Validators.required],
      Email: ['',Validators.email],
      telephone: ['',Validators.pattern(telephonePattern)],
      role: ['',Validators.required],
      Anneesexperience: [''],
      Nomentreprise:['',Validators.required],
      Intituleposte:['',Validators.required],
      Datedebut:['',Validators.required],
      Datefin:['',Validators.required],
      present: [false],
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
      addButton.addEventListener("click", () => this.ajouterBloc("blocks", "container"));

    }
  }
  ajouterBloc(nomClasse: string, containerId: string): void {
    const blocExistant = document.querySelector("." + nomClasse) as HTMLElement;
    if (blocExistant) {
      const nouveauBloc = blocExistant.cloneNode(true) as HTMLElement;
      const container = document.getElementById(containerId);
      if (container) {
        container.appendChild(nouveauBloc);
        this.submittedDataArray.push(this.visualisationForm.value); // Ajoutez les données dans le tableau submittedDataArray
        this.visualisationForm.reset(); // Réinitialisez le formulaire
      }
    }
    this.submittedData = this.visualisationForm.value;
    this.submittedDataArray.push(this.submittedData);
  }
  ajouterBlocStage() {
    this.ajouterBloc("blocks", "container");
  }
  ajouterBlocEdu() {
    this.ajouterBloc("blocksEdu", "containerEdu");
  }
  ajouterBlocLang() {
    this.ajouterBloc("blocksLang", "containerLang");
  }
  ajouterBlocCertif() {
    this.ajouterBloc("blocksCertif", "containerCertif");
  }
  ajouterBlocCopet() {
    this.ajouterBloc("blocksCopet", "containerCopet");
  }
  onSubmit(): void {
    const dateDebutValue = this.visualisationForm.get('Datedebut')?.value;
    let dateFinValue = this.visualisationForm.get('Datefin')?.value;

    if (this.isDateFinChecked()) {
      dateFinValue = 'jusqu\'à présent';
    }
    this.visualisationForm.get('Datefin')?.setValue(dateFinValue);
    this.submittedData = this.visualisationForm.value;
    this.submittedDataArray.push(this.submittedData);
  }
  
  onDateInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    const formattedDate = this.formatDateToMonthYear(inputValue);
    this.visualisationForm.get('Datedebut')?.setValue(formattedDate, { emitEvent: false });
  
    // Désactiver les dates antérieures dans le champ de date de fin
    this.updateEndDateOptions();
  }
  updateEndDateOptions(): void {
    const dateDebutValue = this.visualisationForm.get('Datedebut')?.value;
    const dateDebut = new Date(dateDebutValue);
    const dateFinControl = this.visualisationForm.get('Datefin');
  
    // Vérifier si une date de début est sélectionnée
    if (dateDebutValue && dateFinControl) {
      // Récupérer la valeur actuelle du champ de date de fin
      const dateFinValue = dateFinControl.value;
  
      // Vérifier si la date de fin actuelle est antérieure à la date de début
      const currentDateFin = new Date(dateFinValue);
      if (currentDateFin < dateDebut) {
        // Réinitialiser la date de fin si elle est antérieure à la date de début
        dateFinControl.patchValue('');
      }
  
      // Désactiver les dates antérieures à la date de début
      const dateDebutFormatted = this.formatDateToMonthYear(dateDebutValue);
      dateFinControl.patchValue(dateFinValue, { emitEvent: false }); // Patch la valeur actuelle pour déclencher le changement de date de fin sans boucle infinie
      dateFinControl.disable({ onlySelf: true, emitEvent: false }); // Désactiver le champ temporairement pour éviter les erreurs de validation
      this.visualisationForm.get('Datefin')?.setValidators([Validators.required]); // Appliquer une validation requise pour éviter de soumettre le formulaire sans date de fin
  
      // Activer les dates supérieures à la date de début
      const dateFinOptions = dateFinControl.valueChanges.pipe(
        map((selectedDate: string) => {
          return this.formatDateToMonthYear(selectedDate);
        }),
        startWith(dateFinControl.value as string),
        map((selectedDate: string) => {
          return selectedDate && selectedDate >= dateDebutFormatted ? selectedDate : dateDebutFormatted;
        })
      );
  
      // Mettre à jour les options du champ de date de fin
      dateFinOptions.subscribe((options: string) => {
        dateFinControl.enable({ onlySelf: true, emitEvent: false }); // Réactiver le champ de date de fin
        dateFinControl.setValidators([]); // Supprimer la validation requise pour le champ de date de fin
        dateFinControl.patchValue(options, { emitEvent: false });
      });
    }
  }
  
  formatDateToMonthYear(dateStr: string): string {
    const date = new Date(dateStr);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${month}/${year}`;
  }
  isDateFinDisabled(): boolean {
    const isPresent = this.visualisationForm.get('present')?.value;
    return isPresent ? true : false;
  }
  isDateFinChecked(): boolean {
    const isPresent = this.visualisationForm.get('present')?.value;
    return isPresent ? true : false;
  }
  getMinimumDate(): string | null {
    const dateDebutValue = this.visualisationForm.get('Datedebut')?.value;
    return dateDebutValue ? this.formatDateToYearMonth(dateDebutValue) : null;
  }
  
  formatDateToYearMonth(dateStr: string): string {
    const date = new Date(dateStr);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }
  
}
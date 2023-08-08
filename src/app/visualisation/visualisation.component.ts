import { Component,OnInit,AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  isDataSubmitted: boolean = false;

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
        this.submittedDataArray.push(this.visualisationForm.value); 
        this.visualisationForm.reset(); 
      }
    }
    this.submittedData = this.visualisationForm.value;
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
    this.submittedDataArray.push(this.submittedData);
    this.isDataSubmitted = true;
  }
  onDateInput(event: Event, fieldName: string): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    const formattedDate = this.formatDateToMonthYear(inputValue);
    this.visualisationForm.get(fieldName)?.setValue(formattedDate, { emitEvent: false });
    this.updateEndDateOptions(fieldName);
  }
  updateEndDateOptions(fieldName: string): void {
    console.log(`updateEndDateOptions called for ${fieldName}`);
    const dateDebutValue = this.visualisationForm.get('fieldName')?.value;
    const dateDebut = new Date(dateDebutValue);
    const dateFinControl = this.visualisationForm.get('Datefin' + fieldName.substring(fieldName.length - 1));
    if (dateDebutValue && dateFinControl && dateFinControl.value) {
      const [year, month] = dateFinControl.value.split('-');
      const formattedDateFinValue = `${year}-${month}`;
  
      const currentDateFin = new Date(formattedDateFinValue);
      const today = new Date();
      console.log('dateDebut:', dateDebut);
      console.log('currentDateFin:', currentDateFin);
      console.log('today:', today);
  
      if (currentDateFin < dateDebut || currentDateFin > today) {
        console.log('Invalid date');
        dateFinControl.patchValue('');
      } else {
        console.log('Valid date');
        const dateDebutFormatted = this.formatDateToMonthYear(dateDebutValue);
        const dateFinFormatted = this.formatDateToMonthYear(formattedDateFinValue); // Format date fin
        dateFinControl.patchValue(dateFinFormatted, { emitEvent: false });
        dateFinControl.disable({ onlySelf: true, emitEvent: false });
        this.visualisationForm.get('Datefin')?.setValidators([Validators.required]);
        const dateFinOptions = dateFinControl.valueChanges.pipe(
          map((selectedDate: string) => {
            return this.formatDateToMonthYear(selectedDate);
          }),
          startWith(dateFinControl.value as string),
          map((selectedDate: string) => {
            return selectedDate && selectedDate >= dateDebutFormatted ? selectedDate : dateDebutFormatted;
          })
        );
        dateFinOptions.subscribe((options: string) => {
          dateFinControl.enable({ onlySelf: true, emitEvent: false });
          dateFinControl.setValidators([]);
          dateFinControl.patchValue(options, { emitEvent: false });
        });
      }
    }
  }
  
  
  formatDateToMonthYear(dateStr: string): string {
    const date = new Date(dateStr);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }
  
  isDateFinDisabled(): boolean {
    const isPresent = this.visualisationForm.get('present')?.value;
    return isPresent ? true : false;
  }
  isDateFinChecked(): boolean {
    const isPresent = this.visualisationForm.get('present')?.value;
    return isPresent ? true : false;
  }
  getMinimumDate(fieldName: string): string | null {
    const dateDebutValue = this.visualisationForm.get(fieldName)?.value;
    return dateDebutValue ? this.formatDateToYearMonth(dateDebutValue) : null;
  }
  formatDateToYearMonth(dateStr: string): string {
    const date = new Date(dateStr);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }
  getMaximumDate(fieldName: string): string {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
  }
  
}
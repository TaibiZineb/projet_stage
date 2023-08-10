import { Component,OnInit,AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { createClient} from '@supabase/supabase-js';
import { map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.css']
})
export class VisualisationComponent implements OnInit{
  visualisationForm !: FormGroup;
  supabaseUrl!: string;
  supabaseKey!: string;
  supabase: any;
  submittedData: any = {};
  submittedDataArray: any[] = [];
  currentSectionIndex: number; 
  isDataSubmitted: boolean = false;
  constructor(private formBuilder: FormBuilder){
    this.supabaseUrl = 'https://mljtanxsvdnervhrjnbs.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY';
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    this.currentSectionIndex = 0;
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
      present1: [false],
      present2: [false],
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
      niveaulang:[''],
      historique: this.formBuilder.array([this.createHistoriqueSection()]),
      Education:  this.formBuilder.array([this.createEducationSection()]),
      Competences: this.formBuilder.array([this.createCompetencesSection()]),
      Langues:this.formBuilder.array([this.createLanguesSection()]),
      Certificats:this.formBuilder.array([this.createCertificatsSection()]),

    });
    console.log('Initial form values:', this.visualisationForm.value);
  }
  onSubmit(): void {
    console.log('Submitting form data:', this.visualisationForm.value);
  
    const dateDebutValue = this.visualisationForm.get('Datedebut')?.value;
    let dateFinValue = this.visualisationForm.get('Datefin')?.value;
  
    if (this.isDateFinChecked(1)) {
      dateFinValue = 'jusqu\'à présent';
    }
    this.visualisationForm.get('Datefin')?.setValue(dateFinValue);
    this.submittedData = this.visualisationForm.value;
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
    const dateFinControl = this.visualisationForm.get('Datefin' + fieldName.substring(fieldName.length - 1));
    const dateDebut = new Date(dateDebutValue);
    console.log('Date de début (updateEndDateOptions):', dateDebutValue);
  console.log('Date de fin (updateEndDateOptions):', dateFinControl?.value);
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
  isDateFinChecked(section: number): boolean {
    const isPresent = this.visualisationForm.get(`present${section}`)?.value;
    return isPresent ? true : false;
  }
  
  isDateFinDisabled(section: number): boolean {
    const isPresent = this.visualisationForm.get(`present${section}`)?.value;
    return isPresent ? true : false;
  }
  getMinimumDate(fieldName: string): string | null {
    const dateDebutValue = this.visualisationForm.get(fieldName)?.value;
    console.log('Date de début (getMinimumDate):', dateDebutValue);
    return dateDebutValue ? this.formatDateToYearMonth(dateDebutValue) : null;
  }
  formatDateToYearMonth(dateStr: string): string {
    const date = new Date(dateStr);
    console.log('Date formatée (formatDateToMonthYear):', date);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }
  getMaximumDate(fieldName: string): string {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
  }
  addHistoriqueSection(): void {
    const historiqueArray = this.visualisationForm.get('historique') as FormArray;
    historiqueArray.push(this.createHistoriqueSection());
  }
  createHistoriqueSection(): FormGroup {
    return this.formBuilder.group({
      Nomentreprise: ['', Validators.required],
      Intituleposte: ['', Validators.required],
      Datedebut: ['', Validators.required],
      Datefin: [''],
      present1: [false],
      description: ['']
    });
  }
  get historiqueFormArray(): FormArray {
    return this.visualisationForm.get('historique') as FormArray;
  }
  removeHistoriqueSection(index: number) {
    const historiqueControl = this.visualisationForm.get('historique') as FormArray;
    historiqueControl.removeAt(index);
  }
  addEducationSection():void{
    const historiqueArray = this.visualisationForm.get('Education') as FormArray;
    historiqueArray.push(this.createHistoriqueSection());
  }
  createEducationSection(): FormGroup {
    return this.formBuilder.group({
      Nom_ecole:[''],
      Diplome:[''],
      VilleE:[''],
      DatedebutF:[''],
      datefinF:[''],
      present2: [false]
    });
  }
  get EducationFormArray(): FormArray {
    return this.visualisationForm.get('Education') as FormArray;
  }
  removeEducationSection(index: number) {
    const historiqueControl = this.visualisationForm.get('Education') as FormArray;
    historiqueControl.removeAt(index);
  }
  addCompetencesSection(): void {
    const historiqueArray = this.visualisationForm.get('Competences') as FormArray;
    historiqueArray.push(this.createHistoriqueSection());
  }
  createCompetencesSection(): FormGroup {
    return this.formBuilder.group({
      titre_comp:['']
    });
  }
  get CompetencesFormArray(): FormArray {
    return this.visualisationForm.get('Competences') as FormArray;
  }
  removeCompetenceSection(index: number) {
    const historiqueControl = this.visualisationForm.get('Competences') as FormArray;
    historiqueControl.removeAt(index);
  }
  addLanguesSection(): void {
    const historiqueArray = this.visualisationForm.get('Langues') as FormArray;
    historiqueArray.push(this.createHistoriqueSection());
  }
  createLanguesSection(): FormGroup {
    return this.formBuilder.group({
      titre_langue:[''],
      niveaulang:['']
    });
  }
  get LanguesFormArray(): FormArray {
    return this.visualisationForm.get('Langues') as FormArray;
  }
  removeLanguesSection(index: number) {
    const historiqueControl = this.visualisationForm.get('Langues') as FormArray;
    historiqueControl.removeAt(index);
  }
  addCertificatsSection(): void {
    const historiqueArray = this.visualisationForm.get('Certificats') as FormArray;
    historiqueArray.push(this.createHistoriqueSection());
  }
  createCertificatsSection(): FormGroup {
    return this.formBuilder.group({
      titre_certificat:[''],
      dateCert:['']
    });
  }
  get CertificatsFormArray(): FormArray {
    return this.visualisationForm.get('Certificats') as FormArray;
  }
  removeCertificatsSection(index: number) {
    const historiqueControl = this.visualisationForm.get('Certificats') as FormArray;
    historiqueControl.removeAt(index);
  }
}

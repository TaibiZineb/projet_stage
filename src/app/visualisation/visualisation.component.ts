import { Component,OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { createClient} from '@supabase/supabase-js';
import { map, startWith} from 'rxjs/operators';
import { Resume } from'../model/user.model'; 
@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.css']
})
export class VisualisationComponent implements OnInit{
  visualisationForm!: FormGroup;
  supabaseUrl!: string;
  supabaseKey!: string;
  supabase: any;
  submittedData: any = {};
  skillsData: any[] = [];
  currentSectionIndex: number = 0;
  isDataSubmitted: boolean = false;
  dateFinValues: string[] = [];
  dateFinControls: { date: FormControl, present: FormControl }[] = [];
  dateFinValuesHistorique: string[] = [''];
  dateFinValuesEducations: string[] = [''];

  presentControls: FormControl[] = [];
  constructor(private formBuilder: FormBuilder){
    this.supabaseUrl = 'https://mljtanxsvdnervhrjnbs.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY';
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    this.dateFinValuesHistorique = [];
    this.dateFinValues = ['', ''];
  }
  resume: Resume = {
    CandidateDetails: {
      FirstName: '',
      LastName: '',
      Email: '',
      role: '',
      position: 'relative'
    },
    historiques: {
      Position: [],
    },
    Educations: {
      Education: [],
    },
    Langues: {
      Langue: [],
    },
    certifications: {
      Certification: [],
    },
    Competences: {
      TopSkills: [],
    },
    OriginalCv: '',
  };
  ngOnInit(): void {
    this.skillsData = [
      { key: 'COMP1', value: 'Description 1' },
      { key: 'COMP2', value: 'Description 2' },
    ];
    
    const telephonePattern = /^\d{4}\.\d{3}\.\d{3}$/;
    this.visualisationForm = this.formBuilder.group({
      CandidateDetails: this.formBuilder.group({
        FirstName: ['',Validators.required],
        LastName: ['',Validators.required],
        Email: ['',Validators.email],
        telephone: ['',Validators.pattern(telephonePattern)],
        role: ['',Validators.required],
        Anneesexperience: ['']
      }),
      FirstName: ['',Validators.required],
      LastName: ['',Validators.required],
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
      DatefinF:[''],
      titre_comp:[''],
      titre_certificat:[''],
      DateCert:[''],
      titre_langue:[''],
      niveaulang:[''],
      historique: this.formBuilder.array([this.createHistoriqueSection()]),
      Educations:  this.formBuilder.array([this.createEducationsSection()]),
      Competences: this.formBuilder.array([this.createCompetencesSection()]),
      Langues:this.formBuilder.array([this.createLanguagesSection()]),
      Certificats:this.formBuilder.array([this.createCertificatsSection()]),
    });
    this.visualisationForm.get('present2')?.valueChanges.subscribe((value) => {
      const villeEControl = this.visualisationForm.get('Education.0.VilleE');
      if (value) {
        villeEControl?.disable();
      } else {
        villeEControl?.enable();
      }
    });
    this.visualisationForm.get('present1')?.valueChanges.subscribe((value) => {
      if (value) {
        this.visualisationForm.get('Datefin')?.setValue(null);
        this.visualisationForm.get('Datefin')?.disable();
      } else {
        this.visualisationForm.get('Datefin')?.enable();
      }
    });
    console.log('Initial form values:', this.visualisationForm.value);
  }
  onSubmit(): void {
    console.log('Submitting form data:', this.visualisationForm.value);
    const historiqueArray = this.visualisationForm.get('historique') as FormArray;
    historiqueArray.controls.forEach((control: AbstractControl, index: number) => {
      const presentControl = control.get('present1') as FormControl;
      const dateFinControl = control.get('Datefin') as FormControl;
      if (presentControl.value) {
        dateFinControl.setValue('jusqu\'à présent');
      } else {
        const dateFinValue = this.dateFinValuesHistorique[index] || null;
        dateFinControl.setValue(dateFinValue);
      }
    });
    this.dateFinValues[0] = this.isDateFinChecked(1) ? 'jusqu\'à présent' : this.visualisationForm.get('Datefin')?.value;
    this.dateFinValues[1] = this.isDateFinChecked(2) ? 'jusqu\'à présent' : this.visualisationForm.get('DatefinF')?.value;
  
    this.submittedData = this.visualisationForm.value;
    this.resume.CandidateDetails = this.visualisationForm.get('CandidateDetails')?.value;
    this.resume.historiques.Position = this.visualisationForm.get('historique')?.value;
    this.resume.Educations.Education = this.visualisationForm.get('Educations')?.value;
    this.resume.Competences.TopSkills = this.visualisationForm.get('Competences')?.value;
    this.resume.Langues.Langue = this.visualisationForm.get('Langues')?.value;
    this.resume.certifications.Certification = this.visualisationForm.get('Certificats')?.value;
    this.isDataSubmitted = true;
  }
  
  onDateInput(event: Event, fieldName: string, section: number): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    const formattedDate = this.formatDateToMonthYear(inputValue);
    this.visualisationForm.get(fieldName)?.setValue(formattedDate, { emitEvent: false });
    const presentControl = this.visualisationForm.get(`present${section}`);
    if (inputValue) {
      presentControl?.disable();
      presentControl?.setValue(false);
    } else {
      presentControl?.enable();
    }
  }
  
  updateEndDateOptions(fieldName: string, section: number): void {
    console.log(`updateEndDateOptions called for ${fieldName}`);
    const dateDebutValue = this.visualisationForm.get(fieldName)?.value;
    const dateFinControl = this.visualisationForm.get(`Datefin${section}`);
    const dateDebut = new Date(dateDebutValue);
    const dateFin = dateFinControl?.value ? new Date(dateFinControl.value) : null;
    console.log('Date de début (updateEndDateOptions):', dateDebutValue);
    console.log('Date de fin (updateEndDateOptions):', dateFinControl?.value);
    if (dateFinControl && dateFinControl.enabled && !this.isDateFinChecked(section)) {
      const today = new Date();
      if (dateFin && (dateFin < dateDebut || dateFin > today)) {
        dateFinControl.patchValue('');
      } else {
        console.log('Valid date');
        const dateDebutFormatted = this.formatDateToMonthYear(dateDebutValue);
        const dateFinFormatted = dateFin ? this.formatDateToMonthYear(dateFinControl.value) : '';
        dateFinControl.patchValue(dateFinFormatted, { emitEvent: false });
        dateFinControl.disable({ onlySelf: true, emitEvent: false });
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
          dateFinControl.patchValue(options, { emitEvent: false });
        });
      }
    }
    this.visualisationForm.get(`present${section}`)?.enable();
  }
  formatDateToMonthYear(dateStr: string): string {
    const date = new Date(dateStr);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }
  toggleDateFin(section: number): void {
    const dateFinControlName = section === 1 ? 'Datefin' : 'DatefinF';
    const dateFinControl = this.visualisationForm.get(dateFinControlName) as FormControl;
    const presentControl = this.visualisationForm.get(`present${section}`) as FormControl;
  
    if (presentControl) {
      if (presentControl.value) {
        dateFinControl.patchValue('jusqu\'à présent');
        dateFinControl.disable({ onlySelf: true, emitEvent: false });
      } else {
        dateFinControl.enable({ onlySelf: true, emitEvent: false });
        dateFinControl.patchValue('');
      }
      this.updateEndDateOptions(`Datedebut${section}`, section);
    }
  }
  isDateFinChecked(section: number): boolean {
    return this.visualisationForm.get(`present${section}`)?.value === true;
  }
  
  isDateFinDisabled(section: number): boolean {
    return this.visualisationForm.get(`present${section}`)?.value === true;
  }
  getMinimumDate(fieldName: string): string | null {
    const dateDebutValue = this.visualisationForm.get(fieldName)?.value;
    return dateDebutValue ? this.formatDateToMonthYear(dateDebutValue) : null;
  }
  getMaximumDate(fieldName: string): string {
    const today = new Date();
    return this.formatDateToMonthYear(today.toISOString());
  }
  addHistoriqueSection(): void {
    const historiqueArray = this.visualisationForm.get('historique') as FormArray;
    historiqueArray.push(this.createHistoriqueSection());
    this.dateFinValuesHistorique.push(''); 
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
  addEducationsSection():void{
    console.log('Adding education section');
    const EducationsArray = this.visualisationForm.get('Educations') as FormArray;
    EducationsArray.push(this.createEducationsSection());
    this.dateFinValuesEducations.push('');
  }
  createEducationsSection(): FormGroup {
    return this.formBuilder.group({
      Nom_ecole:[''],
      Diplome:[''],
      VilleE:[''],
      DatedebutF:[''],
      DatefinF:[''],
      present2: [false]
    });
  }
  get EducationsFormArray(): FormArray {
    return this.visualisationForm.get('Educations') as FormArray;
  }
  removeEducationsSection(index: number) {
    const EducationsControl = this.visualisationForm.get('Educations') as FormArray;
    EducationsControl.removeAt(index);
  }
  addCompetencesSection(): void {
    const CompetencesArray = this.visualisationForm.get('Competences') as FormArray;
    CompetencesArray.push(this.createCompetencesSection());
  }
  createCompetencesSection(): FormGroup {
    return this.formBuilder.group({
      titre_comp:['']
    });
  }
  get CompetencesFormArray(): FormArray {
    return this.visualisationForm.get('Competences') as FormArray;
  }
  removeCompetencesSection(index: number) {
    const CompetencesControl = this.visualisationForm.get('Competences') as FormArray;
    CompetencesControl.removeAt(index);
  }
  addLanguagesSection(): void {
    const LanguagesArray = this.visualisationForm.get('Langues') as FormArray;
    LanguagesArray.push(this.createLanguagesSection());
  }
  createLanguagesSection(): FormGroup {
    return this.formBuilder.group({
      titre_langue:[''],
      niveaulang:['']
    });
  }
  get LanguagesFormArray(): FormArray {
    return this.visualisationForm.get('Langues') as FormArray;
  }
  removeLanguagesSection(index: number) {
    const LanguagesControl = this.visualisationForm.get('Langues') as FormArray;
    LanguagesControl.removeAt(index);
  }
  addCertificatsSection(): void {
    const CertificatsArray = this.visualisationForm.get('Certificats') as FormArray;
    CertificatsArray.push(this.createCertificatsSection());
  }
  createCertificatsSection(): FormGroup {
    return this.formBuilder.group({
      titre_certificat:[''],
      DateCert:['']
    });
  }
  get CertificatsFormArray(): FormArray {
    return this.visualisationForm.get('Certificats') as FormArray;
  }
  removeCertificatsSection(index: number) {
    const CertificatsControl = this.visualisationForm.get('Certificats') as FormArray;
    CertificatsControl.removeAt(index);
  }
}
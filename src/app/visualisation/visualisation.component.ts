import { Component,OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { createClient} from '@supabase/supabase-js';
import { map, startWith} from 'rxjs/operators';
import { Resume } from'../model/user.model'; 
import { data } from '../model/extractedData';
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
  isDataSubmitted: boolean = false;
  dateFinValues: string[] = [];
  dateFinControls: { date: FormControl, present: FormControl }[] = [];
  presentControls: FormControl[] = [];
  dateFinValuesHistorique: string[] = [];
  dateFinValueseducations: string[] = [];
  constructor(private formBuilder: FormBuilder){
    this.supabaseUrl = 'https://mljtanxsvdnervhrjnbs.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY';
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
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
    console.log('Data from extractedData.ts:', data);
    const positions = data.historiques.Position;
    this.visualisationForm = this.formBuilder.group({
      CandidateDetails: this.formBuilder.group({
        FirstName: [data.candidateDetails.FirstName,[Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        LastName: [data.candidateDetails.LastName,[Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        Email: [data.candidateDetails.Email,[Validators.required, Validators.email]],
        telephone: [data.candidateDetails.telephone],
        role: [data.candidateDetails.role,Validators.required],
        Anneesexperience: [data.candidateDetails.Anneesexperience]
      }),
      historiques: this.formBuilder.group({
        Position: this.formBuilder.array([]) 
      }),
      Nomentreprise: [data.historiques.Position[0].Nomentreprise,Validators.required,],
      Intituleposte: [data.historiques.Position[0].Intituleposte,Validators.required,],
      Datedebut: [data.historiques.Position[0].Datedebut,Validators.required],
      Datefin: [data.historiques.Position[0].Datefin],
      description: [''],
      present1: [false],
      Nom_ecole:[data.Educations.Education[0].Nom_ecole],
      Diplome:[data.Educations.Education[0].Diplome],
      VilleE:[data.Educations.Education[0].VilleE],
      DatedebutF:[data.Educations.Education[0]["DatedebutF"]],
      DatefinF:[data.Educations.Education[0]["DatefinF"]],
      titre_comp:[data.Competences.TopSkills[0].titre_comp],
      titre_certificat:[data.Certifications.Certification[0].titre_certificat],
      DateCert:[data.Certifications.Certification[0].DateCert],
      titre_langue:[data.Langues.Langue[0].titre_langue],
      niveaulang:[data.Langues.Langue[0].niveaulang],
      present2: [false],
      historique: this.formBuilder.array([this.createHistoriqueSection(data.historiques.Position[0])]),
      Educations:  this.formBuilder.array([this.createEducationsSection(data.Educations.Education[0])]),
      Competences: this.formBuilder.array([this.createCompetencesSection(data.Competences.TopSkills[0].titre_comp)]),
      Langues:this.formBuilder.array([this.createLanguagesSection(data.Langues.Langue[0])]),
      Certificats:this.formBuilder.array([this.createCertificatsSection(data.Certifications.Certification[0])]),
    });
    this.visualisationForm.get('present2')?.valueChanges.subscribe((value) => {
      const dateFinFControl = this.visualisationForm.get('Educations.0.DatefinF');
      if (value) {
        dateFinFControl?.setValue(null);
        dateFinFControl?.disable();
      } else {
        dateFinFControl?.enable();
      }
    });

    this.visualisationForm.get('present1')?.valueChanges.subscribe((value) => {
      const dateFinControl = this.visualisationForm.get('Datefin');
      if (value) {
        dateFinControl?.setValue(null);
        dateFinControl?.disable();
      } else {
        dateFinControl?.enable();
      }
    });
    this.visualisationForm.get('present2')?.valueChanges.subscribe((value) => {
      const dateFinFControl = this.visualisationForm.get('Educations.0.DatefinF');
      if (value) {
        dateFinFControl?.setValue(null);
        dateFinFControl?.disable();
      } else {
        dateFinFControl?.enable();
      }
    });
    const historiquesArray = this.visualisationForm.get('historique') as FormArray;
    for (let i = 1; i < data.historiques.Position.length; i++) {
      const historiqueSection = this.createHistoriqueSection(data.historiques.Position[i]);
      historiquesArray.push(historiqueSection);
    }
    const educationsArray = this.visualisationForm.get('Educations') as FormArray;
    for (let i = 1; i  < data.Educations.Education.length; i++ ){
      const educationSection = this.createEducationsSection(data.Educations.Education[i]);
      educationsArray.push(educationSection);
    }
    const CompetencesArray = this.visualisationForm.get('Competences') as FormArray;
    for (let i = 1; i < data.Competences.TopSkills.length; i++) { 
      const competenceSection = this.createCompetencesSection(data.Competences.TopSkills[i].titre_comp);
      CompetencesArray.push(competenceSection);
    }
    const languesArray = this.visualisationForm.get('Langues') as FormArray;
    for (let i = 1; i  < data.Langues.Langue.length; i++){
      const langueSection = this.createLanguagesSection(data.Langues.Langue[i]);
      languesArray.push(langueSection);
    }
    const certificatsArray = this.visualisationForm.get('Certificats') as FormArray;
    for(let i = 1;i < data.Certifications.Certification.length; i++ ){
      const certificatSection = this.createCertificatsSection(data.Certifications.Certification[i]);
      certificatsArray.push(certificatSection);
    }
    console.log('Initial form values:', this.visualisationForm.value);
  }
  onSubmit(): void {
    console.log('Submitting form data:', this.visualisationForm.value);
    
    if (this.visualisationForm.invalid) {
      this.markFormGroupTouched(this.visualisationForm);
      return;
    }
  
    // Mise à jour des valeurs pour les sections historiques
    this.visualisationForm.get('historique')?.value.forEach((position: any, index: number) => {
      this.dateFinValuesHistorique[index] = this.isDateFinChecked(1) ? 'jusqu\'à présent' : position.Datefin;
    });
  
    // Mise à jour des valeurs pour les sections d'éducation
    this.visualisationForm.get('Educations')?.value.forEach((education: any, index: number) => {
      this.dateFinValueseducations[index] = this.isDateFinChecked(2) ? 'jusqu\'à présent' : education.DatefinF;
    });
  
    // Mise à jour des valeurs pour les dates finales
    this.dateFinValues[0] = this.isDateFinChecked(1) ? 'jusqu\'à présent' : this.visualisationForm.get('Datefin')?.value;
    this.dateFinValues[1] = this.isDateFinChecked(2) ? 'jusqu\'à présent' : this.visualisationForm.get('Educations.0.DatefinF')?.value;
  
    // Mise à jour des données soumises
    this.submittedData = this.visualisationForm.value;
    this.resume.CandidateDetails = this.visualisationForm.get('CandidateDetails')?.value;
    this.resume.historiques.Position = this.visualisationForm.get('historique')?.value;
    this.resume.Educations.Education = this.visualisationForm.get('Educations')?.value;
    this.resume.Competences.TopSkills = this.visualisationForm.get('Competences')?.value;
    this.resume.Langues.Langue = this.visualisationForm.get('Langues')?.value;
    this.resume.certifications.Certification = this.visualisationForm.get('Certificats')?.value;
  
    console.log('Final form data:', this.submittedData);
    console.log('Resume:', this.resume);
  
    this.isDataSubmitted = true;
  }

  onDateInput(event: Event, fieldName: string, section: number): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    if (inputValue) {  
      const formattedDate = this.formatDateToMonthYear(inputValue);
      this.visualisationForm.get(fieldName)?.setValue(formattedDate, { emitEvent: false });
    } else {
      this.visualisationForm.get(fieldName)?.setValue(null, { emitEvent: false });
    }
    const presentControl = this.visualisationForm.get(`present${section}`);
    if (inputValue) {
      presentControl?.disable();
      presentControl?.setValue(false);
    } else {
      presentControl?.enable();
    }
  }
  updateEndDateOptions(fieldName: string, section: number): void {
    const dateDebutValue = this.visualisationForm.get(fieldName)?.value;
    const dateFinControl = this.visualisationForm.get(`Datefin${section}`);
    const dateDebut = new Date(dateDebutValue);
    const dateFin = dateFinControl?.value ? new Date(dateFinControl.value) : null;
    if (dateFinControl && dateFinControl.enabled && !this.isDateFinChecked(section)) {
      const today = new Date();
      if (dateFin && (dateFin < dateDebut || dateFin > today)) {
        dateFinControl.patchValue('');
      } else {
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
    const dateFinControlName = section === 1 ? 'Datefin' : 'DatefinF';
    const presentControl = this.visualisationForm.get(`present${section}`);
    const dateFinControl = this.visualisationForm.get(dateFinControlName);
    if (presentControl === null || dateFinControl === null) {
      return false; 
    }
    return presentControl?.value === true || dateFinControl?.disabled;
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
  }
  createHistoriqueSection(position: any = {}): FormGroup {
    const formattedDateDebut = this.formatDateToMonthYear(position.Datedebut);
    const formattedDateFin = this.formatDateToMonthYear(position.Datefin);
    return this.formBuilder.group({
      Nomentreprise: [position.Nomentreprise || '', Validators.required,],
      Intituleposte: [position.Intituleposte || '',Validators.required,],
      Datedebut: [formattedDateDebut, Validators.required],
      Datefin: [formattedDateFin],
      present1: [position.dateFin === 'jusqu\'à présent'],
      description: [position.Description || '']
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
    const EducationsArray = this.visualisationForm.get('Educations') as FormArray;
    EducationsArray.push(this.createEducationsSection());
  }
  createEducationsSection(educationData?: any): FormGroup {
    const formattedDateDebutF = this.formatDateToMonthYear(educationData.DatedebutF);
    const formattedDateFinF = this.formatDateToMonthYear(educationData.DatefinF);
    return this.formBuilder.group({
      Nom_ecole: [educationData ? educationData.Nom_ecole : ''],
      Diplome: [educationData ? educationData.Diplome : ''],
      VilleE: [educationData ? educationData.VilleE : ''],
      DatedebutF: [educationData ? formattedDateDebutF : ''],
      DatefinF: [educationData ? formattedDateFinF  : ''],
      present2: [educationData && educationData.DatefinF === 'jusqu\'à présent']
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
  createCompetencesSection(competenceData?: any): FormGroup {
    return this.formBuilder.group({
      titre_comp: [competenceData || '']
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
  createLanguagesSection(langueData: any = {}): FormGroup {
    return this.formBuilder.group({
      titre_langue: [langueData.titre_langue || ''],
      niveaulang: [langueData.niveaulang || '']
    });
  }
  get LanguagesFormArray(): FormArray {
    return this.visualisationForm.get('Langues') as FormArray;
  }
  removeLanguagesSection(index: number) {
    const LanguagesControl = this.visualisationForm.get('Langues') as FormArray;
    LanguagesControl.removeAt(index);
  }
  addCertificatsSection(certification: any = {}): void {
    const CertificatsArray = this.visualisationForm.get('Certificats') as FormArray;
    CertificatsArray.push(this.createCertificatsSection(certification));
  }
  createCertificatsSection(certification: any = {}): FormGroup {
    const formattedDateCert = this.formatDateToMonthYear(certification.DateCert);
    return this.formBuilder.group({
      titre_certificat: [certification.titre_certificat || ''],
      DateCert: [formattedDateCert || '']
    });
  }
  get CertificatsFormArray(): FormArray {
    return this.visualisationForm.get('Certificats') as FormArray;
  }
  removeCertificatsSection(index: number) {
    const CertificatsControl = this.visualisationForm.get('Certificats') as FormArray;
    CertificatsControl.removeAt(index);
  }
  markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
  
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }
}
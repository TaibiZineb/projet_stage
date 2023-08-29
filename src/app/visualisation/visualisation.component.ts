import { Component,OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { createClient} from '@supabase/supabase-js';
import { Resume,ParsedResume } from'../model/user.model'; 
import { ActivatedRoute } from '@angular/router';
import { CvParserService } from '../services/cv-parser.service';
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
  dateFinValuesHistorique: string[] = [];
  dateFinValueseducations: string[] = [];
  showSubmittedData: boolean = false;
  fileName: string = '';
 
  parsedResumeJSON: string = '';
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private cvParserService: CvParserService ){
    this.supabaseUrl = 'https://mljtanxsvdnervhrjnbs.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY';
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    this.dateFinValues = ['', ''];
  }
  resume: Resume = {
    CandidateDetails: {
      firstName: '',
      lastName: '',
      candidateEmail: '',
      jobPosition: '',
      candidateNum:'',
      position: 'relative'},
    historiques: [],
    Educations: {
      Education: [],},
    Langues: {
      Langue: [],},
    certifications: {
      Certification: [],},
    Competences: {
      TopSkills: [],},
    OriginalCv: '',
  };
  parsedResume: ParsedResume = {
    candidateName: '', 
    firstName: '',
    lastName: '',
    candidateEmail: '',
    candidateNum: '',
    role: '',
    jobposition: '',
    competences: '',
    postalAddress: '',
    educationBackground: '',
    certifications: '',
    skills: '',
    experience: '',
    Langues: '',
  };
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      this.fileName = params['fileName'];
      const fileInput = document.querySelector('.file-upload-input') as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        try {
          const base64File = await this.cvParserService.encodeFileToBase64(file);
          this.parsedResume = await this.cvParserService.parseResume(base64File);
          
          this.visualisationForm = this.formBuilder.group({
            CandidateDetails: this.formBuilder.group({
              lastName: [this.parsedResume.candidateName.split(' ')[0], [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
              firstName: [this.parsedResume.candidateName.split(' ')[1], [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
              candidateEmail: [this.parsedResume.candidateEmail, [Validators.required, Validators.email]],
              candidateNum: [this.parsedResume.candidateNum],
              role: [this.parsedResume.role, Validators.required],
              Anneesexperience: [''],
              
            }),
            

            historique: this.formBuilder.group({
              Nomentreprise: ['', Validators.required],
              Intituleposte: ['', Validators.required],
              Datedebut: ['', Validators.required],
              Datefin: [''],
              Description: [''],
              present1: [false],
            }),
          
            Educations:this.formBuilder.group({
              Education: this.formBuilder.array([]), 
            }),
            Competances:this.formBuilder.group({
              competance:this.formBuilder.array([])
            }),
            Langues:this.formBuilder.group({

            }),
            certifications:this.formBuilder.group({

            })
          });
        } catch (error) {
          console.error('Erreur lors de l\'encodage ou de l\'analyse du fichier :', error);
        }
      }
    });

    
    this.visualisationForm.get('present2')?.valueChanges.subscribe((value) => {
      this.updateEndDateOptions('DatefinF', 2);
    });
    this.visualisationForm.get('present1')?.valueChanges.subscribe((value) => {
      this.updateEndDateOptions('Datefin', 1);
    });
    const historiquesArray = this.visualisationForm.get('historique') as FormArray;
    for (let i = 1; i < data.historiques.Position.length; i++) {
      const historiqueSection = this.createHistoriqueSection(data.historiques.Position[i]);
      historiquesArray.push(historiqueSection);
    }
    const educationsArray = this.visualisationForm.get('Educations') as FormArray;
    for (let i = 1; i < data.Educations.Education.length; i++) {
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
    console.log('Valeurs initiales du formulaire :', this.visualisationForm.value);
    this.visualisationForm.get('historique')?.value.forEach((position: any, index: number) => {
      this.dateFinValuesHistorique[index] = this.isDateFinCheckedForHistorique(1) ? 'jusqu\'à présent' : position.Datefin;
    });
    this.visualisationForm.get('Educations')?.value.forEach((education: any, index: number) => {
      this.dateFinValueseducations[index] = this.isDateFinCheckedForEducations(2) ? 'jusqu\'à présent' : education.DatefinF;
    });
    this.dateFinValues[0] = this.isDateFinCheckedForHistorique(1) ? "jusqu'à présent" : ''; 
    const historiqueArray = this.visualisationForm.get('historique') as FormArray;
    historiqueArray.controls.forEach((control, index) => {
      const dateFinControl = control.get('Datefin');
      if (dateFinControl) {
        this.dateFinValuesHistorique[index] = this.isDateFinCheckedForHistorique(1) ? "jusqu'à présent" : dateFinControl.value;
      }
    });
    educationsArray.controls.forEach((control, index) => {
      const dateFinFControl = control.get('DatefinF');
      if (dateFinFControl) {
        this.dateFinValueseducations[index] = this.isDateFinCheckedForEducations(2) ? "jusqu'à présent" : dateFinFControl.value;
      }
    });
    this.submittedData = this.visualisationForm.value;
    this.resume.CandidateDetails = this.visualisationForm.get('CandidateDetails')?.value;
    this.resume.historiques= this.visualisationForm.get('historique')?.value;
    this.resume.Educations.Education = this.visualisationForm.get('Educations')?.value;
    this.resume.Competences.TopSkills = this.visualisationForm.get('Competences')?.value;
    this.resume.Langues.Langue = this.visualisationForm.get('Langues')?.value;
    this.resume.certifications.Certification = this.visualisationForm.get('Certificats')?.value;
    console.log('Données finales du formulaire :', this.submittedData);
    console.log('Resume:', this.resume);
    this.isDataSubmitted = true;
    this.isDataSubmitted = true;
    this.showSubmittedData = true;
  }
  onSubmit(): void {
    if (this.visualisationForm.invalid) {
      this.markFormGroupTouched(this.visualisationForm);
      alert('Veuillez corriger les erreurs dans le formulaire avant de soumettre.');
      return;
    }
    this.visualisationForm.get('historique')?.value.forEach((position: any, index: number) => {
      this.dateFinValuesHistorique[index] = this.isDateFinCheckedForHistorique(1) ? 'jusqu\'à présent' : position.Datefin;
    });
    this.visualisationForm.get('Educations')?.value.forEach((education: any, index: number) => {
      this.dateFinValueseducations[index] = this.isDateFinCheckedForEducations(2) ? 'jusqu\'à présent' : education.DatefinF;
    });
    this.dateFinValues[0] = this.isDateFinCheckedForHistorique(1) ? "jusqu'à présent" : ''; 
    const historiqueArray = this.visualisationForm.get('historique') as FormArray;
    historiqueArray.controls.forEach((control, index) => {
      const dateFinControl = control.get('Datefin');
      if (dateFinControl) {
        this.dateFinValuesHistorique[index] = this.isDateFinCheckedForHistorique(1) ? "jusqu'à présent" : dateFinControl.value;
      }
    });
    const educationsArray = this.visualisationForm.get('Educations') as FormArray;
    educationsArray.controls.forEach((control, index) => {
      const dateFinFControl = control.get('DatefinF');
      if (dateFinFControl) {
        this.dateFinValueseducations[index] = this.isDateFinCheckedForEducations(2) ? "jusqu'à présent" : dateFinFControl.value;
      }
    });
    this.submittedData = this.visualisationForm.value;
    this.resume.CandidateDetails = this.visualisationForm.get('CandidateDetails')?.value;
    this.resume.historiques= this.visualisationForm.get('historique')?.value;
    this.resume.Educations.Education = this.visualisationForm.get('Educations')?.value;
    this.resume.Competences.TopSkills = this.visualisationForm.get('Competences')?.value;
    this.resume.Langues.Langue = this.visualisationForm.get('Langues')?.value;
    this.resume.certifications.Certification = this.visualisationForm.get('Certificats')?.value;
    console.log('Final form data:', this.submittedData);
    console.log('Resume:', this.resume);
    this.isDataSubmitted = true;
    this.isDataSubmitted = true;
    this.showSubmittedData = true;
  }
  onDateInput(event: Event, fieldName: string, section: number): void {
    console.log('Date input event:', event);
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    if (inputValue) {  
      const formattedDate = this.formatDateToMonthYear(inputValue);
      this.visualisationForm.get(fieldName)?.setValue(formattedDate, { emitEvent: false });
    } else {
      this.visualisationForm.get(fieldName)?.setValue(null, { emitEvent: false });
    }

  }
  updateEndDateOptions(fieldName: string, section: number): void {
    const dateFinControl = this.visualisationForm.get(fieldName) as FormControl;
    if (dateFinControl && dateFinControl.enabled) {
      if (this.isDateFinCheckedForHistorique(section)) {
        dateFinControl.patchValue("jusqu'à présent");
      } else {
        dateFinControl.patchValue('');
      }
    }
  }
  formatDateToMonthYear(dateStr: string): string {
    const date = new Date(dateStr);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }
  toggleDateFin(sectionIndex: number): void {
    const dateFinControl = this.historiqueFormArray.at(sectionIndex).get('Datefin') as FormControl;
    const present1Control = this.historiqueFormArray.at(sectionIndex).get('present1') as FormControl;
    
    if (present1Control) {
      if (present1Control.value) {
        dateFinControl?.disable();
        dateFinControl?.setValue(null);
      } else {
        dateFinControl?.enable();
      }
    }
  }
  toggleDateFinEducations(sectionIndex: number): void {
    const dateFinFControl = this.EducationsFormArray.at(sectionIndex).get('DatefinF') as FormControl;
    const present2Control = this.EducationsFormArray.at(sectionIndex).get('present2') as FormControl;
    if (present2Control) {
      if (present2Control.value) {
        dateFinFControl?.setValue("jusqu'à présent"); 
        dateFinFControl?.disable(); 
      } else {
        dateFinFControl?.setValue(''); 
        dateFinFControl?.enable(); 
      }
    }
  }
  isDateFinCheckedForEducations(section: number): boolean {
    const educationsArray =this.visualisationForm.get('Educations') as FormArray;
    if(educationsArray && educationsArray.controls[section]){
      const educationsControl = educationsArray.at(section).get('present2') as FormControl;
      return educationsControl?.value === true;
    }
    return false;
  }
  isDateFinCheckedForHistorique(section: number): boolean {
    const historiqueArray = this.visualisationForm.get('historique') as FormArray;
    if (historiqueArray && historiqueArray.controls[section]) {
      const historiqueControl = historiqueArray.at(section).get('present1') as FormControl;
      return historiqueControl?.value === true;
    }
    return false;
  }
  isDateFinEducationDisabled(sectionIndex: number): boolean {
    const dateFinFControl = this.EducationsFormArray.at(sectionIndex).get('DatefinF');
    const present2Control = this.EducationsFormArray.at(sectionIndex).get('present2');
    
    if (present2Control?.value) {
      dateFinFControl?.disable();
      return true;
    } else {
      dateFinFControl?.enable();
      return false;
    }
  }
  isDateFinDisabled(sectionIndex: number): boolean {
    const dateFinControl = this.historiqueFormArray.at(sectionIndex).get('Datefin');
    const present1Control = this.historiqueFormArray.at(sectionIndex).get('present1');
    
    if (present1Control?.value) {
      dateFinControl?.disable();
      return true;
    } else {
      dateFinControl?.enable();
      return false;
    }
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
  const isPresent1 = position && position.Datefin === "jusqu'à présent";
    return this.formBuilder.group({
      Nomentreprise: [position.Nomentreprise || '', Validators.required,],
      Intituleposte: [position.Intituleposte || '',Validators.required,],
      Datedebut: [formattedDateDebut, Validators.required],
      Datefin: [isPresent1 ? "jusqu'à présent" : formattedDateFin],
      present1:[isPresent1],
      Description: [position.Description || '']
    });
  }
  get historiqueFormArray(): FormArray {
    return this.visualisationForm.get('historique') as FormArray;
  }
  removeHistoriqueSection(index: number) {
    const historiqueControl = this.visualisationForm.get('historique') as FormArray;
    historiqueControl.removeAt(index);
  }
  addEducationsSection(): void {
    console.log('Adding new education section');
    const educationSection = this.createEducationsSection();
    console.log('New education section:', educationSection.value);
    const educationsArray = this.visualisationForm.get('Educations') as FormArray;
    educationsArray.push(educationSection);
    console.log('Updated Educations array:', educationsArray.value);
  }
  createEducationsSection(educationData?: any): FormGroup {
    const formattedDateDebutF = educationData && educationData.DatedebutF ? this.formatDateToMonthYear(educationData.DatedebutF) : '';
    let formattedDateFinF = educationData && educationData.DatefinF ? this.formatDateToMonthYear(educationData.DatefinF) : '';
    const isPresent2 = educationData && educationData.DatefinF === "jusqu'à présent";
    if (isPresent2) {
      formattedDateFinF = "jusqu'à présent";
    }
    return this.formBuilder.group({
      Nom_ecole: [educationData ? educationData.Nom_ecole : '', Validators.required],
      Diplome: [educationData ? educationData.Diplome : '', Validators.required],
      VilleE: [educationData ? educationData.VilleE : ''],
      DatedebutF: [formattedDateDebutF],
      DatefinF: [formattedDateFinF],
      present2: [isPresent2]
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
      titre_langue: [langueData.titre_langue || '',Validators.required],
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
    const formattedDateCert = certification.DateCert ? this.formatDateToMonthYear(certification.DateCert) : '';
    return this.formBuilder.group({
      titre_certificat: [certification.titre_certificat || '', Validators.required],
      DateCert: [formattedDateCert]
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
  isFieldInvalid(fieldPath: string): boolean {
    const control = this.visualisationForm.get(fieldPath);
    return !!control?.invalid && (!!control?.dirty || !!control?.touched);
  }
  chunkArray(arr: any[], size: number) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }
}
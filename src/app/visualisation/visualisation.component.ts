import { Component,OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { createClient} from '@supabase/supabase-js';
import { Resume} from'../model/user.model'; 
import { ActivatedRoute } from '@angular/router';
import { CvParserService } from '../services/cv-parser.service';

@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.css']
})
export class VisualisationComponent implements OnInit{
  visualisationForm!: FormGroup;
  FirstName!:FormControl;
  LastName!:FormControl;
  Email!:string;
  telephone!:string;
  role!:string;
  Anneesexperience!:string;
  Nomentreprise!:string;
  Intituleposte!:string;
  Datedebut!:string;
  Datefin!:string;
  present1!:string;
  Description!:string;
  Nom_ecole!:string;
  Diplome!:string;
  VilleE!:string;
  DatedebutF!:string;
  DatefinF!:string;
  present2!:string;
  titre_comp!:string;
  titre_langue!:string;
  niveaulang!:string;
  titre_certificat!:string;
  DateCert!:string;
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
  extractedData: any;
  historiques!: FormArray;
  employmentHistoryData: any;
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private cvParserService: CvParserService ){
    this.supabaseUrl = 'https://mljtanxsvdnervhrjnbs.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY';
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    this.dateFinValues = ['', ''];
    this.historiques = this.formBuilder.array([]);
    this.visualisationForm = this.formBuilder.group({
      CandidateDetails: this.formBuilder.group({
        FirstName: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        LastName: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        Email: ['',[Validators.required, Validators.email]],
        telephone: [''],
        role: ['',Validators.required],
        Anneesexperience: ['']
      }),
      historiques:  this.formBuilder.array([]),
      Nomentreprise: ['',Validators.required,],
      Intituleposte: ['',Validators.required,],
      Datedebut: ['',Validators.required],
      Datefin: [''],
      Description: [''],
      present1: [false],
      Educations: this.formBuilder.array([]),
      Competences: this.formBuilder.array([]),
      Langues: this.formBuilder.array([]),
      Certificats: this.formBuilder.array([]),
      EmploymentHistory: this.formBuilder.group({
        Position: this.formBuilder.array([]) 
      }),
   
      Nom_ecole:['',Validators.required],
      Diplome:['',Validators.required],
      VilleE:[''],
      DatedebutF:[''],
      DatefinF:[''],
      titre_comp:[''],
      titre_certificat:['',Validators.required],
      DateCert:[''],

    });
  }
  resume: Resume = {
    CandidateDetails: {
      FirstName: '',
      LastName: '',
      Email: '',
      role: '',
      position: 'relative'
    },
    EmploymentHistory: {Positions: []},
    Educations: { Education: [],},
    Langues: {Langue: [],},
    certifications: {
      Certification: [],
    },
    Competences: {
      TopSkills: [],
    },
  
  };
  ngOnInit(): void {
    this.route.queryParams.subscribe(async (params) => {
      this.fileName = params['fileName'];
      console.log('File name:', this.fileName);
      const fileInput = document.querySelector('.file-upload-input') as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        console.log('Selected file:', file);
        try {
          const base64File = await this.cvParserService.encodeFileToBase64(file);
          const extractedData = await this.cvParserService.parseResume(base64File);
          console.log('Extracted data:', extractedData);
        
          if (extractedData && extractedData.ContactInformation) {
            console.log('Contact Information:', extractedData.ContactInformation);
            console.log('Employment History:', extractedData.EmploymentHistory);
            console.log('Skills Data:', extractedData.SkillsData);
        
            if (extractedData && extractedData.EmploymentHistory && extractedData.EmploymentHistory.Positions) {
              try {
                const resume = await this.cvParserService.fromSovren(extractedData);
                console.log('resume Object:', resume);
                this.initialization(resume); 
              } catch (error) {
                console.error('Erreur lors de la création de l\'objet resume :', error);
              }
            } else {
              console.warn('Les données ne contiennent pas d\'historique de poste, mais nous allons quand même initialiser le formulaire avec les autres données.');
              const resume = await this.cvParserService.fromSovren(extractedData);
              this.initialization(resume); 
            }
          } else {
            console.warn('ContactInformation is missing.');
          }
        } catch (error) {
          console.error('Error during file encoding or parsing:', error);
        }
      }
    });
  }
  getHistoriqueControls(): FormArray {
    return this.visualisationForm.get('historiques') as FormArray;
  }
  initialization(extractedData: any){
    console.log('initialization() function called.');
    this.initializeFormWithCVData(extractedData);
    this.addFormControlsToArrays(extractedData);
    console.log('Visualisation Form Data:', this.visualisationForm.value);
    this.visualisationForm.get('present2')?.valueChanges.subscribe((value) => {
      this.updateEndDateOptions('DatefinF', 2);
    });
      this.visualisationForm.get('present1')?.valueChanges.subscribe((value) => {
      this.updateEndDateOptions('Datefin', 1);
    });
   
    this.updateInitialDateValues('historiques', 'Datefin', this.dateFinValuesHistorique);
    this.updateInitialDateValues('Educations', 'DatefinF', this.dateFinValueseducations);
  }
  updateInitialDateValues(arrayName: string, controlName: string, dateValues: string[]) {
    const formArray = this.visualisationForm.get(arrayName) as FormArray;
    formArray.controls.forEach((control, index) => {
      const dateControl = formArray.at(index).get(controlName);
      if (dateControl) {
        dateValues[index] = this.isDateFinChecked(index, arrayName)
          ? 'jusqu\'à présent'
          : dateControl.value;
      }
    });
  }
  isDateFinChecked(index: number, arrayName: string): boolean {
    return this.visualisationForm.get(`${arrayName}.${index}.DateFinChecked`)?.value;
  }
  initializeFormWithCVData(extractedData: any) {
    console.log('Creating form controls with extracted data:', extractedData);
    if (!extractedData || !extractedData.EmploymentHistory || !extractedData.EmploymentHistory.Positions) {
      console.error('Extracted data is missing required properties.');
      return;
    }
      // Vérifier si extractedData existe
    if (!extractedData) {
      console.error('Extracted data is missing.');
      return;
    }

  // Vérifier si extractedData.ContactInformation existe
    if (!extractedData.ContactInformation) {
      console.error('ContactInformation is missing.');
      return;
    }
    if (!extractedData.ContactInformation.CandidateName) {
      console.error('CandidateName is missing.');
      return;
    }
    const EmploymentHistory = extractedData.EmploymentHistory;
  
    if (extractedData && extractedData.EmploymentHistory) {
      const positions = extractedData.EmploymentHistory.Positions;
      const historiqueArray = this.visualisationForm.get('historiques') as FormArray;
      positions.forEach((position: any) => {
        const EmploymentHistoryection = this.createEmploymentHistoryection(position);
        this.employmentHistoryData.Positions.push(EmploymentHistoryection);
      });
    } else {
      console.warn('Les données ne contiennent pas d\'historique de poste.');
    }
    

    const candidateDetails = extractedData.ContactInformation.CandidateName;
    const FirstName = candidateDetails.GivenName;
    const LastName = candidateDetails.FamilyName;
    const Email = extractedData.ContactInformation.EmailAddresses[0]; 
    const educations = extractedData.Education.Education;
    const Nom_ecole = extractedData.Educations.Education.Nom_ecole;
    const competences = extractedData.SkillsData;
    const langues = extractedData.Langues.Langue;
    const certifications = extractedData.certifications.Certification;
  
    this.visualisationForm.get('CandidateDetails.FirstName')?.setValue(FirstName);
    this.visualisationForm.get('CandidateDetails.LastName')?.setValue(LastName);
    this.visualisationForm.get('CandidateDetails.Email')?.setValue(Email);
    const EmploymentHistoryArray = this.visualisationForm.get('historiques') as FormArray;
    if (EmploymentHistory) {
      EmploymentHistory.forEach((historique: any) => {
        EmploymentHistoryArray.push(this.createEmploymentHistoryection(historique));
      });
    }
    this.visualisationForm.get('Nomentreprise')?.setValue(extractedData.EmploymentHistory.Positions.Nomentreprise);
  }
  addFormControlsToArrays(extractedData: any): void{
    this.addEmploymentHistoryToForm(extractedData);
    this.addEducationsToForm(extractedData);
    this.addCompetencesToForm(extractedData);
    this.addLanguesToForm(extractedData);
    this.addCertificatsToForm(extractedData);
  }
 
  addEmploymentHistoryToForm(extractedData: any): void {
    const employmentHistory = extractedData.EmploymentHistory;
    if (employmentHistory && employmentHistory.Positions) {
      const positions = employmentHistory.Positions; 
      const employmentHistoryArray = this.visualisationForm.get('EmploymentHistory.Positions') as FormArray; // Accédez au FormArray correct ici
      positions.forEach((historique: any) => {
        const employmentHistorySection = this.createEmploymentHistoryection(historique);
        employmentHistoryArray.push(employmentHistorySection);
      });
    }
  }
  
  addEducationsToForm(extractedData: any): void {
    const educationsArray = this.visualisationForm.get('Educations.Education') as FormArray;
    const educations = extractedData.Educations;
    if (educations && educations.Education && educations.length > 0) {
      educations.forEach((education: any) => {
        const educationSection = this.createEducationsSection(education);
        educationsArray.push(educationSection);
      });
    }
  }
  addCompetencesToForm(extractedData: any): void {
    const competencesArray = this.visualisationForm.get('Competences') as FormArray;
    const competences = extractedData.Competences;
    if (competences && competences.TopSkills) {
      competences.forEach((competence: any) => {
        const competenceSection = this.createCompetencesSection(competence.titre_comp);
        competencesArray.push(competenceSection);
      });
    }
  }
  addLanguesToForm(extractedData: any): void {
    const languesArray = this.visualisationForm.get('Langues') as FormArray;
    const langues = extractedData.Langues;
    if (langues && langues.Langue) {
      langues.forEach((langue: any) => {
        const langueSection = this.createLanguagesSection(langue);
        languesArray.push(langueSection);
      });
    }
  }
  addCertificatsToForm(extractedData: any): void {
    const certificatsArray = this.visualisationForm.get('Certificats') as FormArray;
    const certificats = extractedData.certifications;
    if (certificats && certificats.Certification) {
      certificats.forEach((certificat: any) => {
        const certificatSection = this.createCertificatsSection(certificat);
        certificatsArray.push(certificatSection);
      });
    }
  }
  onSubmit(): void {
    console.log('Vérification du formulaire soumis :', this.visualisationForm);

    this.visualisationForm.get('historiques')?.value.forEach((position: any, index: number) => {
      this.dateFinValuesHistorique[index] = this.isDateFinCheckedForHistorique(1) ? 'jusqu\'à présent' : position.Datefin;
    });
    this.visualisationForm.get('Educations')?.value.forEach((education: any, index: number) => {
      this.dateFinValueseducations[index] = this.isDateFinCheckedForEducations(2) ? 'jusqu\'à présent' : education.DatefinF;
    });
    this.dateFinValues[0] = this.isDateFinCheckedForHistorique(1) ? "jusqu'à présent" : ''; 
    const historiqueArray = this.visualisationForm.get('historiques') as FormArray;
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
    this.resume.EmploymentHistory.Positions = this.visualisationForm.get('historiques')?.value;
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
    const educationFormArray = this.visualisationForm.get('Educations') as FormArray;
    const control = educationFormArray.at(section)?.get('present2');
    return control ? control.value === true : false;
  }
  
  isDateFinCheckedForHistorique(section: number): boolean {
    const historiqueFormArray = this.visualisationForm.get('historiques') as FormArray;
    const control = historiqueFormArray.at(section)?.get('present1');
    return control ? control.value === true : false;
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
  addEmploymentHistoryection(): void {
    const historiqueArray = this.visualisationForm.get('historiques') as FormArray;
    historiqueArray.push(this.createEmploymentHistoryection()); 
  }
  createEmploymentHistoryection(position: any = {}): FormGroup {
    const formattedDateDebut = this.formatDateToMonthYear(position.Datedebut) ;
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
    return this.visualisationForm.get('historiques') as FormArray;
  }
  removeEmploymentHistoryection(index: number) {
    const historiqueControl = this.visualisationForm.get('historiques') as FormArray;
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
  chunkArray(arr: any[], size: number) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }
} 
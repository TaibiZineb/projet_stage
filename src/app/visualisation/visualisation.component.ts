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
  fileName: string = '';
  isPresentChecked: boolean = false;
  position: any = {
    Datefin: '', 
  };
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
  
  };
  ngOnInit(): void {
    this.route.queryParams.subscribe(async params => {
      this.fileName = params['fileName'];
        console.log('File name:', this.fileName);
      const fileInput = document.querySelector('.file-upload-input') as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        console.log('Selected file:', file);
        try {
          const base64File = await this.cvParserService.encodeFileToBase64(file);
          console.log('Base64 encoded file:', base64File);
          const extractedData = await this.cvParserService.parseResume(base64File);
          console.log('Extracted data:', extractedData);
          if (extractedData) {
            
            this.cvParserService.fromSovren(extractedData)
            .then((resume:Resume)=>this.resume=resume);
          
          } else {
            console.error('Extracted data is missing required properties.');
          }
        } catch (error) {
          console.error('Error during file encoding or parsing:', error);
        }
      }
    });
  }
  
  toggleDateFin() {
    if (this.isPresentChecked) {
      this.position.Datefin = "Present";
    } else {
      // Si la case à cocher est décochée, réactivez le champ de date de fin.
      this.position.Datefin = ""; // Ou mettez la valeur souhaitée par défaut.
    }
  }
//   initialization(extractedData: any){
//     this.createFormControls(extractedData);
//     this.addFormControlsToArrays(extractedData);
//     console.log(typeof this.visualisationForm);
//     this.visualisationForm.get('present2')?.valueChanges.subscribe((value) => {
//       this.updateEndDateOptions('DatefinF', 2);
//     });
//     console.log(typeof this.visualisationForm);
//     this.visualisationForm.get('present2')?.valueChanges.subscribe((value) => {
//       this.updateEndDateOptions('DatefinF', 2);
//     });
//     this.visualisationForm.get('present1')?.valueChanges.subscribe((value) => {
//       this.updateEndDateOptions('Datefin', 1);
//     });
   
//     console.log('Valeurs initiales du formulaire :', this.visualisationForm.value);
//     this.visualisationForm.get('historique')?.value.forEach((position: any, index: number) => {
//       this.dateFinValuesHistorique[index] = this.isDateFinCheckedForHistorique(1) ? 'jusqu\'à présent' : position.Datefin;
//     });
//     this.visualisationForm.get('Educations')?.value.forEach((education: any, index: number) => {
//       this.dateFinValueseducations[index] = this.isDateFinCheckedForEducations(2) ? 'jusqu\'à présent' : education.DatefinF;
//     });
  
 
//     this.visualisationForm.get('present1')?.valueChanges.subscribe((value) => {
//       this.updateEndDateOptions('Datefin', 1);
//     });
   
//     console.log('Valeurs initiales du formulaire :', this.visualisationForm.value);
//     this.visualisationForm.get('historique')?.value.forEach((position: any, index: number) => {
//       this.dateFinValuesHistorique[index] = this.isDateFinCheckedForHistorique(1) ? 'jusqu\'à présent' : position.Datefin;
//     });
//     this.visualisationForm.get('Educations')?.value.forEach((education: any, index: number) => {
//       this.dateFinValueseducations[index] = this.isDateFinCheckedForEducations(2) ? 'jusqu\'à présent' : education.DatefinF;
//     });
//     this.dateFinValues[0] = this.isDateFinCheckedForHistorique(1) ? "jusqu'à présent" : ''; 
//     let historiqueArray = this.visualisationForm.get('historique') as FormArray;
//     historiqueArray.controls.forEach((control, index) => {
//       const dateFinControl = control.get('Datefin');
//       if (dateFinControl) {
//         this.dateFinValuesHistorique[index] = this.isDateFinCheckedForHistorique(1) ? "jusqu'à présent" : dateFinControl.value;
//       }
//     });
//     this.dateFinValues[0] = this.isDateFinCheckedForHistorique(1) ? "jusqu'à présent" : ''; 
    
//   }
//   createFormControls(extractedData: any): void {
//     console.log('Creating form controls with extracted data:', extractedData);
//     this.visualisationForm = this.formBuilder.group({
//       CandidateDetails: this.formBuilder.group({
//         FirstName: [extractedData.candidateDetails.FirstName,[Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
//         LastName: [extractedData.candidateDetails.LastName,[Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
//         Email: [extractedData.candidateDetails.Email,[Validators.required, Validators.email]],
//         telephone: [extractedData.candidateDetails.telephone],
//         role: [extractedData.candidateDetails.role,Validators.required],
//         Anneesexperience: [extractedData.candidateDetails.Anneesexperience]
//       }),
//       historiques: this.formBuilder.group({
//         Position: this.formBuilder.array([]) 
//       }),
//       Nomentreprise: [extractedData.historiques.Position[0].Nomentreprise,Validators.required,],
//       Intituleposte: [extractedData.historiques.Position[0].Intituleposte,Validators.required,],
//       Datedebut: [extractedData.historiques.Position[0].Datedebut,Validators.required],
//       Datefin: [extractedData.historiques.Position[0].Datefin],
//       Description: [extractedData.historiques.Position[0].Description],
//       present1: [false],
//       Nom_ecole:[extractedData.Educations.Education[0].Nom_ecole,Validators.required],
//       Diplome:[extractedData.Educations.Education[0].Diplome,Validators.required],
//       VilleE:[extractedData.Educations.Education[0].VilleE],
//       DatedebutF:[extractedData.Educations.Education[0]["DatedebutF"]],
//       DatefinF:[extractedData.Educations.Education[0]["DatefinF"]],
//       titre_comp:[extractedData.Competences.TopSkills[0].titre_comp],
//       titre_certificat:[extractedData.Certifications.Certification[0].titre_certificat,Validators.required],
//       DateCert:[extractedData.Certifications.Certification[0].DateCert],
//       titre_langue:[extractedData.Langues.Langue[0].titre_langue,Validators.required],
//       niveaulang:[extractedData.Langues.Langue[0].niveaulang],
//       present2: [false],
//       historique: this.formBuilder.array([this.createHistoriqueSection(extractedData.historiques.Position[0])]),
//       Educations:  this.formBuilder.array([this.createEducationsSection(extractedData.Educations.Education[0])]),
//       Competences: this.formBuilder.array([this.createCompetencesSection(extractedData.Competences.TopSkills[0].titre_comp)]),
//       Langues:this.formBuilder.array([this.createLanguagesSection(extractedData.Langues.Langue[0])]),
//       Certificats:this.formBuilder.array([this.createCertificatsSection(extractedData.Certifications.Certification[0])]),
//     });
//   }
   addFormControlsToArrays(extractedData: any): void{
//     console.log('Adding form controls to arrays with extracted data:', extractedData);
//     const historiquesArray = this.visualisationForm.get('historique.Position') as FormArray;
//     for (let i = 1; i < extractedData.historiques.Position.length; i++) {
//       const historiqueSection = this.createHistoriqueSection(extractedData.historiques.Position[i]);
//       historiquesArray.push(historiqueSection);
//     }
//     const educationsArray = this.visualisationForm.get('Educations.Education') as FormArray;
//     for (let i = 1; i < extractedData.Educations.Education.length; i++) {
//       const educationSection = this.createEducationsSection(extractedData.Educations.Education[i]);
//       educationsArray.push(educationSection);
//     }
//     const CompetencesArray = this.visualisationForm.get('Competences') as FormArray;
//     for (let i = 1; i < extractedData.Competences.TopSkills.length; i++) { 
//       const competenceSection = this.createCompetencesSection(extractedData.Competences.TopSkills[i].titre_comp);
//       CompetencesArray.push(competenceSection);
//     }
//     const languesArray = this.visualisationForm.get('Langues') as FormArray;
//     for (let i = 1; i  < extractedData.Langues.Langue.length; i++){
//       const langueSection = this.createLanguagesSection(extractedData.Langues.Langue[i]);
//       languesArray.push(langueSection);
//     }
//     const certificatsArray = this.visualisationForm.get('Certificats') as FormArray;
//     for(let i = 1;i < extractedData.Certifications.Certification.length; i++ ){
//       const certificatSection = this.createCertificatsSection(extractedData.Certifications.Certification[i]);
//       certificatsArray.push(certificatSection);
//     }
    
   }
//   onSubmit(): void {
//     console.log('Vérification du formulaire soumis :', this.visualisationForm);

//     this.visualisationForm.get('historique')?.value.forEach((position: any, index: number) => {
//       this.dateFinValuesHistorique[index] = this.isDateFinCheckedForHistorique(1) ? 'jusqu\'à présent' : position.Datefin;
//     });
//     this.visualisationForm.get('Educations')?.value.forEach((education: any, index: number) => {
//       this.dateFinValueseducations[index] = this.isDateFinCheckedForEducations(2) ? 'jusqu\'à présent' : education.DatefinF;
//     });
//     this.dateFinValues[0] = this.isDateFinCheckedForHistorique(1) ? "jusqu'à présent" : ''; 
//     const historiqueArray = this.visualisationForm.get('historique') as FormArray;
//     historiqueArray.controls.forEach((control, index) => {
//       const dateFinControl = control.get('Datefin');
//       if (dateFinControl) {
//         this.dateFinValuesHistorique[index] = this.isDateFinCheckedForHistorique(1) ? "jusqu'à présent" : dateFinControl.value;
//       }
//     });
//     const educationsArray = this.visualisationForm.get('Educations') as FormArray;
//     educationsArray.controls.forEach((control, index) => {
//       const dateFinFControl = control.get('DatefinF');
//       if (dateFinFControl) {
//         this.dateFinValueseducations[index] = this.isDateFinCheckedForEducations(2) ? "jusqu'à présent" : dateFinFControl.value;
//       }
//     });
//     this.submittedData = this.visualisationForm.value;
//     this.resume.CandidateDetails = this.visualisationForm.get('CandidateDetails')?.value;
//     this.resume.historiques.Position = this.visualisationForm.get('historique')?.value;
//     this.resume.Educations.Education = this.visualisationForm.get('Educations')?.value;
//     this.resume.Competences.TopSkills = this.visualisationForm.get('Competences')?.value;
//     this.resume.Langues.Langue = this.visualisationForm.get('Langues')?.value;
//     this.resume.certifications.Certification = this.visualisationForm.get('Certificats')?.value;
//     console.log('Final form data:', this.submittedData);
//     console.log('Resume:', this.resume);
//     this.isDataSubmitted = true;
//     this.isDataSubmitted = true;
//     this.showSubmittedData = true;
//   }
//   onDateInput(event: Event, fieldName: string, section: number): void {
//     console.log('Date input event:', event);
//     const inputElement = event.target as HTMLInputElement;
//     const inputValue = inputElement.value;
//     if (inputValue) {  
//       const formattedDate = this.formatDateToMonthYear(inputValue);
//       this.visualisationForm.get(fieldName)?.setValue(formattedDate, { emitEvent: false });
//     } else {
//       this.visualisationForm.get(fieldName)?.setValue(null, { emitEvent: false });
//     }

//   }

   formatDateToMonthYear(dateStr: string): string {
     const date = new Date(dateStr);
     const year = date.getFullYear().toString();
     const month = (date.getMonth() + 1).toString().padStart(2, '0');
     return `${year}-${month}`;
   }
//   toggleDateFinEducations(sectionIndex: number): void {
//     const dateFinFControl = this.EducationsFormArray.at(sectionIndex).get('DatefinF') as FormControl;
//     const present2Control = this.EducationsFormArray.at(sectionIndex).get('present2') as FormControl;
//     if (present2Control) {
//       if (present2Control.value) {
//         dateFinFControl?.setValue("jusqu'à présent"); 
//         dateFinFControl?.disable(); 
//       } else {
//         dateFinFControl?.setValue(''); 
//         dateFinFControl?.enable(); 
//       }
//     }
//   }

  isDateFinCheckedForEducations(section: number): boolean {
    return  true;
  }
  isDateFinCheckedForHistorique(section: number): boolean {
    return  true;
  }
  isDateFinEducationDisabled(sectionIndex: number): boolean {
    return true;
  }
   isDateFinDisabled(sectionIndex: number)  {
    /* const dateFinControl = this.historiqueFormArray.at(sectionIndex).get('Datefin');
     const present1Control = this.historiqueFormArray.at(sectionIndex).get('present1');
    
     if (present1Control?.value) {
       dateFinControl?.disable();
       return true;
     } else {
       dateFinControl?.enable();
       return false;
     }*/
   }
  
   getMinimumDate(fieldName: string): string | null {
     const dateDebutValue = this.visualisationForm.get(fieldName)?.value;
     return dateDebutValue ? this.formatDateToMonthYear(dateDebutValue) : null;
   }
   getMaximumDate(fieldName: string): string {
     const today = new Date();
    return this.formatDateToMonthYear(today.toISOString());
   }
  addHistorique(): void {
    this.resume.historiques.Position.push({
      Nomentreprise: '',
      Intituleposte: '',
      Datedebut: '',
      Datefin: '',
      Description: ''
    });
  }

  removeHistorique(index: number) :void {
    this.resume.historiques.Position.splice(index, 1);
  }
  addEducations(): void {
    this.resume.Educations.Education.push({
      Nom_ecole:  '',
      Diplome:  '',
      VilleE:  '',
      DatedebutF: '',
      DatefinF: '',
    });
   }
   get EducationsFormArray(): FormArray {
     return this.visualisationForm.get('Educations') as FormArray;
   }
  removeEducations(index: number) {
     this.resume.Educations.Education.splice(index,1)
   }
   addCompetences(): void {
    this.resume.Competences.TopSkills.push({
      titre_comp: '',
    });
   }
   get CompetencesFormArray(): FormArray {
     return this.visualisationForm.get('Competences') as FormArray;
   }
   removeCompetences(index: number) {
    this.resume.Competences.TopSkills.splice(index,1)
   }
   addLanguages(): void {
    this.resume.Langues.Langue.push({
      titre_langue: '',
       niveaulang: ''
    });
   }
   get LanguagesFormArray(): FormArray {
     return this.visualisationForm.get('Langues') as FormArray;
   }
   removeLanguages(index: number) {
    this.resume.Langues.Langue.splice(index,1)
   }
   addCertificats(): void {
    this.resume.certifications.Certification.push({
      titre_certificat: '',
       DateCert: ''
     })  }

   get CertificatsFormArray(): FormArray {
     return this.visualisationForm.get('Certificats') as FormArray;
   }
   removeCertificats(index: number) {
    this.resume.certifications.Certification.splice(index,1)
   }

  chunkArray(arr: any[], size: number) {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;}
} 
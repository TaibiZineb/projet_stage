import { Component,OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { createClient} from '@supabase/supabase-js';
import { Resume} from'../model/user.model'; 
import { ActivatedRoute, Router } from '@angular/router';
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
  dateFinValues: string[] = [];
  isDateFinDisabled: boolean = false;
  isDateFinDisabledEdu:boolean = false;
  dateFinValueseducations: string[] = [];
  fileName: string = '';
  isPresentChecked: boolean = false;
  position: any = {
    Datefin: '', 
    JusquAPresent: false,
  };
  maxDate: string = '';
  education: any;
  cvId!: number;
  cvDetails: any;
  constructor(private route: ActivatedRoute,
              private cvParserService: CvParserService,
              private router: Router ){
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
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    this.maxDate = `${year}-${month}`;
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
              .then((resume: Resume) => this.resume = resume);
          } else {
            console.error('Extracted data is missing required properties.');
          }
        } catch (error) {
          console.error('Error during file encoding or parsing:', error);
        }
      }
    });
    this.route.queryParams.subscribe(async params => {
      const cvId = params['cvId'];
      if (cvId === undefined) {
        console.error('Identifiant du CV manquant.');
        return; // Arrêtez le traitement si l'identifiant du CV est manquant.
      }
      console.log('ID du CV à visualiser :', cvId);
      this.cvParserService.getCVDetails(cvId)
        .then((cvDetails) => {
          console.log('Détails du CV récupérés :', cvDetails);
          this.cvDetails = cvDetails;
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des détails du CV :', error);
        });
   
    });

  }
   toggleDateFin(): void {
    this.isDateFinDisabled = !this.isDateFinDisabled;
    if (this.isDateFinDisabled) {
      this.position.Datefin = '';
    }
    this.isDateFinDisabledEdu = !this.isDateFinDisabledEdu;
    if(this.isDateFinDisabledEdu){
      this.education.DatefinF = '';
    }
  }
  
  addHistorique(): void {
    this.resume.historiques.Position.push({
      Nomentreprise: '',
      Intituleposte: '',
      Datedebut: '',
      Datefin: '',
      Description: '',
      JusquAPresent: false,
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
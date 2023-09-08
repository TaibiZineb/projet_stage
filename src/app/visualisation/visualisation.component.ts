import { Component,OnInit,ElementRef, ViewChild  } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { createClient} from '@supabase/supabase-js';
import { Resume} from'../model/user.model'; 
import { ActivatedRoute, Router } from '@angular/router';
import { CvParserService } from '../services/cv-parser.service';
import { SupabaseClientService } from '../services/supabase-client.service';
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
  dateFinValues: string[] = [];
  isDateFinDisabled: boolean = false;
  isDateFinDisabledEdu:boolean = false;
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
  CV: any;
  constructor(private route: ActivatedRoute,
              private cvParserService: CvParserService,
              private router: Router,
              public supabaseAuth: SupabaseClientService ){
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
  async ngOnInit() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    this.maxDate = `${year}-${month}`;
    this.route.queryParams.subscribe(async (params) => {
      console.log('Paramètres de l\'URL :', params);
      const cvId = params['cvId'];
      const fileName = params['fileName'];
      console.log('File name:', fileName);
      console.log('ID du CV à visualiser en paramètre:', cvId);
      this.cvId = +cvId;
      if (isNaN(this.cvId)) {
        console.error('ID du CV invalide :', cvId);
      } else {
        console.log('ID du CV à visualiser :', this.cvId);
      }
      if (!cvId) {
        if (fileName) {
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
                  .then((resume: Resume) => {
                    this.resume = resume;
                    console.log('Skills data:', this.resume.Competences.TopSkills);
                  })
                  .catch((error) => {
                    console.error('Erreur lors de l\'analyse Sovren :', error);
                  });
              } else {
                console.error('Les données extraites ne contiennent pas les propriétés requises.');
              }
            } catch (error) {
              console.error('Erreur lors de l\'encodage ou de l\'analyse du fichier :', error);
            }
          }
        }
      
      } else {
        this.cvParserService.getCVDetails(cvId)
          .then(async (cvDetails: any) => {
            const resumeData = cvDetails.data;
            const extractedData = await this.cvParserService.parseResume(resumeData);
            if (extractedData) {
              this.cvParserService.fromSovren(extractedData)
                .then((resume: Resume) => {
                  this.resume = resume;
                })
                .catch((error) => {
                  console.error('Erreur lors de l\'analyse Sovren :', error);
                });
            } else {
              console.error('Les données extraites ne contiennent pas les propriétés requises.');
            }
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération du résumé du CV :', error);
          });
      }
    });
  }
  async EnregistrerModifications() {
    if (this.resume) {
      console.log('this.resume :', this.resume); 
      const resumeAsJson = JSON.stringify(this.resume); // Convertir l'objet en JSON
      const base64Resume = btoa(resumeAsJson); 
      try {
        await this.cvParserService.updateCV(base64Resume); 
        console.log('Modifications enregistrées avec succès.');
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement des modifications :', error);
      }
    } else {
      console.error('this.resume est undefined ou null');
    }
  }
  async readURL(input: any, user: any, workspace: any) {
    if (input.files && input.files[0]) {
      const file: File = input.files[0];
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const base64File = await this.cvParserService.encodeFileToBase64(file);
        const loggedInUser = await this.supabaseAuth.getCurrentUser().toPromise();
        if (!loggedInUser) {
          console.error('No user is currently logged in.');
          return;
        }
        const userWorkspace = await this.supabaseAuth.getWorkspaceByUserId(loggedInUser.id);
        if (!userWorkspace) {
          console.error('User has no associated workspace.');
          return;
        }
        const extractedData = await this.cvParserService.parseResume(base64File);
        const nomCandidat = `${extractedData.CandidateDetails.FirstName} ${extractedData.CandidateDetails.LastName}`;
        const cvDetails = {
          id_CV: Date.now(),
          creatAt: new Date(),
          createdBy: `${user.prenom} ${user.nom}`,
          data: base64File,
          jobPosition: extractedData.jobPosition,
          Nom_Candidat: `${extractedData.CandidateDetails.FirstName} ${extractedData.CandidateDetails.LastName}`,
          originalCV: file.name,
          idworkspace: userWorkspace.idWorkspace,
          designationStatus: 'Valide',
          designationTemplate: 'Modèle 1'
        };
        await this.cvParserService.updateCV(cvDetails);
  
        this.router.navigate(['/admin/visualisation'], {
          queryParams: { fileName: file.name }
        });
      };
      reader.readAsDataURL(input.files[0]);
    } else {
    }
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
      Name: '',
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
    return result;
  }
}
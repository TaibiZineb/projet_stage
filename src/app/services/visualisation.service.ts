import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Resume } from'../model/user.model';
@Injectable({
  providedIn: 'root'
})
export class VisualisationService {
  visualisationForm!: FormGroup;
  supabaseUrl!: string;
  supabaseKey!: string;
  supabase: any;
  dateFinValues: string[] = [];
  submittedData: any = {};
  isDataSubmitted: boolean = false;
  constructor(private http: HttpClient,private formBuilder: FormBuilder) {
    this.supabaseUrl = 'https://mljtanxsvdnervhrjnbs.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY';
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    this.initializeForm();
 
   }
   resume: Resume = {
    CandidateDetails: {
      FirstName: '',
      LastName: '',
      candidateEmail: '',
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
  private initializeForm(): void{
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
      Certificats:this.formBuilder.array([this.createCertificatsSection()])

    });
  }
  ngOnInit(): void {
   
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
  
  removeHistoriqueSection(index: number) {
    const historiqueControl = this.visualisationForm.get('historique') as FormArray;
    historiqueControl.removeAt(index);
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
  createCompetencesSection(): FormGroup {
    return this.formBuilder.group({
      titre_comp:['']
    });
  }
  createLanguagesSection(): FormGroup {
    return this.formBuilder.group({
      titre_langue:[''],
      niveaulang:['']
    });
  }
  createCertificatsSection(): FormGroup {
    return this.formBuilder.group({
      titre_certificat:[''],
      DateCert:['']
    });
  }
}

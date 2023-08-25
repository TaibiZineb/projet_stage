import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { AppUser } from '../model/user.model';
import { Router } from '@angular/router';
import { SupabaseClientService } from './supabase-client.service';
import * as PDFParser from 'pdf-parse';


@Injectable({
  providedIn: 'root'
})
export class CvParserService {
  supabaseUrl!: string;
  supabaseKey!: string;
  supabase: any;
  constructor(private http: HttpClient, 
              private router: Router,
              public supabaseAuth: SupabaseClientService) {
    this.supabaseUrl = 'https://mljtanxsvdnervhrjnbs.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY';
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
   }
   async parseResumeAndAddCV(base64File: string, user: AppUser, workspace: any, file: File): Promise<void> {
    try {
      const parsedResume = await this.parseResume(base64File);
      const parsedCV = await this.parseCVContent(parsedResume);

      const cvDetails = {
        id_CV: Date.now(),
        creatAt: new Date(),
        createdBy: `${user.prenom} ${user.nom}`,
        data: base64File,
        jobPosition: parsedCV.jobPosition,
        Nom_Candidat: parsedCV.candidateName,
        originalCV: file.name,
        idworkspace: workspace.idWorkspace,
        designationStatus: 'En attente1',
        designationTemplate: 'Modèle 1'
      };

      await this.addCV(cvDetails);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du CV:', error);
      throw error;
    }
  }
  async addCV(cvDetails: any) {
    try {
      console.log('Détails du CV à insérer :', cvDetails);
      const { data, error } = await this.supabase.from('CV').insert([cvDetails]);
      if (error) {
        console.error('Erreur lors de l\'ajout du CV à Supabase :', error);
        throw error;
      } else {
        console.log('CV ajouté avec succès :', data);
        return data;
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du CV à Supabase :', error);
      throw error;
    }
  }
  encodeFileToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject(new Error('Impossible de lire le fichier en tant que base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  }
  async parseResume(base64File: string): Promise<any> {

    const parsedDetails = {
      jobPosition: 'Poste analysé',
      candidateName: 'Nom du candidat',
  
    };

    return parsedDetails;
  }
  async readURL(input: any, user: AppUser, workspace: any) {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      await this.processFile(file, user, workspace);
    }
  }
  async processUploadedFile(input: any, user: AppUser, workspace: any) {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      await this.processFile(file, user, workspace);
    } else {
      alert('Veuillez sélectionner un fichier avant de continuer.');
    }
  }
  private async processFile(file: File, user: AppUser, workspace: any) {
    const base64File = await this.encodeFileToBase64(file);
    const loggedInUser = await this.supabaseAuth.getCurrentUser().toPromise();
    if (!loggedInUser) {
      console.error('Aucun utilisateur n\'est actuellement connecté.');
      return;
    }
    const userWorkspace = await this.supabaseAuth.getWorkspaceByUserId(
      loggedInUser.id
    );
    if (!userWorkspace) {
      console.error('L\'utilisateur n\'a pas d\'espace de travail associé.');
      return;
    }
    const parsedResume = await this.parseResume(base64File);
    console.log('Données du CV analysé:', JSON.stringify(parsedResume));

    const cvDetails = {
      id_CV: Date.now(),
      creatAt: new Date(),
      createdBy: `${user.prenom} ${user.nom}`,
      data: base64File,
      jobPosition: parsedResume.jobPosition,
      Nom_Candidat: parsedResume.candidateName,
      originalCV: file.name,
      idworkspace: userWorkspace.idWorkspace,
      designationStatus: 'En attente',
      designationTemplate: 'Modèle 1'
    };

    await this.addCV(cvDetails);
    this.router.navigate(['/admin/dashboard'], {
      queryParams: { fileName: file.name }
    });
  }
  async parseCVContent(base64File: string): Promise<any>{
    const parsedDetails = {
      jobPosition: 'Poste extrait ttyy',
      candidateName: 'Nom du candidat extrait',
    };
    return parsedDetails;
  }
  
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { AppUser, CV,Competence, Resume } from '../model/user.model';
import { Router } from '@angular/router';
import { SupabaseClientService } from './supabase-client.service';
@Injectable({
  providedIn: 'root'
})
export class CvParserService {
  supabaseUrl!: string;
  supabaseKey!: string;
  supabase: any;
  base64File!: string;
  constructor(private http: HttpClient, 
              private router: Router,
              public supabaseAuth: SupabaseClientService) {
    this.supabaseUrl = 'https://mljtanxsvdnervhrjnbs.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY';
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
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
  async updateCV(cvDetails: any) {
    try {
      console.log('Détails du CV à mettre à jour :', cvDetails);
      const { data, error } = await this.supabase
        .from('CV')
        .upsert([cvDetails], { onConflict: ['id_CV'] }); 
  
      if (error) {
        console.error('Erreur lors de la mise à jour du CV dans Supabase :', error);
        throw error;
      } else {
        console.log('CV mis à jour avec succès :', data);
        return data;
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du CV dans Supabase :', error);
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
  async parseResume(base64File: string): Promise<any>{
    try {
      const response = await fetch('https://eu-rest.resumeparsing.com/v10/parser/resume', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Sovren-AccountId': '17097504', 'Sovren-ServiceKey': 'i8Stm46FEsltKLqQ2VNz1MzhCnlHORAYnOUO/dP7'},
        body: JSON.stringify({ 
          DocumentAsBase64String: base64File,
          DocumentLastModified: (new Date()).toISOString().substring(0, 10)
        }) 
      }) 
      if (!response.ok) {
        throw new Error(`La requête a échoué avec le code de statut : ${response.status}`);
      }
      const data = await response.json();
      console.log('Données extraites du CV :', data);
      return data.Value?.ResumeData; 
    } 
    catch (error : any) { 
      console.error(`Erreur lors de la requête HTTP : ${error.message}`); 
      return "Something went wrong";
    }
  }
  async readURL(input: any, user: AppUser, workspace: any) {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      await this.processFile(file, user, workspace);
    }
  }
  convertBase64ToUint8Array(base64String: string): Uint8Array {
    const binaryString = atob(base64String);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    return byteArray;
  }
  private async processFile(file: File, user: AppUser, workspace: any) {
    const base64File = await this.encodeFileToBase64(file);
    const loggedInUser = await this.supabaseAuth.getCurrentUser().toPromise();
    if (!loggedInUser) {
      console.error('Aucun utilisateur n\'est actuellement connecté.');
      return;
    }
    const userWorkspace = await this.supabaseAuth.getWorkspaceByUserId(loggedInUser.id);
    if (!userWorkspace) {
      console.error('L\'utilisateur n\'a pas d\'espace de travail associé.');
      return;
    }
    const extractedData= await this.parseResume(base64File);
    console.log('Données du CV analysé extractedData:', extractedData);
    const firstName = extractedData.ContactInformation?.CandidateName?.GivenName || '';
    const lastName = extractedData.ContactInformation?.CandidateName?.FamilyName || '';
    
    const cvDetails = {
      id_CV: Date.now(),
      creatAt: new Date(),
      createdBy: `${user.prenom} ${user.nom}`,
      data: base64File,
      jobPosition: extractedData.jobPosition,
      Nom_Candidat : `${firstName} ${lastName}`,
      candidateEmail: extractedData.candidateEmail,
      originalCV: file.name,
      idworkspace: userWorkspace.idWorkspace,
      designationStatus: '',
      designationTemplate: 'Modèle 1'
    };
  
    await this.addCV(cvDetails);
    this.router.navigate(['/admin/dashboard'], {
      queryParams: { fileName: file.name }
    });
  }
  async deleteCV(cvId: number): Promise<void> {
    try {
      const shouldDelete = window.confirm('Êtes-vous sûr de vouloir supprimer ce CV ?');
      if (shouldDelete) {
        const { data, error } = await this.supabase.from('CV').delete().eq('id_CV', cvId);
        if (error) {
          console.error('Error deleting CV from Supabase:', error);
          throw error;
        } else {
          console.log('CV deleted successfully:', data);
        }
      } else {
        // L'utilisateur a annulé la suppression, ne rien faire.
        console.log('Suppression du CV annulée.');
      }
    } catch (error) {
      console.error('Error deleting CV:', error);
      throw error;
    }
  }

  async parseResumeAndAddCV(base64File: string): Promise<any> {
    try {
      const parsedResume = await this.parseResume(base64File); 
      const cvDetails = {  };
      await this.addCV(cvDetails); 
      return parsedResume; 
    } catch (error) {
      console.error('Erreur lors de l\'extraction et de l\'ajout du CV :', error);
      throw error;
    }
  }
  async getCVList(): Promise<CV[]> {
    try {
        const response = await this.supabase
            .from('CV')
            .select('*')
            .order('creatAt', { ascending: false });  
        if (response.error) {
            throw response.error;
        }
        return response.data || [];
    } catch (error) {
        console.error('Error fetching CV list:', error);
        throw error;
    }
  }
  async getCVListByWorkspace(workspaceId: number): Promise<CV[]> {
    try {
      const response = await this.supabase
        .from('CV')
        .select('*')
        .eq('idworkspace', workspaceId) 
        .order('creatAt', { ascending: false });
  
      if (response.error) {
        throw response.error;
      }
  
      return response.data || [];
    } catch (error) {
      console.error('Error fetching CV list:', error);
      throw error;
    }
  }
  async getCVDetails(cvId: number): Promise<any> {
    try {
      const response = await this.supabase.from('CV').select('*').eq('id_CV', cvId);
      if (response.error) {
        console.error('Erreur lors de la récupération des détails du CV :', response.error);
        throw new Error('Erreur lors de la récupération des détails du CV');
      }
      return response.data[0]; 
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du CV :', error);
      throw error;
    }
  }
  async getResumeData(cvId: number): Promise<Resume | null> {
    try {
      const existingCv = await this.getCVDetails(cvId);
      
      if (!existingCv) {
        console.error('Le CV existant n\'a pas été trouvé.');
        return null;
      }

      const base64Data = existingCv.data;
      const parsedResume = await this.parseResume(base64Data);

      return parsedResume;
    } catch (error) {
      console.error('Erreur lors de la récupération du résumé du CV :', error);
      throw error;
    }
  }


  fromSovren = async ( data: any) => {
    const resume: Resume= {
      CandidateDetails: {
        FirstName: "",
        LastName: "",
        Email: "",
        role: "",
        position:'relative',
        telephone: "",
        Anneesexperience: "",
      },
      historiques: { Position: [] },
      Educations: { Education: [] },
      Langues: { Langue: [] },
      certifications: { Certification: [] },
      Competences: { TopSkills: [] },
    }
    resume.CandidateDetails.FirstName = data.ContactInformation?.CandidateName?.GivenName || "";
    resume.CandidateDetails.LastName = data.ContactInformation?.CandidateName?.FamilyName || "";
    resume.CandidateDetails.Email = data.ContactInformation?.EmailAddresses?.[0]?.toString() || "";
    resume.CandidateDetails.telephone = data.ContactInformation?.Telephones?.[0]?.Normalized || "";
    resume.CandidateDetails.role = "";
    resume.CandidateDetails.Anneesexperience = (data.EmploymentHistory?.ExperienceSummary?.MonthsOfWorkExperience || " ") +
        " months";
    data.Education && data.Education.EducationDetails && data.Education.EducationDetails.map((edu: any) =>
      resume.Educations.Education.push({
        Nom_ecole: edu?.SchoolName?.Normalized || "",
        Diplome: edu?.Degree?.Type || "",
        VilleE: "",
        DatedebutF: edu.LastEducationDate? edu.LastEducationDate.isCurrentDate? "Present": edu.LastEducationDate.Date: "",
        DatefinF: edu.LastEducationDate? edu.LastEducationDate.isCurrentDate ? "Present": edu.LastEducationDate.Date: "",
      })
    );
    if (data.EmploymentHistory && data.EmploymentHistory.Positions) {
      data.EmploymentHistory.Positions.map((pos: any) =>
        resume.historiques.Position.push({
          Nomentreprise: pos?.Employer?.Name?.Normalized || "",
          Intituleposte: pos?.JopTitle?.Normalized || "",
          Datedebut: pos?.StartDate?.Date || "",
          Datefin: pos.isCurrent ? "Present" : pos?.EndDate?.Date || "",
          Description: pos?.Description || "",
        })
      );
    } else {
      console.log('Les données ne contiennent pas de position historique.');
    }
    data.Certifications && data.Certifications.map((cer: any) =>
      resume.certifications.Certification.push({
        titre_certificat: cer?.Name || "",
        DateCert: "",
      })
    );
    data.LanguageCompetencies && data.LanguageCompetencies.map((lan: any) =>
      resume.Langues.Langue.push({
        titre_langue: lan?.Language || "",
        niveaulang: "Débutant/Courant",
      })
    );
    resume.Competences.TopSkills = [...this.getTopSkills(data.SkillsData[0])];
    console.log('Données extraites du CV Resume:', resume);
    return resume;
    
  };
  getTopSkills = (data: any) => {
    const skills =
      data?.Taxonomies?.flatMap((taxonomy: any) =>
        taxonomy?.SubTaxonomies?.flatMap(
          (subTaxonomy: any) => subTaxonomy?.Skills
        )
      )
        ?.filter((skill: any) => skill?.ExistsInText)
        ?.sort((a: any, b: any) => b?.PercentOfOverall - a?.PercentOfOverall)
        ?.slice(0, 4)
        ?.map((skill: any) => ({ Name: skill?.Name })) || [];
    return skills as Competence[];
  };

  fromSupabase = ( resume: Resume, data: any ) => {
    const res = JSON.parse(data); 
      resume.CandidateDetails = res.CandidateDetails;
      resume.certifications = res.certifications;
      resume.Educations = res.Educations;
      resume. historiques = res.historiques;
      resume.Langues = res.Langues;
      resume.certifications = res.certifications;
      resume.Competences = res.Competences;
     
  }
}
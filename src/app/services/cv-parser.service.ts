import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { AppUser, CV,ParsedResume } from '../model/user.model';
import { Router } from '@angular/router';
import { SupabaseClientService } from './supabase-client.service';
import * as pdfjsLib from 'pdfjs-dist';

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
    const workerPath = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;
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
    console.log('Parsing resume with base64 data:', base64File);
    const pdfData = this.convertBase64ToUint8Array(base64File);    
    // Extract text from the PDF
    const extractedText = await this.extractTextFromPDF(pdfData);
    console.log('Extracted text:', extractedText);
      console.log('JSON stringified text:', JSON.stringify(extractedText));
    // Extract candidate's name using regex
    const nameRegex = /([A-Za-zÀ-ÿ']+) ([A-Za-zÀ-ÿ']+)/;
    const match = extractedText.match(nameRegex);
    
    let firstName = "Nom du candidat inconnu";
    let lastName = "Nom du candidat inconnu";
    
    if (match && match.length >= 3) {
      firstName = match[1];
      lastName = match[2];
      console.log('nom:', firstName),
      console.log('prenom: ', lastName)
    }

    // Extract candidate's email using regex
    const candidateEmailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}/i;
    const matchEmail = extractedText.match(candidateEmailRegex);
    const candidateEmail = matchEmail ? matchEmail[0] : "Adresse e-mail inconnue";
    console.log("Candidate Email:", candidateEmail);
  
    // Extract candidate's phone number using regex
    const candidateNumRegex = /(?:0[67]\d{8})|(?:\+\d+)/i;
    const candidateNumMatch = extractedText.match(candidateNumRegex);
    const candidateNum = candidateNumMatch ? candidateNumMatch[0] : "Num inconnu";
    console.log("Candidate Num:", candidateNum);
    // Extract candidate's postal address using regex
    const addressRegex = /ADRESSE:\s*([\s\S]*?)/;
    const addressMatch = extractedText.match(addressRegex);
    console.log('Address match:', addressMatch);
    let postalAddress = "Adresse inconnue";
    if (addressMatch) {
      postalAddress = addressMatch[1];
      console.log('Postal Address:', postalAddress);
    } else {
      console.log('No postal address found.');
    }
    // Extract candidate's educational background using regex
  const educationRegex = /FORMATION(?:S)?:\s*([\s\S]*?)(?=COMPÉTENCES:|$)/;
  const educationMatch = extractedText.match(educationRegex);
  console.log('Education match:', educationMatch);
  
  let educationBackground = "Formation inconnue";
  if (educationMatch && educationMatch[1]) {
    educationBackground = educationMatch[1]
      .split(/[\r\n]+/) 
      .map(line => line.trim()) 
      .filter(line => line.length > 0) 
      .join('\n'); 
    console.log('Education Background:', educationBackground);
  } else {
    console.log('No education background found.');
  }

    // Extract candidate's competences using regex
    const competenceRegex = /COMPÉTENCES:\s*([\s\S]*?)(?=QUALITÉS PERSONNELLES:|$)/;
    const competenceMatch = extractedText.match(competenceRegex);
    console.log('Competence match:', competenceMatch);
    
    let competences = "Compétences inconnues";
    if (competenceMatch && competenceMatch[1]) {
      competences = competenceMatch[1]
        .split(/[\r\n]+/) 
        .map(line => line.trim()) 
        .filter(line => line.length > 0) 
        .join(', '); 
        console.log('Compétences:', competences);
    }else{
      console.log('Aucune compétence trouvée.');
    }
  // Extract candidate's certifications using regex
    const certificationRegex = /CERTIFICATIONS:\s*([\s\S]*?)(?=(LANGUES:|$))/;
    const certificationMatch = extractedText.match(certificationRegex);
    console.log('Certification match:', certificationMatch);

    let certifications = "Aucune certification trouvée";
    if (certificationMatch && certificationMatch[1]) {
      certifications = certificationMatch[1]
        .split(/[\r\n]+/) 
        .map(line => line.trim()) 
        .filter(line => line.length > 0) 
        .join('\n'); 
      console.log('Certifications:', certifications);
    } else {
      console.log('No certifications found.');
    }
    // Extract candidate's skills using regex
    const skillsRegex = /COMPÉTENCES:\s*([\s\S]*?)(?=(INTÉRÊTS:|$))/;
    const skillsMatch = extractedText.match(skillsRegex);
    console.log('Skills match:', skillsMatch);

    let skills = "Aucune compétence trouvée";
    if (skillsMatch && skillsMatch[1]) {
      skills = skillsMatch[1]
        .split(/[,;]+/) 
        .map(skill => skill.trim()) 
        .filter(skill => skill.length > 0) 
        .join(', '); 
      console.log('Skills:', skills);
    } else {
      console.log('No skills found.');
    }
    // Extract candidate's experience using regex
    const experienceRegex = /EXPÉRIENCE PROFESSIONNELLE:\s*([\s\S]*?)(?=(FORMATION:|$))/;
    const experienceMatch = extractedText.match(experienceRegex);
    console.log('Experience match:', experienceMatch);

    let experience = "Aucune expérience professionnelle trouvée";
    if (experienceMatch && experienceMatch[1]) {
      experience = experienceMatch[1];
      console.log('Experience:', experience);
    } else {
      console.log('No experience found.');
    }
    // Extract languages from the text using regex
    const languageRegex = /LANGUES:\s*([\s\S]*?)(?=(COMPÉTENCES:|CERTIFICATIONS:|$))/;
    const languageMatch = extractedText.match(languageRegex);
    console.log('Language match:', languageMatch);

    let languages = "Aucune langue trouvée";
    if (languageMatch && languageMatch[1]) {
      languages = languageMatch[1].trim().split('\n').map(lang => lang.trim()).join(', ');
      console.log('Languages:', languages);
    } else {
      console.log('No languages found.');
    }
    // Create a parsedDetails object containing extracted information
    const parsedDetails = {
      jobPosition: 'Stage',
      candidateName: `${firstName} ${lastName}`,
      firstName:firstName,
      lastName:lastName,
      candidateEmail: candidateEmail,
      candidateNum: candidateNum,
      competences: competences,
      postalAddress: postalAddress,
      educationBackground: educationBackground,
      certifications: certifications,
      skills:skills,
      experience:experience,
      languages:languages

    };
    console.log('Parsed details:', parsedDetails);
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
    const parsedResume = await this.parseResume(base64File);
    console.log('Données du CV analysé:', JSON.stringify(parsedResume));
  
    const cvDetails = {
      id_CV: Date.now(),
      creatAt: new Date(),
      createdBy: `${user.prenom} ${user.nom}`,
      data: base64File,
      jobPosition: parsedResume.jobPosition,
      candidateName: parsedResume.candidateName,
      candidateEmail: parsedResume.candidateEmail,
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
      candidateEmail:'',
    };
    return parsedDetails;
  }
  async deleteCV(cvId: number): Promise<void> {
    try {
      const { data, error } = await this.supabase.from('CV').delete().eq('id_CV', cvId);
      if (error) {
        console.error('Error deleting CV from Supabase:', error);
        throw error;
      } else {
        console.log('CV deleted successfully:', data);
      }
    } catch (error) {
      console.error('Error deleting CV:', error);
      throw error;
    }
  }
  async extractTextFromPDF(pdfData: Uint8Array): Promise<string> {
    try {
      console.log('Extracting text from PDF...');
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
      let text = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const pageText = await page.getTextContent();
        pageText.items.forEach(item => {
          if ('str' in item) {
            text += (item as any).str + ' ';
          }
        });
      }
      console.log('Extracted text from PDF:', text); 
      return text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error); 
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
}
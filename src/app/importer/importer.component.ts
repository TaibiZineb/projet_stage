import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { CvParserService } from '../services/cv-parser.service';
import { SupabaseClientService } from '../services/supabase-client.service';
@Component({
  selector: 'app-importer',
  templateUrl: 'importer.component.html',
  styleUrls: ['importer.component.css']
})
export class ImporterComponent implements OnInit {
  visualisationForm!: FormGroup;
  uploadedFileName!: string;
  isFileUploaded: boolean = false;
  user: any; 
  workspace: any;
  constructor(private formBuilder: FormBuilder, private router: Router,
               private cvParserService: CvParserService,
               public supabaseAuth: SupabaseClientService) {}
  ngOnInit(): void {}
  triggerFileInput() {
    const fileInput = document.querySelector('.file-upload-input') as HTMLInputElement;
    fileInput.click();
  }
  async readURL(input: any, user: any, workspace: any) {
    if (input.files && input.files[0]) {
      const file: File = input.files[0];
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const file = input.files[0];
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
        console.log('Nom du candidat :', nomCandidat);
        const cvDetails = {
          id_CV: Date.now(),
          creatAt: new Date(),
          createdBy: `${user.prenom} ${user.nom}`,
          data: base64File,
          jobPosition: extractedData.jobposition,
          Nom_Candidat: `${extractedData.CandidateDetails.FirstName} ${extractedData.CandidateDetails.LastName}`,
          
          originalCV: file.name,
          idworkspace: userWorkspace.idWorkspace,
          designationStatus: 'Valide',
          designationTemplate: 'Modèle 1'
        };

        this.cvParserService.addCV(cvDetails);
        this.router.navigate(['/admin/visualisation'], {
          queryParams: { fileName: file.name }
        });
      };
      reader.readAsDataURL(input.files[0]);
    } else {
    }
  }
  async uploadCVAndAddToDatabase(file: File) {
    try {
      console.log('Uploading and extracting data from CV:', file.name);
      const base64File = await this.cvParserService.encodeFileToBase64(file);
      console.log('Base64 encoded file:', base64File);
      const extractedData = await this.parseResume(base64File); 
      console.log('Données extraites du CV :', extractedData);
      const user = await this.supabaseAuth.getCurrentUser().toPromise();
      if (!user) {
        console.error('No user is currently logged in.');
        return;
      }
      const workspace = await this.supabaseAuth.getWorkspaceByUserId(user.id);
      if (!workspace) {
        console.error('User has no associated workspace.');
        return;
      }
      const cvDetails = {
        id_CV: Date.now(),
        creatAt: new Date(),
        createdBy: `${user.prenom} ${user.nom}`,
        data: base64File,
        jobPosition: 'Stage',
        Nom_Candidat : `${extractedData.FirstName} ${extractedData.LastName}`, 
        originalCV: file.name,
        idworkspace: workspace.idWorkspace,
        designationStatus: 'Valide',
        designationTemplate: 'Modèle 1'
      };
      this.cvParserService.addCV(cvDetails);
      this.router.navigate(['/admin/visualisation'], {
        queryParams: { fileName: file.name }
      });
    } catch (error) {
      console.error('Erreur lors de l\'extraction du CV :', error);
    }
  }
  async parseResume(base64File: string): Promise<any> {
    try {
      const extractedData = await this.cvParserService.parseResume(base64File);
      return extractedData;
    } catch (error) {
      console.error('Error parsing resume:', error);
      throw error;
    }
  }
  handleFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      this.uploadCVAndAddToDatabase(file);
    }
  }
}

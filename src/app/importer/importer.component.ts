import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CvParserService } from '../services/cv-parser.service';
import { SupabaseClientService } from '../services/supabase-client.service';
import { AppUser,Workspace,UserRoleWorkspace } from '../model/user.model';

@Component({
  selector: 'app-importer',
  templateUrl: 'importer.component.html',
  styleUrls: ['importer.component.css']
})
export class ImporterComponent implements OnInit {
  uploadedFileName!: string;
  isFileUploaded: boolean = false;
  user: any; 
  workspace: any;
  constructor(private router: Router,
               private cvParserService: CvParserService,
               public supabaseAuth: SupabaseClientService) {}
  ngOnInit(): void {}
  triggerFileInput() {
    const fileInput = document.querySelector('.file-upload-input') as HTMLInputElement;
    fileInput.click();
  }
  readURL(input: any,user: any, workspace: any) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const file = input.files[0];
        const base64File = await this.cvParserService.encodeFileToBase64(file);
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
          jobPosition: 'Position recherchée',
          Nom_Candidat: 'Nom du candidat',
          originalCV: file.name,
          idworkspace: workspace.idWorkspace,
          designationStatus: 'En attente',
          designationTemplate: 'Modèle 1'
        };
        
        this.cvParserService.addCV(cvDetails);
        this.router.navigate(['/admin/dashboard'], {
          queryParams: { fileName: file.name }
        });
      };
      reader.readAsDataURL(input.files[0]);
    } else {
     
    }
  }

  async uploadCVAndAddToDatabase(file: File) {
    try {
      const base64File = await this.cvParserService.encodeFileToBase64(file);

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
        jobPosition: 'Position recherchée',
        Nom_Candidat: 'Nom du candidat',
        originalCV: file.name,
        idworkspace: workspace.idWorkspace,
        designationStatus: 'En attente',
        designationTemplate: 'Modèle 1'
      };
  
      this.cvParserService.addCV(cvDetails);
      this.router.navigate(['/admin/dashboard'], {
        queryParams: { fileName: file.name }
      });
    } catch (error) {
      console.error('Error uploading CV and adding to Supabase:', error);
    }
  }
  async handleFileChange(event: any) {
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
  
    this.readURL(event.target, user, workspace);
    const base64File = await this.cvParserService.encodeFileToBase64(event.target.files[0]);
    const parsedResume = await this.cvParserService.parseResume(base64File);
    console.log('Parsed Resume:', parsedResume);
  }
  
  
}


 
import { Component } from '@angular/core';
import { CV } from '../model/user.model';
import { ActivatedRoute } from '@angular/router';
import { CvParserService } from '../services/cv-parser.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  cvList: CV[] = []; 
  fileName: string = '';
  workspace: any;

  constructor( private cvParserService: CvParserService,
    private route: ActivatedRoute,
    ) {}

  async ngOnInit(): Promise<void> {
    await this.fetchCVList();
    this.route.queryParams.subscribe(async params => {
      this.fileName = params['fileName'];
      const fileInput = document.querySelector('.file-upload-input') as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        try {
          const base64File = await this.cvParserService.encodeFileToBase64(file);
          const extractedData = await this.cvParserService.parseResume(base64File);
        } catch (error) {
          console.error('Error encoding or parsing the file:', error);
        }
      }
    });
  }

  async fetchCVList(): Promise<void> {
    try {
      const loggedInUser = await this.cvParserService.supabaseAuth.getCurrentUser().toPromise();
      if (!loggedInUser) {
        console.error('Aucun utilisateur n\'est actuellement connecté.');
        return;
      }
      
      const userWorkspace = await this.cvParserService.supabaseAuth.getWorkspaceByUserId(loggedInUser.id);
      if (!userWorkspace) {
        console.error('L\'utilisateur n\'a pas d\'espace de travail associé.');
        return;
      }
  
      const cvList = await this.cvParserService.getCVListByWorkspace(userWorkspace.idWorkspace);
      this.cvList = cvList;
    } catch (error) {
      console.error('Error fetching CV list:', error);
    }
  }
  
  
  async deleteCV(cvId: number) {
    try {
      await this.cvParserService.deleteCV(cvId);
      this.cvList = this.cvList.filter(cv => cv.id_CV !== cvId);
  
      console.log('CV supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du CV :', error);
    }
  }
}
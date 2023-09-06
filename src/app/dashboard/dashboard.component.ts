import { Component } from '@angular/core';
import { CV } from '../model/user.model';
import { ActivatedRoute, Router } from '@angular/router';
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
  cvDetails: any; 
  constructor( private cvParserService: CvParserService, private route: ActivatedRoute,private router: Router) {}
  async ngOnInit(): Promise<void> {
    await this.fetchCVList();

    
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
      console.log('Données CV renvoyées par Supabase :', cvList);
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
  navigateToCVDetails(fileName: string) {
    this.router.navigate(['/admin/visualisation'], {
      queryParams: { fileName: fileName },
    });
  }
}
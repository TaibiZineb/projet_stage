import { Component, OnInit } from '@angular/core';
import { SupabaseClientService } from '../services/supabase-client.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { AppUser, Workspace } from '../model/user.model';
import { map, catchError } from 'rxjs/operators';
import { WorkspaceService } from '../services/workspace.service';
@Component({
  selector: 'app-admin-template',
  templateUrl: './admin-template.component.html',
  styleUrls: ['./admin-template.component.css']
})
export class AdminTemplateComponent implements OnInit {
  currentDate!: string;
  users: AppUser[] = [];
  authentificateUser: AppUser | null = null;
  userWorkspace: Workspace | null = null;
  showNav: boolean = true;
  constructor(public supabaseAuth: SupabaseClientService, public router: Router, private workspaceService: WorkspaceService) {
    this.authentificateUser = null;
  }
  async ngOnInit(): Promise<void> {
    this.getDate();
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const user: AppUser | null | undefined = await this.supabaseAuth.getCurrentUser().toPromise();
    if (user !== null && user !== undefined) {
      this.authentificateUser = user;
      this.userWorkspace = await this.supabaseAuth.getWorkspaceByUserId(user.id);
      console.log('Utilisateur connecté :', this.authentificateUser);
      this.workspaceService.registerCallback(async (workspace: Workspace) => {
        console.log("this.workspaceService.registerCallback+" + JSON.stringify(workspace))
        this.userWorkspace = await this.supabaseAuth.getWorkspaceByUserId(user.id);;
        console.log("this.workspaceService.registerCallback+" + JSON.stringify(this.userWorkspace))
      });
    }
    hamburger?.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu?.classList.toggle("active");
    });
    document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
      hamburger?.classList.remove("active");
      navMenu?.classList.remove("active");
    }));
    console.log("ngOnInit called");
    this.router.events.subscribe(event => {
      console.log('URL changed:', this.router.url);
      this.showNav = !['/admin/visualisation', '/admin/workspace'].includes(this.router.url);
      console.log('showNav:', this.showNav);
    });
    const isVisualisationActive = this.router.isActive('/admin/visualisation', true);
    const isWorkspaceActive = this.router.isActive('/admin/workspace', true);
    this.showNav = !(isVisualisationActive || isWorkspaceActive);

    
  }
  handleLogout(): void {
    this.supabaseAuth.handleLogout();
  }
  getDate() {
    const today = new Date();
    this.currentDate = today.toLocaleDateString('fr-FR');
  }
}

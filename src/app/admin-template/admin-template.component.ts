import { Component, OnInit} from '@angular/core';
import { SupabaseClientService } from '../services/supabase-client.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { AppUser,Workspace } from '../model/user.model';
import { map, catchError } from 'rxjs/operators';
@Component({
  selector: 'app-admin-template',
  templateUrl: './admin-template.component.html',
  styleUrls: ['./admin-template.component.css']
})
export class AdminTemplateComponent implements OnInit{
  currentDate!: string;
  users: AppUser[] = [];
  authentificateUser: AppUser | null = null;
  userWorkspace: Workspace | null = null;
  constructor(public supabaseAuth : SupabaseClientService, public router : Router){
    this.authentificateUser = null;
  }
  async ngOnInit(): Promise<void>{
    this.getDate();
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const user: AppUser | null | undefined = await this.supabaseAuth.getCurrentUser().toPromise();
    if (user !== null && user !== undefined) {
      this.authentificateUser = user;
      console.log('Utilisateur connecté :', this.authentificateUser);
      try {
        const workspace: Workspace | null = await this.supabaseAuth.getWorkspaceByUserId(user.id);
        this.userWorkspace = workspace;
        console.log('Espace de l\'utilisateur :', this.userWorkspace);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'espace de l\'utilisateur:', error);
      }
    }
    hamburger?.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu?.classList.toggle("active");
    });
    document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
      hamburger?.classList.remove("active");
      navMenu?.classList.remove("active");
    }));
  }
  handleLogout(): void {
    this.supabaseAuth.handleLogout();
  }
  getDate() {
    const today = new Date();
    this.currentDate = today.toLocaleDateString('fr-FR');
  }
}

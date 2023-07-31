import { Component, OnInit} from '@angular/core';
import { SupabaseClientService } from '../services/supabase-client.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { AppUser } from '../model/user.model';
@Component({
  selector: 'app-admin-template',
  templateUrl: './admin-template.component.html',
  styleUrls: ['./admin-template.component.css']
})
export class AdminTemplateComponent implements OnInit{
  currentDate!: string;
  users: AppUser[] = [];
  authentificateUser: AppUser | null = null
  constructor(public supabaseAuth : SupabaseClientService, public router : Router){}
 
  ngOnInit(): void {
    this.getDate();
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
 

    this.supabaseAuth.getCurrentUser().subscribe(
      (user: AppUser | null) => {
        this.authentificateUser = user;
        console.log('Utilisateur connecté :', this.authentificateUser);
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
      }
    );

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

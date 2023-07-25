import { Component, OnInit} from '@angular/core';
import { SupabaseClientService } from '../services/supabase-client.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { AppUser } from '../model/user.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin-template',
  templateUrl: './admin-template.component.html',
  styleUrls: ['./admin-template.component.css']
})
export class AdminTemplateComponent implements OnInit{
  currentDate!: string;
  users : AppUser[] = [];
  authentificateUser : AppUser | undefined;
  constructor(public supabaseAuth : SupabaseClientService, public router : Router){}
 
  ngOnInit(): void {
    this.getDate();
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    this.supabaseAuth.getUsersFromDatabase().subscribe(
      (users: AppUser[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
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

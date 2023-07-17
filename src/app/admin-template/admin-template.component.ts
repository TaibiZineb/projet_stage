import { Component, OnInit,Input } from '@angular/core';
import { SupabaseClientService } from '../services/supabase-client.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { Session } from '@supabase/gotrue-js';


@Component({
  selector: 'app-admin-template',
  templateUrl: './admin-template.component.html',
  styleUrls: ['./admin-template.component.css']
})
export class AdminTemplateComponent implements OnInit{
  currentDate!: string;
  constructor(public supabaseAuth : SupabaseClientService, public router : Router){}
 
  ngOnInit(): void {
    this.getDate();
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

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

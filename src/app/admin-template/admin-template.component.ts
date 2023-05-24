import { Component, OnInit,Input } from '@angular/core';
import { AuthentificationService } from '../services/authentification.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-admin-template',
  templateUrl: './admin-template.component.html',
  styleUrls: ['./admin-template.component.css']
})
export class AdminTemplateComponent implements OnInit{

  constructor(public authService : AuthentificationService, private router : Router){}

  ngOnInit(): void {
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

  

  handleLogout(){
    this.authService.logout().subscribe({
      next :(data:boolean)=>{
        this.router.navigateByUrl("/login");
      }
    })
  }




}

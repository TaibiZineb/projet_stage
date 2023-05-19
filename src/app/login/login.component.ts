import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthentificationService } from '../services/authentification.service';
import { AppUser } from '../model/user.model';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  userFromGroup!: FormGroup;
  errorMessage : any;

  constructor(private fb: FormBuilder, 
              private authService : AuthentificationService,
              private router : Router
              ){}

  ngOnInit(): void {
    this.userFromGroup = this.fb.group({
      username : this.fb.control(""),
      password : this.fb.control("")

    })
  }
  handleLogin(){
    let username = this.userFromGroup.value.username;
    let password = this.userFromGroup.value.password;
    this.authService.login(username, password).subscribe({
      next:(AppUser: AppUser)=>{
        this.authService.authenticateUser(AppUser).subscribe({
          next : (data:boolean)=>{
            this.router.navigateByUrl("admin/home");
          }
        });
      },
      error : (err) =>{
        this.errorMessage = err;
      }
    })
  }
}

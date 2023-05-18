import { Injectable } from '@angular/core';
import { AppUser } from '../model/user.model';
import { UUID } from 'angular2-uuid';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  users : AppUser[] = [];
  authentificateUser : AppUser | undefined;

  constructor() { 
    "use strict";
    this.users.push({userId : UUID.UUID(),username : "user1", password : "1234", roles : ["USER"]});
    this.users.push({userId : UUID.UUID(),username : "user2", password : "1234", roles : ["USER"]});
    this.users.push({userId : UUID.UUID(),username : "admin", password : "1234", roles : ["USER" ,"ADMIN"]});
    
  }
  public login(username : string, password : string) : Observable<AppUser>{
    let AppUser =  this.users.find(u =>  u.username == username);
    if(!AppUser) return throwError(()=>new Error("User not found"));
    if(AppUser.password != password){
      return throwError(()=>new Error("Bad credentials"));
    }
    //localStorage.setItem('authenticated', 'true');
    //sessionStorage.setItem('authenticated', 'true');
    return of(AppUser);
    
  }
  public authenticateUser(AppUser : AppUser) :Observable<boolean>{
    this.authentificateUser = AppUser;
    localStorage.setItem("authUser", JSON.stringify({username : AppUser.username, roles : AppUser.roles, jwt:"JWT_TOKEN"}));
    return of(true);
  }
  public hasRole( role : string) : boolean{
    return this.authentificateUser!.roles.includes(role);
  }
  public logout(): Observable<boolean>{
    this.authentificateUser = undefined;
    localStorage.removeItem("authUser");
    return of (true);
  }
  public isAuthenticated() : boolean{
    return this.authentificateUser!= undefined;
  }
  
  
 
}

import { Component, OnInit } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseClientService } from '../services/supabase-client.service';
import { Role,AppUser } from '../model/user.model';
@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent {
  supabase!: SupabaseClient;
  supabaseAuth: any;
  workspaceName!: string;
  WorkspaceForm!: FormGroup;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private supabaseClientService: SupabaseClientService
              ) {
    this.supabase = createClient(
      'https://mljtanxsvdnervhrjnbs.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY'
    );
    this.workspaceName = '';
  }
  ngOnInit(): void {
    this.WorkspaceForm = this.formBuilder.group({
      nomEspace: ['', Validators.required]
    });
  }
  async onSubmitW() {
    if (this.WorkspaceForm.valid) {
      const formData = this.WorkspaceForm.value;
      try {
        const response = await this.supabaseClientService.insertWorkspace(formData.nomEspace);
        if (response.error) {
          console.error('Erreur lors de l\'enregistrement :', response.error);
          alert('Erreur lors de l\'enregistrement.');
          return;
        }
  
        const workspace = response.data;
  
        if (workspace) {
          console.log('Enregistrement réussi :', workspace);
          alert('Enregistrement réussi.');
          this.WorkspaceForm.reset();
  
          const currentUser = await this.supabaseClientService.getCurrentUser().toPromise();
          if (currentUser) {
            const roleInfo = await this.supabaseClientService.getRoleByName('ROLE_NAME');
            if (roleInfo) {
              // Insert data into the table UserRoleWorkspace
              const userRoleWorkspace = await this.supabaseClientService.insertWorkspaceWithUserRole(
                currentUser.id,
                workspace[0].idWorkspace,
                roleInfo.idRole
              );
  
              if (!userRoleWorkspace) {
                console.error('Error inserting data into UserRoleWorkspace');
              } else {
                console.log('Successfully inserted data into UserRoleWorkspace:', userRoleWorkspace);
              }
            } else {
              console.error('The specified role was not found.');
            }
          } else {
            console.error('Unauthenticated user.');
          }
  
          this.router.navigateByUrl('/admin/cvtemplate');
        } else {
          console.error('Erreur lors de l\'enregistrement :: Aucune donnée renvoyée');
          alert('Erreur lors de l\'enregistrement.');
        }
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement :', error);
        alert('Erreur lors de l\'enregistrement.');
      }
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }
  
  

}



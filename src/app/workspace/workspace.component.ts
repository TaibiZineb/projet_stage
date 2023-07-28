import { Component, OnInit } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseClientService } from '../services/supabase-client.service';
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
    console.log('Début de onSubmitW()');
    if (this.WorkspaceForm.valid) {
      const formData = this.WorkspaceForm.value;
      try {
        const response = await this.supabaseClientService.insertWorkspace(formData.nomEspace);
        if (response && response.error) {
          console.error('Erreur lors de l\'enregistrement :', response.error);
          alert('Erreur lors de l\'enregistrement.');
          return;
        }
        if (response && response.data) {
          const workspace = response.data;
          if (workspace) {
            console.log('Enregistrement réussi :', workspace);
            alert('Enregistrement réussi.');
            this.WorkspaceForm.reset();
            const currentUser = await this.supabaseClientService.getCurrentUser().toPromise();
            console.log('Current user:', currentUser);
            if (currentUser) {
              const roleInfo = await this.supabaseClientService.getRoleByName('Stage');
              console.log('Role info:', roleInfo);
              if (!roleInfo) {
                console.error('Le rôle spécifié n\'a pas été trouvé.');
                return;
              }
              try {
                // Insertion dans la table "UserRoleWorkspace"
                console.log('Inserting UserRoleWorkspace:', currentUser.id, workspace[0].idWorkspace, roleInfo.idRole);
                const userRoleWorkspaceResponse = await this.supabaseClientService.insertWorkspaceWithUserRole(
                  currentUser.id,
                  workspace[0].idWorkspace,
                  roleInfo.idRole
                );
                console.log('UserRoleWorkspace:', userRoleWorkspaceResponse);
                if (userRoleWorkspaceResponse && userRoleWorkspaceResponse.error) {
                  console.error('Erreur lors de l\'insertion dans UserRoleWorkspace:', userRoleWorkspaceResponse.error);
                } else {
                  console.log('Données insérées avec succès dans UserRoleWorkspace:', userRoleWorkspaceResponse);
                }
              } catch (error) {
                console.error('Erreur lors de l\'insertion dans UserRoleWorkspace:', error);
              }
            }
            this.router.navigateByUrl('/admin/cvtemplate');
          }
        } else {
          console.error('Aucune donnée renvoyée lors de l\'enregistrement.');
          alert('Aucune donnée renvoyée lors de l\'enregistrement.');
        }
  
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement :', error);
        alert('Erreur lors de l\'enregistrement.');
      }
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
    console.log('Fin de onSubmitW()');
  }
  


}



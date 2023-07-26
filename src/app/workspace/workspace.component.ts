import { Component, OnInit } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private router: Router, private formBuilder: FormBuilder) {
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
        const response = await this.supabase.from('Workspace').insert([
          {
            nomEspace: formData.nomEspace
          }
        ]);

        console.log('Enregistrement réussi :', response);
        alert('Enregistrement réussi.');
        this.WorkspaceForm.reset();

        // Redirect to another page
        this.router.navigateByUrl('/admin/home'); // Replace 'another-page' with the actual route you want to navigate to.
      } catch (error) {
        alert('Erreur lors de l\'enregistrement.');
        console.error('Erreur lors de l\'enregistrement :', error);
      }
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }
}

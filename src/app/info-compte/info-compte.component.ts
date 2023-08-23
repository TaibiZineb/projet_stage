import { Component,OnInit } from '@angular/core';
import { SupabaseClientService } from '../services/supabase-client.service';
import { createClient} from '@supabase/supabase-js';
import { AppUser} from '../model/user.model';

@Component({
  selector: 'app-info-compte',
  templateUrl: './info-compte.component.html',
  styleUrls: ['./info-compte.component.css']
})
export class InfoCompteComponent implements OnInit{
  supabaseUrl!: string;
  supabaseKey!: string;
  supabase: any;
  users: AppUser[] = [];
  authentificateUser: AppUser | null = null;
  userPhotoUrl: string | null = null;
  userWorkspaceName: string | null = null;
  workspaceCreationDate: string | null = null;
  userWorkspaceIcon: string | null = null;
 
  constructor(public supabaseAuth : SupabaseClientService){
    this.supabaseUrl = 'https://mljtanxsvdnervhrjnbs.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sanRhbnhzdmRuZXJ2aHJqbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NDczMDQsImV4cCI6MjAwMDQyMzMwNH0.lrhe---iFdN9RSFGgF5cYwN9S_aWpxYGur1TAvrD-ZY';
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  
  }
  ngOnInit(): void {
    this.supabaseAuth.getCurrentUser().subscribe(user => {
      if (user) {
        this.authentificateUser = user;
        this.userPhotoUrl = user.photo;
        this.supabaseAuth.getWorkspaceByUserId(user.id).then(workspace => {
          if (workspace) {
            this.userWorkspaceName = workspace.nomEspace;
            this.userWorkspaceIcon = workspace.icon;
           
            
          }
        });
      }
    });
  }
  

}

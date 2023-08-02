export interface AppUser {
    id: string; 
    email: string;
    prenom:string;
    nom: string;
    photo:string;
}
export interface Role {
    idRole: number;
    designationRole: string;
}
export interface Workspace {
    idWorkspace: number;
    nomEspace: string;
    icon: string; 
  }
  export interface WorkspaceData {
    idWorkspace: number;
    nomEspace: string;
    icon: string;
  }
export interface UserRoleWorkspace {
    id_user: string;
    idRole: number;
    idWorkspace: number;
}


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
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
export interface Resume {
  CandidateDetails: CandidateDetails;
  EmploymentHistory: EmploymentHistory;
  Educations: Educations;
  Langues: Langues;
  certifications: Certifications;
  Skills: Skills;

}
export interface CandidateDetails {
  FirstName: string;
  LastName: string;
  Email: string;
  Positions: 'relative' |'autre_valeur';
  role: string;
  telephone?: string;
  Anneesexperience?: string;
  }
export interface EmploymentHistory
{
  Positions: Positions[];
}
export interface Positions {
Nomentreprise: string;
Intituleposte: string;
Datedebut: string;
Datefin: string;
Description?: string;
}
export interface Educations {
Education: Education[];
}
export interface Education {
Nom_ecole: string;
Diplome: string;
VilleE?: string;
DatedebutF?: string;
DatefinF?: string;
}
export interface Langues {
Langue: Langue[];
}
export interface Langue {
titre_langue: string;
niveaulang?: string;
}
export interface Certifications {
Certification: Certification[];
}
export interface Certification {
titre_certificat: string;
DateCert?: string;
}
export interface Skills {
  TopSkills: SKill[];
}
export interface SKill {
  titre_comp: string;
}
export interface CV{
id_CV: number;
creatAt: Date;
createdBy: string;
data: string; 
jobPosition: string;
Nom_Candidat : string;
originalCV: string;
idworkspace: number; 
designationStatus: string;
designationTemplate: string;
}

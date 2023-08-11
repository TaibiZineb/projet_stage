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
  candidateDetails: CandidateDetails;
  historiques: historiques;
  Educations: Educations;
  languages: Languages;
  certifications: Certifications;
  Competences: Competences;
  OriginalCv: string;
}

export interface CandidateDetails {
  FirstName: string;
  LastName: string;
  Email: string;
  position: 'relative',
  role: string;
  Phone?: string;
  Anneesexperience?: string;
}
export interface historiques {
  Position: Position[];
}
export interface Position {
  Nomentreprise: string;
  PositionTitle: string;
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
  ville?: string;
  DatedebutF?: string;
  DatefinF?: string;
}
export interface Languages {
  Language: Language[];
}
export interface Language {
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

export interface Competences {
  TopSkills: Competence[];
}
export interface Competence {
  titre_comp: string;
}

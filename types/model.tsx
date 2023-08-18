

export interface Resume {
    candidateDetails: CandidateDetails;
    employementHistory: EmployementHistory;
    educationHistory: EducationHistory;
    languages: Languages;
    certifications: Certifications;
    skills: Skills;
    OriginalCv: string;
}

export interface CandidateDetails {
    FirstName: string;
    LastName: string;
    Email: string;
    Role: string;
    Phone?: string;
    YearsOfExperience?: string;
}

export interface EmployementHistory {
    Position: Position[];
}

export interface Position {
    CompanyName: string;
    PositionTitle: string;
    StartDate: string;
    EndDate: string;
    Description?: string;
}

export interface EducationHistory {
    Education: Education[];
}

export interface Education {
    School: string;
    Degree: string;
    City?: string;
    StartDate?: string;
    EndDate?: string;
}
export interface Languages {
    Language: Language[];
}
export interface Language {
    Name: string;
    Level?: string;
}
export interface Certifications {
    Certification: Certification[];
}
export interface Certification {
    Name: string;
    Date?: string;
}

export interface Skills {
    TopSkills: SKill[];
}
export interface SKill {
    Name: string;
}


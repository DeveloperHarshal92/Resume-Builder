export interface GenerateSummeryBody {
  experienceLevel: string;
  skills: string[];
  jobTitle: string;
}

export interface GenerateSkillsBody {
  experienceLevel: string;
  jobTitle: string;
}

export interface GenerateProjectDescriptionBody{
  experienceLevel: string;
  jobTitle: string;
  techStack: string[];
}


export interface GenerateExperienceDescriptionBody {
  experienceLevel: string;
  yearsOfExperience: number;
  techStack: string[];
  jobRole: string;
}
import { Types } from "mongoose";

export interface IPersonalInfo {
  fullname: string;
  email: string;
  mobile: string;
  location: string;
  github: string;
  linkedIn: string;
  portfolio: string;
}

export interface IWorkExperience {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface IProjects{
    title: string;
    description: string;
    githubUrl: string;
    liveUrl: string;
    techStack: string[];
}

export interface IEducation {
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface IResume{
    _id?: string;
    user_id: Types.ObjectId;
    title: string;
    summary: string;
    personalInfo: IPersonalInfo;
    workExperience?: IWorkExperience[];
    projects: IProjects[];
    education: IEducation[];
    certifications?: string[];
    achievements?: string[];
    skills: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

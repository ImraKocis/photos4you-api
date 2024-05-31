import e from 'express';

export interface GoogleProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  picture: string;
}

export interface GithubProfile {
  id: string;
  email: string;
  fullName: string;
  lastName: string;
  photo: string;
  displayName: string;
  username: string;
}

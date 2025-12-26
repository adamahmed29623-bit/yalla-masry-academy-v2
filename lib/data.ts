export type Project = {
  id: string;
  name: string;
  region: string;
  createdAt: string;
  projectId: string;
  authDomain?: string;
  userId: string;
};


export type User = {
  id: string;
  email: string;
  provider: string;
  createdAt: string;
  lastSignedIn: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  lastModified: number;
  workstreamId: string;
  links: string[]; // IDs of other connected notes
};

export type Workstream = {
  id: string;
  name: string;
  projectId: string;
};

export type Project = {
  id: string;
  name: string;
  customerId: string;
};

export type Customer = {
  id: string;
  name: string;
};

export type EnterpriseData = {
  customers: Customer[];
  projects: Project[];
  workstreams: Workstream[];
  notes: Note[];
};

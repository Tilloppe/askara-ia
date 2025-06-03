export interface Document {
  id: string;
  title: string;
  type: string;
  patient: {
    id: string;
    name: string;
  };
  status: 'brouillon' | 'finalisé' | 'envoyé' | 'signé';
  content: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  templateId?: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  fields: string[];
  tags: string[];
}

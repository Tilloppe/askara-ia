export interface Patient {
  id: string;
  name: string;
  birthDate?: string;
}

export interface DocumentMetadata {
  contactId?: string;
  [key: string]: any;
}

export interface Document {
  id: string;
  title: string;
  type: string;
  patient: Patient;
  status: 'brouillon' | 'finalisé' | 'envoyé' | 'signé';
  content: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  templateId?: string;
  metadata?: DocumentMetadata;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  fields: string[];
  tags: string[];
}

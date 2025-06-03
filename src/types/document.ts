import { Document } from './common';

export interface Contact {
  id: string;
  name: string;
  specialty: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Patient {
  id: string;
  name: string;
  [key: string]: any;
}

export interface DocumentMetadata {
  contactId?: string;
  [key: string]: any;
}

export type DocumentStatus = 'brouillon' | 'finalisé' | 'envoyé' | 'signé';

export interface DocumentWithTemplate extends Omit<Document, 'patient' | 'status' | 'metadata'> {
  id: string;
  templateId?: string;
  metadata?: DocumentMetadata;
  patient?: Patient;
  status?: DocumentStatus;
  tags?: string[];
  createdBy?: string;
  updatedAt?: string;
  createdAt?: string;
  title: string;
  content: string;
  [key: string]: any;
}

import type { Document, Patient } from './common';

export interface Contact {
  id: string;
  name: string;
  specialty: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface DocumentWithTemplate extends Omit<Document, 'patient' | 'status' | 'metadata'> {
  templateId?: string;
  metadata?: {
    contactId?: string;
    [key: string]: any;
  };
  patient?: Patient;
  status?: 'brouillon' | 'finalisé' | 'envoyé' | 'signé';
  [key: string]: any;
}

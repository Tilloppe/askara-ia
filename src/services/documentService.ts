/**
 * Service pour gérer les opérations liées aux documents
 */

import type { Document } from '../types/common';

// Données factices - À remplacer par des appels API dans une application réelle
const CONTACTS: Array<{id: string, name: string, email: string}> = [
  { id: 'orl', name: 'Médecin ORL', email: 'medecin.orl@example.com' },
  { id: 'traitant', name: 'Médecin traitant', email: 'medecin.traitant@example.com' },
  { id: 'autre', name: 'Autre destinataire', email: 'autre@example.com' },
];

// Données factices - À remplacer par des appels API dans une application réelle
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Compte-rendu de consultation',
    type: 'Consultation',
    patient: {
      id: '1',
      name: 'Jean Dupont',
    },
    status: 'finalisé',
    content: '**Consultation du 01/06/2025**\n\n**Motif de consultation:**\nBilan auditif et adaptation d\'appareillage\n\n**Observations:**\nLe patient présente une perte auditive bilatérale de perception.\n\n**Conclusion:**\nAdaptation d\'un appareillage auditif bilatéral.',
    createdAt: '01/06/2025 10:30',
    updatedAt: '01/06/2025 11:45',
    createdBy: 'Dr. Martin',
    tags: ['consultation', 'audition']
  },
  {
    id: '2',
    title: 'Ordonnance',
    type: 'Ordonnance',
    patient: {
      id: '2',
      name: 'Marie Durand',
    },
    status: 'envoyé',
    content: '**Ordonnance du 02/06/2025**\n\n**Médicaments:**\n- Paracétamol 1000mg: 1 comprimé 3x/jour pendant 5 jours',
    createdAt: '02/06/2025 09:15',
    updatedAt: '02/06/2025 09:15',
    createdBy: 'Dr. Martin',
    tags: ['ordonnance', 'traitement']
  }
];

// Utilisation de Document depuis les types communs

class DocumentService {
  /**
   * Récupère tous les documents
   */
  static async getAllDocuments(): Promise<Document[]> {
    // Simuler un appel API asynchrone
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockDocuments]);
      }, 300);
    });
  }

  /**
   * Récupère un document par son ID
   */
  static async getDocumentById(id: string): Promise<Document | undefined> {
    // Simuler un appel API asynchrone
    return new Promise((resolve) => {
      setTimeout(() => {
        const doc = mockDocuments.find(doc => doc.id === id);
        resolve(doc ? { ...doc } : undefined);
      }, 200);
    });
  }

  /**
   * Crée un nouveau document
   */
  static async createDocument(document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<Document> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDoc: Document = {
          ...document,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockDocuments.push(newDoc);
        resolve({ ...newDoc });
      }, 300);
    });
  }

  /**
   * Met à jour un document existant
   */
  static async updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockDocuments.findIndex(doc => doc.id === id);
        if (index === -1) {
          resolve(undefined);
          return;
        }
        
        const updatedDoc = {
          ...mockDocuments[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        
        mockDocuments[index] = updatedDoc;
        resolve({ ...updatedDoc });
      }, 300);
    });
  }

  /**
   * Supprime un document
   */
  static async deleteDocument(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = mockDocuments.length;
        const filteredDocs = mockDocuments.filter(doc => doc.id !== id);
        const success = filteredDocs.length < initialLength;
        
        if (success) {
          // Dans une application réelle, on mettrait à jour la source de données
          // Ici, on modifie directement le tableau pour la démo
          mockDocuments.length = 0;
          mockDocuments.push(...filteredDocs);
        }
        
        resolve(success);
      }, 300);
    });
  }

  /**
   * Filtre les documents par statut
   */
  static async filterByStatus(status: string): Promise<Document[]> {
    if (status === 'all') {
      return this.getAllDocuments();
    }
    
    const documents = await this.getAllDocuments();
    return documents.filter(doc => doc.status === status);
  }

  /**
   * Filtre les documents par type
   */
  static async filterByType(type: string): Promise<Document[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockDocuments.filter(doc => doc.type.toLowerCase() === type.toLowerCase());
        resolve([...filtered]);
      }, 300);
    });
  }

  /**
   * Recherche des documents par terme
   */
  static async searchDocuments(term: string): Promise<Document[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const searchTerm = term.toLowerCase();
        const results = mockDocuments.filter(
          doc =>
            doc.title.toLowerCase().includes(searchTerm) ||
            doc.content.toLowerCase().includes(searchTerm) ||
            doc.patient.name.toLowerCase().includes(searchTerm)
        );
        resolve([...results]);
      }, 300);
    });
  }

  /**
   * Envoie un document par email
   */
  static async sendDocumentByEmail(documentId: string, recipientEmail: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Document ${documentId} envoyé à ${recipientEmail}`);
        // Dans une application réelle, on ferait un appel API ici
        resolve(true);
      }, 1000);
    });
  }

  /**
   * Récupère les contacts disponibles pour l'envoi de documents
   */
  static async getContacts(): Promise<Array<{id: string, name: string, email: string}>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...CONTACTS]);
      }, 200);
    });
  }
}

// Exportation des méthodes du service
export const documentService = {
  getAllDocuments: DocumentService.getAllDocuments,
  getDocumentById: DocumentService.getDocumentById,
  createDocument: DocumentService.createDocument,
  updateDocument: DocumentService.updateDocument,
  deleteDocument: DocumentService.deleteDocument,
  sendDocumentByEmail: DocumentService.sendDocumentByEmail,
  getContacts: DocumentService.getContacts,
  filterDocuments: (documents: Document[], filters: { status?: string; type?: string }) => {
    return documents.filter(doc => {
      if (filters.status && filters.status !== 'all' && doc.status !== filters.status) return false;
      if (filters.type && filters.type !== 'all' && doc.type !== filters.type) return false;
      return true;
    });
  },
  searchDocuments: (documents: Document[], query: string) => {
    if (!query) return documents;
    const searchLower = query.toLowerCase();
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(searchLower) ||
      doc.patient.name.toLowerCase().includes(searchLower) ||
      doc.content.toLowerCase().includes(searchLower)
    );
  }
};

export default DocumentService;

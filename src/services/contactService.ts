// Service pour gérer les contacts
export interface Contact {
  id: number;
  type: 'Médecin' | 'Patient' | 'Autre';
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  specialty?: string;
  createdAt: string;
  createdBy: string;
}

// Récupérer tous les contacts
export const getContacts = (): Promise<Contact[]> => {
  // Dans une vraie application, ce serait un appel API
  const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  return Promise.resolve(contacts);
};

// Récupérer un contact par son ID
export const getContactById = (id: number): Promise<Contact | undefined> => {
  return getContacts().then(contacts => 
    contacts.find(contact => contact.id === id)
  );
};

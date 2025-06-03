import { useState, useEffect } from 'react';
import { 
  Box, 
  Select, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  useDisclosure, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalCloseButton,
  VStack,
  HStack,
  IconButton
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

interface Contact {
  id: string;
  name: string;
  specialty: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface ContactSelectorProps {
  onSelect: (contact: Contact | null) => void;
  selectedContact: Contact | null;
}

export default function ContactSelector({ onSelect, selectedContact }: ContactSelectorProps) {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('doctorContacts');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({ 
    name: '', 
    specialty: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    localStorage.setItem('doctorContacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleAddContact = () => {
    const contact: Contact = {
      id: Date.now().toString(),
      ...newContact
    };
    
    setContacts([...contacts, contact]);
    setNewContact({ name: '', specialty: '', email: '', phone: '', address: '' });
    onClose();
  };

  const handleDeleteContact = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    setContacts(updatedContacts);
    
    if (selectedContact?.id === id) {
      onSelect(null);
    }
  };

  return (
    <Box width="100%">
      <FormControl mb={4}>
        <FormLabel>Médecin</FormLabel>
        <HStack spacing={2}>
          <Select
            placeholder="Sélectionner un contact"
            value={selectedContact?.id || ''}
            onChange={(e) => {
              const contact = contacts.find(c => c.id === e.target.value) || null;
              onSelect(contact);
            }}
          >
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                Dr {contact.name} - {contact.specialty}
              </option>
            ))}
          </Select>
          <IconButton
            aria-label="Ajouter un contact"
            icon={<AddIcon />}
            onClick={onOpen}
          />
        </HStack>
      </FormControl>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ajouter un médecin</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nom</FormLabel>
                <Input 
                  placeholder="Nom du médecin" 
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Spécialité</FormLabel>
                <Input 
                  placeholder="Spécialité (ex: ORL, Médecin traitant)" 
                  value={newContact.specialty}
                  onChange={(e) => setNewContact({...newContact, specialty: e.target.value})}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input 
                  type="email" 
                  placeholder="Email" 
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Téléphone</FormLabel>
                <Input 
                  type="tel" 
                  placeholder="Téléphone" 
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Adresse</FormLabel>
                <Input 
                  placeholder="Adresse du cabinet" 
                  value={newContact.address}
                  onChange={(e) => setNewContact({...newContact, address: e.target.value})}
                />
              </FormControl>
              
              <Button 
                colorScheme="blue" 
                onClick={handleAddContact}
                isDisabled={!newContact.name || !newContact.specialty}
              >
                Ajouter le contact
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

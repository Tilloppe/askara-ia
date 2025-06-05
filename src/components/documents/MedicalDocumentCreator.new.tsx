import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
  InputGroup,
  InputLeftElement,
  IconButton,
  Badge
} from '@chakra-ui/react';
import { AddIcon, Search2Icon, PhoneIcon, ChatIcon } from '@chakra-ui/icons';

// Types
interface Patient {
  id: string;
  name: string;
  birthDate?: string;
}

interface Contact {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: 'Médecin' | 'Patient' | 'Autre';
  specialty?: string;
}

interface DocumentTemplate {
  id: string;
  title: string;
  content: string;
  fields: string[];
}

interface MedicalDocumentCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (document: {
    templateId: string;
    patientId: string;
    data: Record<string, string>;
    contacts: Contact[];
  }) => Promise<void>;
  templates: DocumentTemplate[];
  patients: Patient[];
}

export default function MedicalDocumentCreator({
  isOpen,
  onClose,
  onSave,
  templates,
  patients,
}: MedicalDocumentCreatorProps) {
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [documentData, setDocumentData] = useState<Record<string, string>>({});
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [availableContacts, setAvailableContacts] = useState<Contact[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const recognitionRef = useRef<any>(null);

  // Charger les contacts disponibles
  useEffect(() => {
    // Simuler le chargement des contacts
    const mockContacts: Contact[] = [
      {
        id: 1,
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        phone: '0123456789',
        type: 'Médecin',
        specialty: 'ORL'
      },
      {
        id: 2,
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@example.com',
        phone: '0987654321',
        type: 'Médecin',
        specialty: 'Généraliste'
      }
    ];
    setAvailableContacts(mockContacts);
  }, []);

  // Initialiser la reconnaissance vocale
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'fr-FR';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (activeField) {
            setDocumentData(prev => ({
              ...prev,
              [activeField]: (prev[activeField] || '') + ' ' + transcript
            }));
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Erreur de reconnaissance vocale', event.error);
          toast({
            title: 'Erreur',
            description: 'Une erreur est survenue avec la reconnaissance vocale',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [activeField, toast]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    const template = templates.find(t => t.id === templateId) || null;
    setSelectedTemplate(template);
  };

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value;
    const patient = patients.find(p => p.id === patientId) || null;
    setSelectedPatient(patient);
  };

  const handleFieldChange = (field: string, value: string) => {
    setDocumentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const startDictation = (field: string) => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    setActiveField(field);
    setIsListening(true);
    try {
      recognitionRef.current?.start();
    } catch (error) {
      console.error('Erreur lors du démarrage de la dictée:', error);
      setIsListening(false);
    }
  };

  const handleAddContact = (contact: Contact) => {
    if (!contacts.some(c => c.id === contact.id)) {
      setContacts([...contacts, contact]);
    }
    setIsContactModalOpen(false);
  };

  const removeContact = (contactId: number | string) => {
    setContacts(contacts.filter(contact => contact.id !== contactId));
  };

  const handleSave = async () => {
    if (!selectedTemplate || !selectedPatient) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un modèle et un patient',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSaving(true);
      await onSave({
        templateId: selectedTemplate.id,
        patientId: selectedPatient.id,
        data: documentData,
        contacts: contacts,
      });
      
      toast({
        title: 'Document créé',
        description: 'Le document a été créé avec succès',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Réinitialiser le formulaire
      setSelectedTemplate(null);
      setSelectedPatient(null);
      setDocumentData({});
      setContacts([]);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du document:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la création du document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Modal de sélection de contact */}
      <Modal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sélectionner un contact</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup mb={4}>
              <InputLeftElement pointerEvents="none">
                <Search2Icon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Rechercher un contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <VStack spacing={2} maxH="400px" overflowY="auto">
              {availableContacts
                .filter(contact => 
                  `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (contact.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(contact => (
                  <HStack 
                    key={contact.id}
                    p={3}
                    borderWidth={1}
                    borderRadius="md"
                    w="100%"
                    justify="space-between"
                    _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                    onClick={() => handleAddContact(contact)}
                  >
                    <Box>
                      <Text fontWeight="bold">{contact.firstName} {contact.lastName}</Text>
                      {contact.specialty && (
                        <Text fontSize="sm" color="blue.600">{contact.specialty}</Text>
                      )}
                      <Text fontSize="sm">{contact.email}</Text>
                      {contact.phone && <Text fontSize="sm">{contact.phone}</Text>}
                    </Box>
                  </HStack>
                ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              onClick={() => setIsContactModalOpen(false)}
            >
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal principal de création de document */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Créer un nouveau document</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <HStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Modèle de document</FormLabel>
                  <Select
                    placeholder="Sélectionner un modèle"
                    onChange={handleTemplateChange}
                    value={selectedTemplate?.id || ''}
                  >
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.title}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Patient</FormLabel>
                  <Select
                    placeholder="Sélectionner un patient"
                    onChange={handlePatientChange}
                    value={selectedPatient?.id || ''}
                  >
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Contacts associés</FormLabel>
                <VStack spacing={2} mb={4}>
                  {contacts.map(contact => (
                    <HStack 
                      key={`${contact.id}-${contacts.indexOf(contact)}`}
                      p={3}
                      borderWidth={1}
                      borderRadius="md"
                      w="100%"
                      justify="space-between"
                    >
                      <Box>
                        <Text fontWeight="bold">{contact.firstName} {contact.lastName}</Text>
                        {contact.specialty && (
                          <Text fontSize="sm" color="blue.600">{contact.specialty}</Text>
                        )}
                        <Text fontSize="sm">{contact.email}</Text>
                        {contact.phone && <Text fontSize="sm">{contact.phone}</Text>}
                      </Box>
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeContact(contact.id);
                        }}
                      >
                        Supprimer
                      </Button>
                    </HStack>
                  ))}
                </VStack>
                <Button 
                  leftIcon={<AddIcon />} 
                  colorScheme="blue" 
                  variant="outline"
                  onClick={() => setIsContactModalOpen(true)}
                  mb={4}
                >
                  Ajouter un contact
                </Button>
              </FormControl>

              {selectedTemplate && selectedTemplate.fields.map(field => (
                <FormControl key={field}>
                  <FormLabel>{field}</FormLabel>
                  <HStack>
                    <Textarea
                      value={documentData[field] || ''}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      placeholder={`Saisissez ${field.toLowerCase()}`}
                      rows={3}
                    />
                    <IconButton
                      aria-label="Dictée vocale"
                      icon={isListening && activeField === field ? 
                        <Box w="4" h="4" borderRadius="full" bg="red.500" /> : 
                        <ChatIcon />}
                      onClick={() => startDictation(field)}
                      colorScheme={isListening && activeField === field ? 'red' : 'blue'}
                      variant={isListening && activeField === field ? 'solid' : 'outline'}
                    />
                  </HStack>
                </FormControl>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Annuler
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSave}
              isLoading={isSaving}
              loadingText="Enregistrement..."
            >
              Enregistrer le document
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

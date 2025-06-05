import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  useToast,
  IconButton,
  Tooltip,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  Spinner
} from '@chakra-ui/react';
import { AddIcon, Search2Icon, PhoneIcon, ChatIcon, CloseIcon } from '@chakra-ui/icons';

// Types
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
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
    title: string;
    content: string;
    patientId: string;
    templateId: string;
    contacts?: Contact[];
  }) => Promise<void>;
  patients: Patient[];
  templates: DocumentTemplate[];
}

const MedicalDocumentCreator: React.FC<MedicalDocumentCreatorProps> = ({
  isOpen,
  onClose,
  onSave,
  patients,
  templates,
}) => {
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [documentData, setDocumentData] = useState<Record<string, string>>({});
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [documentPreview, setDocumentPreview] = useState('');
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
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
          handleRecognitionResult(transcript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          toast({
            title: 'Erreur de reconnaissance vocale',
            description: event.error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
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

  // Mettre à jour l'aperçu du document lorsque les données changent
  useEffect(() => {
    if (selectedTemplate) {
      let preview = selectedTemplate.content;
      
      // Remplacer chaque champ par sa valeur ou le surligner si c'est le champ actif
      selectedTemplate.fields.forEach((field, index) => {
        const fieldTag = `[${field}]`;
        const fieldValue = documentData[field] || '';
        const isActive = index === currentFieldIndex && isListening;
        
        preview = preview.replace(
          new RegExp(escapeRegExp(fieldTag), 'g'),
          isActive 
            ? `[[${fieldValue}]]` // Mettre en surbrillance le champ actif
            : fieldValue || fieldTag // Afficher la valeur ou la balise si vide
        );
      });
      
      setDocumentPreview(preview);
    }
  }, [documentData, selectedTemplate, currentFieldIndex, isListening]);

  // Fonction utilitaire pour échapper les caractères spéciaux dans les regex
  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };
  
  // Gestion du résultat de la reconnaissance vocale
  const handleRecognitionResult = (transcript: string) => {
    if (activeField) {
      setDocumentData(prev => ({
        ...prev,
        [activeField]: (prev[activeField] || '') + ' ' + transcript
      }));
      
      // Passe automatiquement au champ suivant après un court délai
      setTimeout(moveToNextField, 500);
    }
    setIsListening(false);
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    const template = templates.find(t => t.id === templateId) || null;
    setSelectedTemplate(template);
    
    // Initialize document data with empty values for template fields
    if (template) {
      const initialData: Record<string, string> = {};
      template.fields.forEach(field => {
        initialData[field] = '';
      });
      setDocumentData(initialData);
      setDocumentPreview(template.content);
    } else {
      setDocumentPreview('');
    }
  };

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value;
    const patient = patients.find(p => p.id === patientId) || null;
    setSelectedPatient(patient);
  };

  const handleFieldChange = (field: string, value: string) => {
    const newData = {
      ...documentData,
      [field]: value
    };
    setDocumentData(newData);
  };

  const toggleRecording = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!selectedTemplate) return;
    
    // Trouver le prochain champ vide ou le premier champ
    const nextFieldIndex = selectedTemplate.fields.findIndex(
      (_, index) => index >= currentFieldIndex && !documentData[selectedTemplate.fields[index]]
    );
    
    const fieldIndex = nextFieldIndex !== -1 ? nextFieldIndex : 0;
    const field = selectedTemplate.fields[fieldIndex];
    
    setCurrentFieldIndex(fieldIndex);
    setActiveField(field);
    setIsListening(true);
    
    try {
      recognitionRef.current?.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
    }
  };
  
  // Passe au champ suivant après la reconnaissance vocale
  const moveToNextField = () => {
    if (!selectedTemplate) return;
    
    const nextIndex = (currentFieldIndex + 1) % selectedTemplate.fields.length;
    setCurrentFieldIndex(nextIndex);
    setActiveField(selectedTemplate.fields[nextIndex]);
  };

  const handleAddContact = (contact: Contact) => {
    if (!contacts.some(c => c.id === contact.id)) {
      setContacts([...contacts, contact]);
    }
    setIsContactModalOpen(false);
  };

  const handleRemoveContact = (contactId: number | string) => {
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
        title: selectedTemplate.title,
        content: JSON.stringify(documentData),
        patientId: selectedPatient.id,
        templateId: selectedTemplate.id,
        contacts: contacts
      });
      
      // Reset form
      setSelectedTemplate(null);
      setSelectedPatient(null);
      setDocumentData({});
      setContacts([]);
      onClose();
      
      toast({
        title: 'Document enregistré',
        description: 'Le document a été enregistré avec succès',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'enregistrement du document',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Mock contacts data - in a real app, this would come from an API
  const availableContacts: Contact[] = [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com',
      phone: '0123456789',
      type: 'Médecin',
      specialty: 'Cardiologue'
    },
    {
      id: 2,
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@example.com',
      phone: '0987654321',
      type: 'Médecin',
      specialty: 'Généraliste'
    },
    {
      id: 3,
      firstName: 'Pierre',
      lastName: 'Durand',
      email: 'pierre.durand@example.com',
      phone: '0612345678',
      type: 'Autre',
      specialty: 'Radiologue'
    }
  ];

  return (
    <>
      {/* Contact selection modal */}
      <Modal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sélectionner un contact</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Search2Icon color="gray.300" />
                </InputLeftElement>
                <Input placeholder="Rechercher un contact..." />
              </InputGroup>
              
              <VStack spacing={2} w="100%" maxH="300px" overflowY="auto">
                {availableContacts.map(contact => (
                  <HStack 
                    key={contact.id}
                    p={2} 
                    borderWidth={1} 
                    borderRadius="md" 
                    w="100%"
                    justify="space-between"
                  >
                    <Box>
                      <Text fontWeight="medium">
                        {contact.firstName} {contact.lastName}
                        {contact.specialty && ` (${contact.specialty})`}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {contact.email} • {contact.phone}
                      </Text>
                    </Box>
                    <Button 
                      size="sm" 
                      colorScheme="blue"
                      onClick={() => handleAddContact(contact)}
                      isDisabled={contacts.some(c => c.id === contact.id)}
                    >
                      {contacts.some(c => c.id === contact.id) ? 'Ajouté' : 'Ajouter'}
                    </Button>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsContactModalOpen(false)}>Fermer</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Main document creation modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Créer un nouveau document</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Modèle de document</FormLabel>
                  <Select
                    placeholder="Sélectionner un modèle"
                    value={selectedTemplate?.id || ''}
                    onChange={handleTemplateChange}
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
                    value={selectedPatient?.id || ''}
                    onChange={handlePatientChange}
                  >
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName}
                        {patient.birthDate && ` (${new Date(patient.birthDate).toLocaleDateString('fr-FR')})`}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              {/* Champs cachés pour la compatibilité avec le code existant */}
              <div style={{ display: 'none' }}>
                {selectedTemplate?.fields.map(field => (
                  <input
                    key={field}
                    name={field}
                    value={documentData[field] || ''}
                    onChange={() => {}}
                  />
                ))}
              </div>

              {/* Aperçu du document avec champs à remplir */}
              <Box mt={6}>
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="bold">Rédaction du document</Text>
                  <Button
                    leftIcon={isListening ? <CloseIcon /> : <ChatIcon />}
                    colorScheme={isListening ? 'red' : 'blue'}
                    onClick={toggleRecording}
                    isLoading={isListening}
                    loadingText="En cours d'écoute..."
                  >
                    {isListening ? 'Arrêter la dictée' : 'Démarrer la dictée'}
                  </Button>
                </HStack>
                
                <Box
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  bg="white"
                  whiteSpace="pre-wrap"
                  minH="300px"
                  maxH="500px"
                  overflowY="auto"
                  fontFamily="body"
                  lineHeight="tall"
                  fontSize="md"
                  onClick={(e) => {
                    // Permet de cliquer sur un champ pour le sélectionner
                    const target = e.target as HTMLElement;
                    const fieldElement = target.closest('[data-field]') as HTMLElement;
                    if (fieldElement) {
                      const fieldName = fieldElement.dataset.field;
                      if (fieldName) {
                        const index = selectedTemplate?.fields.indexOf(fieldName) ?? -1;
                        if (index !== -1) {
                          setCurrentFieldIndex(index);
                          setActiveField(fieldName);
                        }
                      }
                    }
                  }}
                  dangerouslySetInnerHTML={{
                    __html: selectedTemplate 
                      ? documentPreview.replace(
                          /\[\[(.*?)\]\]/g, 
                          (_, content) => 
                            `<span style="background: #E6F7FF; padding: 2px 4px; border-radius: 3px; border: 1px solid #91D5FF;" data-field="${selectedTemplate.fields[currentFieldIndex]}">${content}</span>`
                        )
                      : '<span style="color: #999;">Sélectionnez un modèle de document pour commencer</span>'
                  }}
                />
                
                {selectedTemplate && (
                  <Text mt={2} fontSize="sm" color="gray.500">
                    {isListening 
                      ? `En train de dicter pour le champ: ${selectedTemplate.fields[currentFieldIndex]}`
                      : `Prochain champ: ${selectedTemplate.fields[currentFieldIndex]}`}
                  </Text>
                )}
              </Box>

              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="bold">Contacts associés</Text>
                  <Button
                    leftIcon={<AddIcon />}
                    size="sm"
                    onClick={() => setIsContactModalOpen(true)}
                  >
                    Ajouter un contact
                  </Button>
                </HStack>
                
                {contacts.length > 0 ? (
                  <VStack spacing={2} align="stretch">
                    {contacts.map(contact => (
                      <HStack
                        key={contact.id}
                        p={3}
                        borderWidth={1}
                        borderRadius="md"
                        justify="space-between"
                      >
                        <Box>
                          <Text fontWeight="medium">
                            {contact.firstName} {contact.lastName}
                            {contact.specialty && ` (${contact.specialty})`}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {contact.email} • {contact.phone}
                          </Text>
                        </Box>
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleRemoveContact(contact.id)}
                        >
                          Supprimer
                        </Button>
                      </HStack>
                    ))}
                  </VStack>
                ) : (
                  <Text color="gray.500" fontStyle="italic">
                    Aucun contact associé pour le moment
                  </Text>
                )}
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose} isDisabled={isSaving}>
              Annuler
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSave}
              isLoading={isSaving}
              loadingText="Enregistrement..."
              isDisabled={!selectedTemplate || !selectedPatient}
            >
              Enregistrer le document
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MedicalDocumentCreator;

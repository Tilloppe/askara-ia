import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import {
  Button,
  Box,
  VStack,
  HStack,
  Select,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Text,
  useToast,
  SimpleGrid
} from '@chakra-ui/react';
import { ContactSelector } from './ContactSelector';
import { documentService } from '../../services/documentService';
import DocumentPreview from './DocumentPreview';
import DocumentTemplateService from '../../services/documentTemplateService';

// Composant pour la reconnaissance vocale (chargé de manière paresseuse)
const VoiceInput = React.lazy(() => import('./VoiceInput'));

// Types
type Patient = {
  id: string;
  name: string;
  birthDate: string;
};

type Contact = {
  id: string;
  name: string;
  email: string;
};

// Mock des patients - À remplacer par un appel API dans une application réelle
const mockPatients: Patient[] = [
  { id: '1', name: 'Jean Dupont', birthDate: '15/03/1980' },
  { id: '2', name: 'Marie Martin', birthDate: '22/07/1990' },
];

// Mock des contacts - À remplacer par un appel API dans une application réelle
const mockContacts: Contact[] = [
  { id: '1', name: 'Dr. Smith', email: 'dr.smith@example.com' },
  { id: '2', name: 'Dr. Johnson', email: 'dr.johnson@example.com' },
];

interface DocumentTemplateSelectorProps {
  onSelect: (document: any) => void;
  buttonText?: string;
  buttonProps?: any;
}

const DocumentTemplateSelector = ({
  onSelect,
  buttonText = 'Nouveau document',
  buttonProps = {},
}: DocumentTemplateSelectorProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<{ title: string; content: string }>({
    title: '',
    content: ''
  });
  const [isListening, setIsListening] = useState(false);
  const activeFieldRef = useRef<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [contacts] = useState<Contact[]>(mockContacts);
  const [patients] = useState<Patient[]>(mockPatients);

  // Charger les modèles de documents
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templatesData = await DocumentTemplateService.getTemplates();
        setTemplates(templatesData);
      } catch (error) {
        console.error('Erreur lors du chargement des modèles:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les modèles de documents',
          status: 'error',
          duration: 5000,
        });
      }
    };

    loadTemplates();
  }, [toast]);

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    const template = templates.find(t => t.id === templateId) || null;
    setSelectedTemplate(template);
    
    if (template) {
      setFormData(prev => ({
        ...prev,
        title: template.name,
        content: template.content
      }));
    }
  };

  const handlePatientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value;
    const patient = patients.find(p => p.id === patientId) || null;
    setSelectedPatient(patient);
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleVoiceResult = useCallback((text: string) => {
    if (activeFieldRef.current) {
      setFormData(prev => ({
        ...prev,
        [activeFieldRef.current as string]: text
      }));
    }
  }, []);

  const handleVoiceStart = useCallback((fieldName: string) => {
    activeFieldRef.current = fieldName;
    setIsListening(true);
  }, []);

  const handleVoiceStop = useCallback(() => {
    setIsListening(false);
    activeFieldRef.current = null;
  }, []);
  
  const handleSaveDocument = useCallback(async (doc: { title: string; content: string; patient: Patient; type: string; templateId: string }) => {
    if (!selectedTemplate || !selectedPatient) return null;
    
    setIsSaving(true);
    try {
      const newDocument = {
        ...doc,
        patient: selectedPatient,
        recipient: selectedContact,
        status: 'brouillon',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'currentUser', // À remplacer par l'utilisateur connecté
        tags: [],
        templateId: selectedTemplate.id
      };
      
      const savedDoc = await documentService.createDocument(newDocument);
      onSelect(savedDoc);
      onClose();
      
      toast({
        title: 'Document enregistré',
        description: 'Le document a été enregistré avec succès',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du document:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'enregistrement du document',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  }, [selectedTemplate, selectedPatient, selectedContact, onClose, onSelect, toast]);

  const handleSendDocument = useCallback(async () => {
    if (!selectedTemplate || !selectedPatient || !selectedContact) return;
    
    setIsSending(true);
    try {
      const newDocument = {
        title: formData.title,
        content: formData.content,
        patient: selectedPatient,
        recipient: selectedContact,
        type: selectedTemplate.type,
        status: 'envoyé',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'currentUser', // À remplacer par l'utilisateur connecté
        tags: [],
        templateId: selectedTemplate.id
      };
      
      const savedDoc = await documentService.createDocument(newDocument);
      
      // Ici, vous pourriez ajouter la logique pour envoyer l'email
      
      onSelect(savedDoc);
      onClose();
      
      toast({
        title: 'Document envoyé',
        description: 'Le document a été envoyé avec succès',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du document:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'envoi du document',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  }, [selectedTemplate, selectedPatient, selectedContact, formData, onClose, onSelect, toast]);

  return (
    <>
      <Button onClick={onOpen} {...buttonProps}>
        {buttonText}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Créer un nouveau document</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={2} spacing={8}>
              <Box>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel>Modèle de document</FormLabel>
                    <Select
                      placeholder="Sélectionnez un modèle"
                      value={selectedTemplate?.id || ''}
                      onChange={handleTemplateSelect}
                    >
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Patient</FormLabel>
                    <Select
                      placeholder="Sélectionnez un patient"
                      value={selectedPatient?.id || ''}
                      onChange={handlePatientSelect}
                    >
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} ({patient.birthDate})
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Destinataire</FormLabel>
                    <ContactSelector
                      contacts={contacts}
                      selectedContact={selectedContact}
                      onSelect={setSelectedContact}
                    />
                  </FormControl>

                  {selectedTemplate && selectedPatient && (
                    <>
                      <FormControl isRequired>
                        <FormLabel>Titre du document</FormLabel>
                        <HStack>
                          <Input
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Titre du document"
                          />
                          <Suspense fallback={<span>Chargement...</span>}>
                            <VoiceInput
                              onResult={handleVoiceResult}
                              isListening={isListening && activeFieldRef.current === 'title'}
                              onStart={() => handleVoiceStart('title')}
                              onStop={handleVoiceStop}
                            />
                          </Suspense>
                        </HStack>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Contenu du document</FormLabel>
                        <VStack align="stretch">
                          <HStack>
                            <Textarea
                              name="content"
                              value={formData.content}
                              onChange={handleInputChange}
                              placeholder="Contenu du document"
                              minH="200px"
                            />
                            <Suspense fallback={<span>Chargement...</span>}>
                              <VoiceInput
                                onResult={handleVoiceResult}
                                isListening={isListening && activeFieldRef.current === 'content'}
                                onStart={() => handleVoiceStart('content')}
                                onStop={handleVoiceStop}
                              />
                            </Suspense>
                          </HStack>
                          <Text fontSize="sm" color="gray.500">
                            Astuce : Utilisez "nouvelle ligne" pour ajouter un saut de ligne
                          </Text>
                        </VStack>
                      </FormControl>
                    </>
                  )}
                </VStack>
              </Box>

              <Box>
                {selectedTemplate && selectedPatient && (
                  <DocumentPreview
                    title={formData.title}
                    content={formData.content}
                    patient={selectedPatient}
                    template={selectedTemplate}
                  />
                )}
              </Box>
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Annuler
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleSaveDocument({
                ...formData,
                patient: selectedPatient!,
                type: selectedTemplate?.type || '',
                templateId: selectedTemplate?.id || ''
              })}
              isDisabled={!selectedTemplate || !selectedPatient || !formData.title || !formData.content}
              isLoading={isSaving}
              leftIcon={<span>💾</span>}
            >
              Enregistrer le brouillon
            </Button>
            <Button
              colorScheme="green"
              onClick={handleSendDocument}
              isLoading={isSending}
              leftIcon={<span>✉️</span>}
              isDisabled={!selectedTemplate || !selectedPatient || !selectedContact || !formData.title || !formData.content}
            >
              Envoyer par email
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DocumentTemplateSelector;

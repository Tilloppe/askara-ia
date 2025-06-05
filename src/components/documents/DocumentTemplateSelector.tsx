import { useState, useEffect, useCallback } from 'react';
import { 
  Button, 
  Box, 
  VStack, 
  Select, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea, 
  HStack,
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

// Types
type Patient = {
  id: string;
  name: string;
  birthDate: string;
};

type Document = {
  id: string;
  title: string;
  content: string;
  type: string;
  patient: Patient | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
  templateId: string;
};

// Mock des patients - À remplacer par un appel API dans une application réelle
const mockPatients: Patient[] = [
  { id: '1', name: 'Jean Dupont', birthDate: '15/03/1975' },
  { id: '2', name: 'Marie Durand', birthDate: '22/07/1982' },
  { id: '3', name: 'Pierre Martin', birthDate: '10/11/1968' },
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
  
  // États
  const [templates, setTemplates] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // État pour le formulaire
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

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
          isClosable: true,
        });
      }
    };

    loadTemplates();
  }, [toast]);

  // Charger les contacts
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const contactsData = await documentService.getContacts();
        setContacts(contactsData);
      } catch (error) {
        console.error('Erreur lors du chargement des contacts:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les contacts',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    
    loadContacts();
  }, [toast]);

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const template = templates.find(t => t.id === value) || null;
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
    const value = e.target.value;
    const patient = mockPatients.find(p => p.id === value) || null;
    setSelectedPatient(patient);
  };

  const handleInputChange = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleGenerateDocument = async () => {
    if (!selectedTemplate || !selectedPatient) return;
    
    setIsGenerating(true);
    try {
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('Erreur lors de la génération du document:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDocument = useCallback(async (doc: any): Promise<any> => {
    if (!selectedTemplate || !selectedPatient) return null;
    
    setIsSaving(true);
    
    try {
      const documentToSave = {
        ...doc,
        patient: selectedPatient,
        type: selectedTemplate.name,
        status: 'brouillon',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Utilisateur',
        tags: selectedTemplate.tags || [],
        templateId: selectedTemplate.id
      };
      
      const savedDoc = await documentService.createDocument(documentToSave);
      
      toast({
        title: 'Document enregistré',
        description: 'Le document a été enregistré avec succès.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      onSelect(savedDoc);
      onClose();
      
      // Réinitialiser le formulaire
      setSelectedTemplate(null);
      setSelectedPatient(null);
      setFormData({ title: '', content: '' });
      
      return savedDoc;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du document:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde du document.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [selectedTemplate, selectedPatient, onSelect, onClose, toast]);

  const handleSendDocument = async (document: any, recipient: string) => {
    if (!document) return;
    
    try {
      await documentService.sendDocumentByEmail(document.id, recipient);
      
      await documentService.updateDocument(document.id, {
        ...document,
        status: 'envoyé',
        updatedAt: new Date().toISOString(),
      });
      
      toast({
        title: 'Document envoyé',
        description: 'Le document a été envoyé avec succès.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      setIsPreviewOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du document:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'envoi du document.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };

  return (
    <Box>
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
                      {mockPatients.map((patient) => (
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

                  <FormControl isRequired>
                    <FormLabel>Titre du document</FormLabel>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Titre du document"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Contenu du document</FormLabel>
                    <Textarea
                      name="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Contenu du document"
                      minH="200px"
                    />
                  </FormControl>

                  <HStack spacing={4} mt={4}>
                    <Button
                      colorScheme="blue"
                      onClick={handleGenerateDocument}
                      isDisabled={!selectedTemplate || !selectedPatient}
                      isLoading={isGenerating}
                    >
                      Prévisualiser
                    </Button>
                    <Button
                      colorScheme="green"
                      onClick={() => handleSaveDocument({
                        ...formData,
                        templateId: selectedTemplate?.id,
                        patientId: selectedPatient?.id
                      })}
                      isDisabled={!selectedTemplate || !selectedPatient}
                      isLoading={isSaving}
                    >
                      Enregistrer
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                      Annuler
                    </Button>
                  </HStack>
                </VStack>
              </Box>

              <Box>
                {selectedTemplate && selectedPatient && (
                  <DocumentPreview
                    document={{
                      id: 'new',
                      title: formData.title || `Nouveau ${selectedTemplate.name}`,
                      content: formData.content,
                      type: selectedTemplate.name,
                      patient: selectedPatient,
                      status: 'brouillon',
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      createdBy: 'Utilisateur',
                      tags: selectedTemplate.tags || [],
                      templateId: selectedTemplate.id
                    }}
                    onSave={handleSaveDocument}
                    onSendEmail={handleSendDocument}
                    isSaving={isSaving}
                    contacts={contacts}
                  />
                )}
              </Box>
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DocumentTemplateSelector;

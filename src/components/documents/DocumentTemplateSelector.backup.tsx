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
  Flex,
  Text,
  Badge,
  useToast,
} from '@chakra-ui/react';
import type { DocumentTemplate } from '../../types/documentTemplates';
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
const mockPatients = [
  { id: '1', name: 'Jean Dupont', birthDate: '15/03/1975' },
  { id: '2', name: 'Marie Durand', birthDate: '22/07/1982' },
  { id: '3', name: 'Pierre Martin', birthDate: '03/11/1965' },
] as const;

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
  // États du composant
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // États pour la gestion des données
  const [contacts, setContacts] = useState<Array<{id: string, name: string, email: string}>>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  // État pour le formulaire
  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    content: ''
  });
  
  // Charger les modèles de documents et les contacts
  useEffect(() => {
    const loadTemplatesAndContacts = async () => {
      try {
        const templatesList = await DocumentTemplateService.getAllTemplates();
        const contactsList = await documentService.getContacts();
        setTemplates(templatesList);
        setContacts(contactsList);
      } catch (error) {
        console.error('Erreur lors du chargement des modèles et des contacts:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les modèles de documents et les contacts.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    loadTemplatesAndContacts();
  }, [toast]);
  
  // Gestionnaires d'événements
  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const template = templates.find(t => t.id === value) || null;
    setSelectedTemplate(template);
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
  
  const handleVoiceInput = useCallback((text: string) => {
    setFormData(prev => ({
      ...prev,
      content: text
    }));
  }, []);
  
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
      setFormData({ patientId: '', title: '', content: '' });
      
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
  
  const handleSendEmail = useCallback(async (document: any, recipient: string) => {
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
  }, [toast]);
  
  const handleGenerateDocument = useCallback(async () => {
    if (!selectedTemplate || !selectedPatient) return;
    
    setIsGenerating(true);
    try {
      const savedDoc = await handleSaveDocument({
        ...formData,
        templateId: selectedTemplate.id,
        patientId: selectedPatient.id
      });
      
      if (savedDoc) {
        setIsPreviewOpen(true);
      }
    } catch (error) {
      console.error('Erreur lors de la génération du document:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedTemplate, selectedPatient, formData, handleSaveDocument]);
  
  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false);
  }, []);
  
  const handleCreateDocument = useCallback(async () => {
    if (!selectedTemplate || !selectedPatient) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un modèle et un patient',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await handleSaveDocument({
        ...formData,
        templateId: selectedTemplate.id,
        patientId: selectedPatient.id
      });
    } catch (error) {
      console.error('Erreur lors de la création du document:', error);
    }
  }, [selectedTemplate, selectedPatient, formData, handleSaveDocument, toast]);

  return (
    // ...
  );
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
      setFormData({ patientId: '', title: '', content: '' });
      
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
      throw error; // Propager l'erreur pour la gérer dans handleCreateDocument
    } finally {
      setIsSaving(false);
    }
  }, [selectedTemplate, selectedPatient, toast]);

  const handleSendEmail = async (document: any, recipient: string) => {
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
  };

  loadTemplates();
}, [toast]);

useEffect(() => {
  const loadContacts = async () => {
    try {
      const contactsList = await documentService.getContacts();
      setContacts(contactsList);
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la liste des contacts.',
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
};

const handlePatientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const value = e.target.value;
  const patient = mockPatientsList.find(p => p.id === value) || null;
  setSelectedPatient(patient);
};

const handleInputChange = useCallback((field: keyof typeof formData, value: string) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
}, []);

const handleVoiceInput = useCallback((text: string) => {
  setFormData(prev => ({
    ...prev,
    content: text
  }));
}, []);

const handleCreateDocument = async () => {
  if (!selectedTemplate || !selectedPatient) {
    toast({
      title: 'Erreur',
      description: 'Veuillez sélectionner un modèle et un patient',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    return;
  }

  try {
    await handleSaveDocument({
      ...formData,
      templateId: selectedTemplate.id,
      patientId: selectedPatient.id
    });
  } catch (error) {
    console.error('Erreur lors de la création du document:', error);
  }
};

const handleSaveDocument = useCallback(async (doc: any): Promise<any> => {
  if (!selectedTemplate || !selectedPatient) return;
  
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
    setFormData({ patientId: '', title: '', content: '' });
    
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
    throw error; // Propager l'erreur pour la gérer dans handleCreateDocument
  } finally {
    setIsSaving(false);
  }
}, [selectedTemplate, selectedPatient, toast]);

const handleSendEmail = async (document: any, recipient: string) => {
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

const handleGenerateDocument = useCallback(async () => {
  if (!selectedTemplate || !selectedPatient) return;
  return (
    <Box>
      <Button onClick={onOpen} {...buttonProps}>
        {buttonText}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Créer un nouveau document</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
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

              {selectedTemplate && selectedPatient && (
                <>
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
                    <FormLabel>Contenu</FormLabel>
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
                      onClick={handleCreateDocument}
                      isDisabled={!selectedTemplate || !selectedPatient}
                      isLoading={isSaving}
                    >
                      Enregistrer
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                      Annuler
                    </Button>
                  </HStack>
                </>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {selectedTemplate && selectedPatient && (
        <DocumentPreview
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          document={{
            id: 'new',
            title: formData.title || `Nouveau ${selectedTemplate.name}`,
            content: formData.content || selectedTemplate.content,
            type: selectedTemplate.name,
            patient: selectedPatient,
            status: 'brouillon',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'Utilisateur',
            tags: selectedTemplate.tags,
            templateId: selectedTemplate.id,
          }}
          onSave={handleSaveDocument}
          onSendEmail={handleSendEmail}
          isSaving={isSaving}
          contacts={contacts}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sélectionner un modèle de document</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Modèle de document</FormLabel>
                  <Select
                    placeholder="Sélectionner un modèle"
                    value={selectedTemplate?.id || ''}
                    onChange={(e) => handleTemplateSelect(e.target.value)}
                    mb={4}
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
                    placeholder="Sélectionner un patient"
                    value={selectedPatient?.id || ''}
                    onChange={(e) => handlePatientSelect(e.target.value)}
                    mb={4}
                  >
                    {mockPatients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} ({new Date(patient.birthDate).toLocaleDateString()})
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {selectedTemplate && (
                  <>
                    <FormControl isRequired>
                      <FormLabel>Titre du document</FormLabel>
                      <Input
                        value={formData.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Titre du document"
                        mb={4}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <Flex justify="space-between" align="center" mb={2}>
                        <FormLabel mb={0}>Contenu</FormLabel>
                        <Button
                          onClick={() => handleVoiceInput('')}
                          isDisabled={!selectedTemplate}
                          leftIcon={<span>🎤</span>}
                          size="sm"
                          variant="outline"
                        >
                          Dictée vocale
                        </Button>
                      </Flex>
                      <Textarea
                        value={formData.content || ''}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        placeholder="Contenu du document ou cliquez sur le bouton de dictée pour parler..."
                        minH="200px"
                        fontFamily="body"
                        resize="vertical"
                      />
                    </FormControl>

                    <HStack mt={2} spacing={2} align="center">
                      <Text fontSize="sm" color="gray.500">
                        Variables disponibles :
                      </Text>
                      {selectedTemplate.fields.map((field) => (
                        <Badge key={field} colorScheme="blue" fontSize="xs">
                          {`{{${field}}}`}
                        </Badge>
                      ))}
                    </HStack>
                  </>
                )}
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4} justify="flex-end" w="full">
              <Button 
                variant="outline" 
                onClick={onClose}
                isDisabled={isLoading}
              >
                Annuler
              </Button>
<Button 
                colorScheme="blue" 
                onClick={handleGenerateDocument}
                isDisabled={!selectedTemplate || !selectedPatient}
                isLoading={isLoading}
              >
                Prévisualiser
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DocumentTemplateSelector;

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

// Type Document est maintenant importé depuis les types communs

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
        const [templatesList, contactsList] = await Promise.all([
          DocumentTemplateService.getAllTemplates(),
          documentService.getContacts()
        ]);
        setTemplates(templatesList);
        setContacts(contactsList);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les données nécessaires.',
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
        templateId: selectedTemplate.id,
        patientId: selectedPatient.id,
        templateName: selectedTemplate.name
      };
      
      const savedDoc = await documentService.createDocument(documentToSave);
      
      toast({
        title: 'Document enregistré',
        description: 'Le document a été enregistré avec succès.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Ne pas fermer le formulaire immédiatement
      // pour permettre la prévisualisation
      
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
  
  const handleGenerateDocument = useCallback(async (e?: React.MouseEvent) => {
    // Empêcher le comportement par défaut du formulaire
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

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
    
    setIsGenerating(true);
    try {
      // Créer un document temporaire pour la prévisualisation sans sauvegarde
      const previewDoc = {
        id: 'preview-' + Date.now(),
        title: formData.title || `Nouveau ${selectedTemplate.name}`,
        content: formData.content || selectedTemplate.content,
        type: selectedTemplate.name,
        patient: selectedPatient,
        status: 'brouillon',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Utilisateur',
        tags: selectedTemplate.tags || [],
        templateId: selectedTemplate.id,
      };
      
      setCreatedDocument(previewDoc);
      setIsPreviewOpen(true);
      
      return previewDoc;
    } catch (error) {
      console.error('Erreur lors de la génération de la prévisualisation:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la génération de la prévisualisation',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [selectedTemplate, selectedPatient, formData, handleSaveDocument]);
  
  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false);
  }, []);
  
  const [createdDocument, setCreatedDocument] = useState<any>(null);

  const handleCreateDocument = useCallback(async (e?: React.MouseEvent) => {
    // Empêcher le comportement par défaut du formulaire
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

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
      // Créer un document temporaire pour la prévisualisation
      const previewDoc = {
        id: `preview-${Date.now()}`,
        title: formData.title || `Nouveau ${selectedTemplate.name}`,
        content: formData.content || selectedTemplate.content || '',
        type: selectedTemplate.name,
        patient: selectedPatient,
        status: 'brouillon',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Utilisateur',
        tags: selectedTemplate.tags || [],
        templateId: selectedTemplate.id,
        patientId: selectedPatient.id
      };
      
      setCreatedDocument(previewDoc);
      setIsPreviewOpen(true);
      
      return previewDoc;
    } catch (error) {
      console.error('Erreur lors de la création du document:', error);
      throw error;
    }
  }, [selectedTemplate, selectedPatient, formData, handleSaveDocument, toast]);

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
                    <HStack mb={2}>
                      <Button
                        onClick={() => handleVoiceInput('')}
                        isDisabled={!selectedTemplate}
                        size="sm"
                        variant="outline"
                      >
                        🎤 Dictée vocale
                      </Button>
                    </HStack>
                    <Textarea
                      name="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Contenu du document"
                      minH="200px"
                    />
                  </FormControl>

                  <HStack spacing={4} mt={4} justify="flex-end">
                    <Button
                      as="button"
                      type="button"
                      colorScheme="blue"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleGenerateDocument(e);
                      }}
                      isDisabled={!selectedTemplate || !selectedPatient}
                      isLoading={isGenerating}
                    >
                      Prévisualiser
                    </Button>
                    <Button
                      as="button"
                      type="button"
                      colorScheme="green"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCreateDocument(e);
                      }}
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

      {(selectedTemplate && selectedPatient) || createdDocument ? (
        <DocumentPreview
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          document={createdDocument || {
            id: 'new',
            title: formData.title || `Nouveau ${selectedTemplate?.name}`,
            content: formData.content || selectedTemplate?.content,
            type: selectedTemplate?.name,
            patient: selectedPatient,
            status: 'brouillon',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'Utilisateur',
            tags: selectedTemplate?.tags || [],
            templateId: selectedTemplate?.id,
          }}
          onSave={async () => {
            try {
              const doc = {
                ...formData,
                templateId: selectedTemplate?.id,
                patientId: selectedPatient?.id,
                patient: selectedPatient,
                type: selectedTemplate?.name,
                status: 'brouillon',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: 'Utilisateur',
                tags: selectedTemplate?.tags || [],
              };
              await handleSaveDocument(doc);
              return true;
            } catch (error) {
              console.error('Erreur lors de la sauvegarde:', error);
              return false;
            }
          }}
          onSendEmail={handleSendEmail}
          isSaving={isSaving}
          contacts={contacts}
        />
      ) : null}
    </Box>
  );
};

export default DocumentTemplateSelector;

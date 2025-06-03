import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Select,
  VStack,
  Textarea,
  useToast,
  Input,
  HStack
} from '@chakra-ui/react';
import { useState } from 'react';

interface GenerateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Array<{ id: string; name: string }>;
}

const documentTemplates = [
  { id: 'consultation', name: 'Compte-rendu de consultation' },
  { id: 'prescription', name: 'Ordonnance' },
  { id: 'certificate', name: 'Certificat médical' },
  { id: 'report', name: 'Bilan' },
];

export const GenerateDocumentModal = ({
  isOpen,
  onClose,
  patients,
}: GenerateDocumentModalProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    templateId: '',
    notes: ''
  });
  const toast = useToast();

  const handleSubmit = async () => {
    if (!formData.patientId || !formData.templateId) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Document généré',
        description: 'Le document a été généré avec succès',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la génération du document',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Générer un nouveau document</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Patient</FormLabel>
              <Select
                placeholder="Sélectionner un patient"
                value={formData.patientId}
                onChange={(e) => setFormData({...formData, patientId: e.target.value})}
              >
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Modèle de document</FormLabel>
              <Select
                placeholder="Sélectionner un modèle"
                value={formData.templateId}
                onChange={(e) => setFormData({...formData, templateId: e.target.value})}
              >
                {documentTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Notes supplémentaires</FormLabel>
              <Textarea
                placeholder="Ajoutez des notes ou des instructions spéciales..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={4}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button onClick={onClose} variant="outline">
              Annuler
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isGenerating}
              loadingText="Génération..."
            >
              Générer le document
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

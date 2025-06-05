import { useState, useEffect, useCallback } from 'react';
import { Box, Button, VStack, Text, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import MedicalDocumentCreator from '../components/documents/MedicalDocumentCreator';

// Types
type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
};

const CreateDocumentPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simuler le chargement des patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Remplacez ceci par un appel API réel
        const mockPatients: Patient[] = [
          {
            id: '1',
            firstName: 'Jean',
            lastName: 'Dupont',
            birthDate: '1980-05-15',
          },
          {
            id: '2',
            firstName: 'Marie',
            lastName: 'Martin',
            birthDate: '1975-11-22',
          },
        ];
        
        setPatients(mockPatients);
      } catch (error) {
        console.error('Erreur lors du chargement des patients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSaveDocument = useCallback(async (document: any) => {
    console.log('Document à enregistrer:', document);
    // Ici, vous feriez un appel API pour enregistrer le document
    // Par exemple :
    // await documentService.saveDocument(document);
    
    // Simulation d'un délai d'enregistrement
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('Document enregistré avec succès');
        resolve();
      }, 1000);
    });
  }, []);

  if (isLoading) {
    return (
      <Box p={4}>
        <Text>Chargement des données...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Créer un nouveau document
          </Text>
          <Text color="gray.600" mb={6}>
            Sélectionnez un modèle et un patient pour commencer la création de votre document médical.
            Utilisez la dictée vocale pour remplir rapidement les champs.
          </Text>
          
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onOpen}
            size="lg"
          >
            Nouveau document
          </Button>
        </Box>

        {/* Liste des documents existants pourrait aller ici */}
      </VStack>

      <MedicalDocumentCreator
        isOpen={isOpen}
        onClose={onClose}
        patients={patients}
        onSave={handleSaveDocument}
      />
    </Box>
  );
};

export default CreateDocumentPage;

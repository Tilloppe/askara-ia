import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Text,
  HStack,
  Textarea,
  Spinner,
  useToast,
  useColorModeValue,
  IconButton,
  Tooltip,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { ArrowBackIcon, CopyIcon, DeleteIcon, EditIcon, EmailIcon, RepeatIcon } from '@chakra-ui/icons';
import ReactMarkdown from 'react-markdown';

interface DocumentWithTemplate {
  id: string;
  title: string;
  content: string;
  templateId?: string;
}

export const DocumentDetail: React.FC = () => {
  const { id = '1' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  
  const [document, setDocument] = useState<DocumentWithTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState('');
  
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  
  // Chargement du document
  useEffect(() => {
    const loadDocument = async () => {
      try {
        setIsLoading(true);
        
        // Simulation de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Document de test
        const loadedDoc = {
          id,
          title: 'Mon Document Important',
          content: `# Titre du Document

## Introduction
Ceci est un exemple de contenu de document chargé dynamiquement.

## Section 1
Voici quelques détails importants concernant ce document.

## Section 2
Vous pouvez modifier ce contenu en cliquant sur le bouton "Modifier".

### Sous-section
- Point 1
- Point 2
- Point 3

## Conclusion
N'hésitez pas à explorer les différentes fonctionnalités disponibles.`,
        };
        
        setDocument(loadedDoc);
        setContent(loadedDoc.content);
      } catch (error) {
        console.error('Erreur lors du chargement du document:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger le document',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [id, toast]);

  // Gestionnaire d'enregistrement
  const handleSave = async () => {
    if (!document) return;
    
    setIsSaving(true);
    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedDoc = {
        ...document,
        content,
      };
      
      setDocument(updatedDoc);
      setIsEditing(false);
      
      toast({
        title: 'Document enregistré',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'enregistrer le document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Gestionnaire de suppression
  const handleDelete = async () => {
    try {
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 500));
      onDeleteClose();
      navigate('/documents');
      toast({
        title: 'Document supprimé',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Rendu du contenu du document
  const renderDocumentContent = () => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
          <Spinner size="xl" />
        </Box>
      );
    }

    if (!document) {
      return (
        <Box 
          p={4} 
          borderWidth="1px" 
          borderRadius="md" 
          borderColor={borderColor} 
          minH="400px"
          display="flex" 
          justifyContent="center" 
          alignItems="center"
          bg={useColorModeValue('white', 'gray.800')}
        >
          <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.300')}>
            Aucun document à afficher
          </Text>
        </Box>
      );
    }
    
    // Rendu du contenu en mode édition
    if (isEditing) {
      return (
        <Textarea
          ref={contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          h="100%"
          minH="450px"
          fontFamily="mono"
          fontSize="md"
          lineHeight="tall"
          p={4}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="md"
          _focus={{
            borderColor: 'blue.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
          }}
          placeholder="Saisissez le contenu de votre document..."
        />
      );
    }
    
    // Rendu du contenu en mode visualisation
    return (
      <Box 
        ref={printRef}
        p={8}
        borderWidth="1px"
        borderRadius="md"
        borderColor={borderColor}
        minH="500px"
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow="sm"
        overflowY="auto"
      >
        <ReactMarkdown>
          {content || 'Aucun contenu à afficher'}
        </ReactMarkdown>
      </Box>
    );
  };

  return (
    <Box maxW="6xl" mx="auto" p={4}>
      {/* En-tête */}
      <HStack mb={6} justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Button leftIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="ghost">
          Retour
        </Button>
        <HStack spacing={2} flexWrap="wrap" justify={{ base: 'flex-end', md: 'flex-start' }}>
          {isEditing ? (
            <>
              <Button 
                onClick={() => setIsEditing(false)}
                variant="outline"
                isDisabled={isSaving}
              >
                Annuler
              </Button>
              <Button 
                colorScheme="blue" 
                leftIcon={<RepeatIcon />} 
                onClick={handleSave}
                isLoading={isSaving}
                loadingText="Enregistrement..."
              >
                Enregistrer
              </Button>
            </>
          ) : (
            <>
              <Tooltip label="Modifier le document">
                <IconButton 
                  aria-label="Modifier"
                  icon={<EditIcon />} 
                  onClick={() => {
                    setContent(document?.content || '');
                    setIsEditing(true);
                    setTimeout(() => contentRef.current?.focus(), 0);
                  }}
                />
              </Tooltip>
              
              <Tooltip label="Envoyer par email">
                <IconButton 
                  aria-label="Envoyer par email"
                  icon={<EmailIcon />} 
                  variant="outline" 
                  onClick={() => {}}
                />
              </Tooltip>
              
              <Tooltip label="Supprimer le document">
                <IconButton 
                  aria-label="Supprimer"
                  icon={<DeleteIcon />} 
                  colorScheme="red" 
                  variant="outline" 
                  onClick={onDeleteOpen}
                />
              </Tooltip>
            </>
          )}
        </HStack>
      </HStack>

      {/* Contenu du document */}
      {renderDocumentContent()}

      {/* Boîte de dialogue de confirmation de suppression */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Supprimer le document
            </AlertDialogHeader>

            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Annuler
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default DocumentDetail;

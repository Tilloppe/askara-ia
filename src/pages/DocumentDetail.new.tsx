import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import {
  Box,
  Button,
  Text,
  Heading,
  HStack,
  Textarea,
  Spinner,
  useDisclosure,
  useToast,
  useClipboard,
  useColorModeValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { ArrowBackIcon, CopyIcon, DeleteIcon, EditIcon, EmailIcon, PrintIcon } from '@chakra-ui/icons';
import ReactMarkdown from 'react-markdown';

interface DocumentWithTemplate {
  id: string;
  title: string;
  content: string;
  templateId?: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
}

const DocumentDetail = () => {
  // États
  const [document, setDocument] = useState<DocumentWithTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Références
  const contentRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  
  // Hooks
  const { id = '1' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { onCopy, hasCopied } = useClipboard(content);
  
  // Gestion des modales
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEmailOpen, onOpen: onEmailOpen, onClose: onEmailClose } = useDisclosure();
  
  // Styles
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Gestionnaire d'impression
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
  });
  
  // Gestionnaire de sauvegarde
  const handleSave = useCallback(async () => {
    if (!document) return;
    
    setIsSaving(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Document enregistré',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setIsEditing(false);
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
  }, [document, toast]);
  
  // Gestionnaire de suppression
  const handleDelete = useCallback(async () => {
    try {
      setIsLoading(true);
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Document supprimé',
        description: 'Le document a été supprimé avec succès.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/documents');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression du document.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      onDeleteClose();
    }
  }, [navigate, onDeleteClose, toast]);
  
  // Gestionnaire d'envoi d'email
  const handleSendEmail = useCallback(async (email: string) => {
    if (!email) return;
    
    try {
      // Simuler un envoi d'email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Email envoyé',
        description: `Le document a été envoyé à ${email}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onEmailClose();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'envoi de l\'email.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [onEmailClose, toast]);
  
  // Composants personnalisés pour le rendu Markdown
  const markdownComponents = {
    h1: (props: any) => <Heading as="h1" size="2xl" my={4} {...props} />,
    h2: (props: any) => <Heading as="h2" size="xl" my={3} {...props} />,
    h3: (props: any) => <Heading as="h3" size="lg" my={2} {...props} />,
    p: (props: any) => <Text as="p" mb={4} lineHeight="tall" {...props} />,
    a: (props: any) => <Text as="a" color="blue.500" _hover={{ textDecoration: 'underline' }} {...props} />,
    ul: (props: any) => <Box as="ul" pl={6} mb={4} styleType="disc" {...props} />,
    ol: (props: any) => <Box as="ol" pl={6} mb={4} styleType="decimal" {...props} />,
    li: (props: any) => <Box as="li" mb={2} {...props} />,
    blockquote: (props: any) => (
      <Box
        as="blockquote"
        borderLeftWidth="4px"
        borderLeftColor="gray.200"
        pl={4}
        py={1}
        my={4}
        color="gray.600"
        _dark={{ color: 'gray.300', borderLeftColor: 'gray.600' }}
        {...props}
      />
    ),
  };
  
  // Rendu du contenu du document
  const renderDocumentContent = useCallback(() => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
          <Spinner size="xl" />
        </Box>
      );
    }
    
    if (!document) {
      return (
        <Box textAlign="center" py={10}>
          <Text>Aucun document trouvé</Text>
        </Box>
      );
    }
    
    if (isEditing) {
      return (
        <Box mb={6}>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minH="400px"
            fontFamily="mono"
            mb={4}
          />
          <HStack spacing={4} justify="flex-end">
            <Button
              onClick={() => {
                setContent(document.content);
                setIsEditing(false);
              }}
              variant="outline"
              isDisabled={isSaving}
            >
              Annuler
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSave}
              isLoading={isSaving}
              loadingText="Enregistrement..."
            >
              Enregistrer
            </Button>
          </HStack>
        </Box>
      );
    }
    
    return (
      <Box
        ref={contentRef}
        p={6}
        borderWidth="1px"
        borderRadius="lg"
        borderColor={borderColor}
        bg={useColorModeValue('white', 'gray.800')}
      >
        <ReactMarkdown components={markdownComponents}>
          {content}
        </ReactMarkdown>
      </Box>
    );
  }, [content, document, handleSave, isEditing, isLoading, isSaving, borderColor]);

  // Effet pour charger le document
  useEffect(() => {
    const loadDocument = async () => {
      setIsLoading(true);
      try {
        // Simuler un chargement de document
        await new Promise(resolve => setTimeout(resolve, 800));
        // Simuler des données de document
        const mockDocument: DocumentWithTemplate = {
          id: id || '1',
          title: 'Mon Document',
          content: '# Mon Document\n\nCeci est un exemple de contenu en Markdown.\n\n## Section 1\n\n- Premier point\n- Deuxième point\n- Troisième point\n\n## Section 2\n\nVoici un [lien exemple](https://example.com).',
        };
        setDocument(mockDocument);
        setContent(mockDocument.content);
      } catch (error) {
        console.error('Erreur lors du chargement du document :', error);
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
  
  // Rendu principal
  return (
    <Box maxW="6xl" mx="auto" p={4}>
      {/* En-tête avec boutons d'action */}
      <HStack mb={6} justifyContent="space-between">
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          onClick={() => navigate(-1)}
        >
          Retour
        </Button>

        <HStack spacing={4}>
          {!isEditing && (
            <>
              <Button
                leftIcon={<EditIcon />}
                colorScheme="blue"
                onClick={() => setIsEditing(true)}
                isDisabled={isLoading}
              >
                Modifier
              </Button>
              <Button
                leftIcon={<CopyIcon />}
                variant="outline"
                onClick={() => {
                  onCopy();
                  toast({
                    title: 'Contenu copié',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                  });
                }}
                isDisabled={isLoading}
              >
                {hasCopied ? 'Copié !' : 'Copier'}
              </Button>
              <Button
                leftIcon={<PrintIcon />}
                variant="outline"
                onClick={handlePrint}
                isDisabled={isLoading}
              >
                Imprimer
              </Button>
              <Button
                leftIcon={<EmailIcon />}
                colorScheme="teal"
                onClick={onEmailOpen}
                isDisabled={isLoading}
              >
                Envoyer par email
              </Button>
              <Button
                leftIcon={<DeleteIcon />}
                colorScheme="red"
                variant="outline"
                onClick={onDeleteOpen}
                isDisabled={isLoading}
              >
                Supprimer
              </Button>
            </>
          )}
        </HStack>
      </HStack>

      {/* Contenu principal */}
      <Box>
        {renderDocumentContent()}
      </Box>

      {/* Modale de confirmation de suppression */}
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
              <Button ref={cancelRef} onClick={onDeleteClose} isDisabled={isLoading}>
                Annuler
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3} isLoading={isLoading}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      
      {/* Modale d'envoi d'email */}
      <Modal isOpen={isEmailOpen} onClose={onEmailClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Envoyer par email</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Email du destinataire</FormLabel>
              <Input
                placeholder="email@exemple.com"
                value={selectedContact?.email || ''}
                onChange={(e) =>
                  setSelectedContact({
                    id: 'custom',
                    name: 'Personnalisé',
                    email: e.target.value,
                  })
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={() => selectedContact && handleSendEmail(selectedContact.email)}
              isDisabled={!selectedContact?.email || isLoading}
              isLoading={isLoading}
            >
              Envoyer
            </Button>
            <Button onClick={onEmailClose} isDisabled={isLoading}>
              Annuler
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DocumentDetail;

import { useState, useRef, useEffect, useCallback } from 'react';
import type { FC } from 'react';
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
import { ArrowBackIcon, CopyIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
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

const DocumentDetail: FC = () => {
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
    h1: ({ node, ...props }: any) => <Text as="h1" fontSize="2xl" fontWeight="bold" my={4} {...props} />,
    h2: ({ node, ...props }: any) => <Text as="h2" fontSize="xl" fontWeight="bold" my={3} {...props} />,
    h3: ({ node, ...props }: any) => <Text as="h3" fontSize="lg" fontWeight="semibold" my={2} {...props} />,
    p: ({ node, ...props }: any) => <Text as="p" mb={4} lineHeight="tall" {...props} />,
    a: ({ node, ...props }: any) => <Text as="a" color="blue.500" _hover={{ textDecoration: 'underline' }} {...props} />,
    ul: ({ node, ...props }: any) => <Box as="ul" pl={6} mb={4} styleType="disc" {...props} />,
    ol: ({ node, ...props }: any) => <Box as="ol" pl={6} mb={4} styleType="decimal" {...props} />,
    li: ({ node, ...props }: any) => <Box as="li" mb={2} {...props} />,
    blockquote: ({ node, ...props }: any) => (
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
      <Box ref={contentRef}>
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
};
    ),
    h2: ({ node, ...props }: any) => (
      <Heading as="h2" size="xl" borderBottom="1px" borderColor="gray.100" pb={1} mt={8} mb={4} {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <Heading as="h3" size="lg" mt={6} mb={3} {...props} />
    ),
    p: ({ node, ...props }: any) => (
      <Text as="p" mb={4} lineHeight="tall" {...props} />
    ),
    a: ({ node, ...props }: any) => (
      <Box
        as="a"
        color={useColorModeValue('blue.500', 'blue.300')}
        textDecoration="underline"
        _hover={{ textDecoration: 'none' }}
        {...props}
      />
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      if (inline) {
        return (
          <Box
            as="code"
            fontFamily="mono"
            bg={useColorModeValue('gray.100', 'gray.700')}
            px={1}
            py={0.5}
            borderRadius="sm"
            fontSize="0.9em"
            {...props}
          >
            {children}
          </Box>
        );
      }
      return (
        <Box
          as="pre"
          bg={useColorModeValue('gray.100', 'gray.700')}
          p={4}
          borderRadius="md"
          my={4}
          overflowX="auto"
        >
          <code className={className} {...props}>
            {children}
          </code>
        </Box>
      );
    },
  };
  // Hooks
  const { id = '1' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  
  // États
  const [document, setDocument] = useState<DocumentWithTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Styles
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Références
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  
  // Gestion des modales
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEmailOpen, onOpen: onEmailOpen, onClose: onEmailClose } = useDisclosure();
  
  // Gestion du presse-papiers
  const { onCopy, hasCopied } = useClipboard(content || '');
  
  // Chargement du document
  useEffect(() => {
    const loadDocument = async () => {
      try {
        // Simulation de chargement d'un document
        setIsLoading(true);
        console.log('Chargement du document...');
        
        // Simulation d'un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Création d'un document de test plus détaillé
        const loadedDoc = {
          id,
          title: 'Mon Document Important',
          content: `Titre du Document
====================

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
        
        console.log('Document chargé:', loadedDoc);
        setDocument(loadedDoc);
        setContent(loadedDoc.content);
        console.log('États mis à jour - document et content');
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
        console.log('Chargement terminé, isLoading:', false);
      }
    };

    loadDocument();
  }, [id, toast]);

  // Configuration de l'impression
  const handlePrint = useReactToPrint({
    pageStyle: `
      @page { 
        size: auto; 
        margin: 20mm; 
      }
      @media print {
        body { 
          -webkit-print-color-adjust: exact;
          padding: 20px;
        }
      }
    `,
    // @ts-ignore - La propriété content est valide mais les types ne sont pas à jour
    content: () => printRef.current,
  });

  // Gestionnaire d'enregistrement
  return (
    <Box p={4}>
      <HStack mb={4} spacing={4}>
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Retour
        </Button>

        {!isEditing && (
          <>
            <Button
              leftIcon={<EditIcon />}
              colorScheme="blue"
              onClick={() => setIsEditing(true)}
            >
              Modifier
            </Button>
            <Button
              leftIcon={<CopyIcon />}
              onClick={onCopy}
              variant="outline"
            >
              {hasCopied ? 'Copié !' : 'Copier'}
            </Button>
            <Button
              leftIcon={<DeleteIcon />}
              colorScheme="red"
              variant="outline"
              onClick={onDeleteOpen}
            >
              Supprimer
            </Button>
          </>
        )}
      </HStack>

      {renderDocumentContent()}

      {/* Modale de confirmation de suppression */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Supprimer le document</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.
          </ModalBody>
          <ModalFooter>
            <Button ref={cancelRef} onClick={onDeleteClose}>
              Annuler
            </Button>
            <Button colorScheme="red" onClick={handleDelete} ml={3}>
              Supprimer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modale d'envoi d'email */}
      <Modal isOpen={isEmailOpen} onClose={onEmailClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Envoyer le document par email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Adresse email du destinataire</FormLabel>
              <Input
                type="email"
                placeholder="email@exemple.com"
                value={selectedContact?.email || ''}
                onChange={(e) => setSelectedContact({ id: '', name: '', email: e.target.value })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEmailClose}>
              Annuler
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => selectedContact && handleSendEmail(selectedContact.email)}
              isDisabled={!selectedContact?.email}
            >
              Envoyer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DocumentDetail;

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

    if (isEditing) {
      return (
        <Box>
          <Textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minH="500px"
            fontFamily="mono"
            p={4}
            borderColor={borderColor}
            _focus={{ borderColor: 'blue.500', boxShadow: 'outline' }}
          />
          <HStack mt={4} spacing={4}>
            <Button
              colorScheme="blue"
              onClick={handleSave}
              isLoading={isSaving}
              leftIcon={<RepeatIcon />}
            >
              Enregistrer
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setContent(document.content);
                setIsEditing(false);
              }}
            >
              Annuler
            </Button>
          </HStack>
        </Box>
      );
    }

    // Rendu du contenu Markdown
    return (
      <Box
        ref={printRef}
        p={6}
        borderWidth="1px"
        borderRadius="md"
        borderColor={borderColor}
        minH="500px"
        bg={useColorModeValue('white', 'gray.800')}
        className="document-content"
      >
        <ReactMarkdown components={markdownComponents}>
          {content}
        </ReactMarkdown>
      </Box>
    );
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

  // Gestionnaire d'envoi d'email
  const handleSendEmail = () => {
    onEmailClose();
    toast({
      title: 'Email envoyé',
      description: `Le document a été envoyé à ${selectedContact?.email || 'le destinataire'}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Fonction pour rendre le contenu Markdown
  const renderMarkdownContent = (markdown: string) => {
    if (!markdown?.trim()) {
      return (
        <Text color={useColorModeValue('gray.500', 'gray.400')} fontStyle="italic">
          Aucun contenu à afficher
        </Text>
      );
    }

    return (
      <ReactMarkdown components={markdownComponents}>
        {markdown}
      </ReactMarkdown>
    );
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
        p={8}
        borderWidth="1px"
        borderRadius="md"
        borderColor={borderColor}
        minH="500px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow="sm"
        overflowY="auto"
      >
        {isEditing ? (
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
        ) : (
          renderMarkdownContent(content)
        )}
      </Box>
    );
  }

  // Rendu de la barre d'outils
  const renderToolbar = () => (
    <HStack spacing={2} mb={4}>
      {isEditing ? (
        <>
          <Button 
            onClick={() => {
              setContent(document?.content || '');
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
            isDisabled={!document}
          >
            Enregistrer
          </Button>
        </>
      ) : (
        <>
          <Button 
            leftIcon={<EditIcon />} 
            onClick={() => setIsEditing(true)}
            isDisabled={!document}
          >
            Modifier
          </Button>
          <Button 
            leftIcon={<CopyIcon />} 
            onClick={onCopy} 
            variant="outline"
            isDisabled={!document || !content}
          >
            {hasCopied ? 'Copié !' : 'Copier'}
          </Button>
          <Button 
            leftIcon={<RepeatIcon />} 
            onClick={onEmailOpen} 
            variant="outline"
            isDisabled={!document}
          >
            Envoyer par email
          </Button>
          <Button 
            leftIcon={<DeleteIcon />} 
            onClick={onDeleteOpen} 
            colorScheme="red" 
            variant="outline"
            isDisabled={!document}
          >
            Supprimer
          </Button>
          <Button 
            onClick={handlePrint} 
            variant="outline"
            isDisabled={!document}
            ml="auto"
          >
            Imprimer
          </Button>
        </>
      )}
    </HStack>
  );

  return (
    <Box maxW="6xl" mx="auto" p={4}>
      {/* En-tête */}
      <HStack mb={6} justifyContent="space-between">
        <Button leftIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} variant="ghost">
          Retour
        </Button>
        <Heading size="lg">{document?.title || 'Document'}</Heading>
        <Box w="120px" /> {/* Pour l'alignement */}
      </HStack>

      {/* Barre d'outils */}
      {renderToolbar()}

      {/* Contenu du document */}
      {renderDocumentContent()}

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

      {/* Modale d'envoi d'email */}
      <Modal isOpen={isEmailOpen} onClose={onEmailClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Envoyer par email</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={4} isRequired>
              <FormLabel>Destinataire</FormLabel>
              <Input
                type="email"
                placeholder="email@exemple.com"
                value={selectedContact?.email || ''}
                onChange={(e) =>
                  setSelectedContact({
                    id: '1',
                    name: 'Destinataire',
                    email: e.target.value,
                  })
                }
                isRequired
              />
            </FormControl>
            <FormControl>
              <FormLabel>Message</FormLabel>
              <Textarea
                placeholder="Votre message..."
                rows={6}
                defaultValue={`Bonjour,\n\nVeuillez trouver ci-joint le document "${document?.title || 'sans titre'}".\n\nCordialement,\n[Votre nom]`}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onEmailClose} variant="outline" mr={3}>
              Annuler
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSendEmail}
              isDisabled={!selectedContact?.email}
            >
              Envoyer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DocumentDetail;

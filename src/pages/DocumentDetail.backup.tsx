import { useState, useEffect, useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import { 
  useToast,
  useDisclosure,
  useClipboard,
  Button,
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Card,
  CardBody,
  Textarea,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Spinner,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  useColorModeValue,
  IconButton
} from '@chakra-ui/react';
import { 
  DeleteIcon, 
  EmailIcon, 
  CopyIcon, 
  CheckIcon,
  ArrowBackIcon,
  DownloadIcon,
  ViewIcon,
  EditIcon,
  ChevronDownIcon
} from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { documentService } from '../services/documentService';
import type { DocumentWithTemplate, Contact } from '../types/documentDetail';
import ContactSelector from '../components/contacts/ContactSelector';
import VoiceToTextButton from '../components/common/VoiceToTextButton';

const DocumentDetail: React.FC = () => {
  // Hooks
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // États
  const [document, setDocument] = useState<DocumentWithTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // États pour les modaux
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isEmailOpen, onOpen: onEmailOpen, onClose: onEmailClose } = useDisclosure();
  
  // Référence pour l'impression
  const printRef = useRef<HTMLDivElement>(null);
  
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    body: ''
  });
  
  // Références
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { hasCopied, onCopy } = useClipboard(content);
  
  // Fonction pour gérer l'impression
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page { 
        size: A4;
        margin: 1cm;
      }
      @media print {
        body { 
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });
  
  // Fonction pour gérer la copie du contenu
  const handleCopy = useCallback(() => {
    onCopy();
    toast({
      title: 'Contenu copié',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  }, [onCopy, toast]);
  
  // Fonction pour gérer la copie du contenu
  const handleCopy = useCallback(() => {
    onCopy();
    toast({
      title: 'Contenu copié',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  }, [onCopy, toast]);

  // Charger le document
  useEffect(() => {
    const loadDocument = async () => {
      if (!id) {
        navigate('/documents');
        return;
      }

      try {
        setIsLoading(true);
        const doc = await documentService.getDocumentById(id);
        if (doc) {
          setDocument(doc);
          setContent(doc.content);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du document', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger le document',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        navigate('/documents');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [id, navigate, toast]);

  // Gestionnaire de sauvegarde
  const handleSave = useCallback(async () => {
    if (!document) return;
    
    setIsSaving(true);
    try {
      const updatedDoc = {
        ...document,
        content,
        updatedAt: new Date().toISOString(),
      };
      
      await documentService.updateDocument(document.id, updatedDoc);
      setDocument(updatedDoc);
      setIsEditing(false);
      
      toast({
        title: 'Document enregistré',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du document', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le document',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  }, [content, document, toast]);

  // Gestionnaire de suppression
  const handleDelete = useCallback(async () => {
    if (!document) return;
    
    try {
      await documentService.deleteDocument(document.id);
      toast({
        title: 'Document supprimé',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/documents');
    } catch (error) {
      console.error('Erreur lors de la suppression du document', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le document',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onDeleteClose();
    }
  }, [document, navigate, toast]);

  // Gestionnaire d'envoi d'email
  const handleSendEmail = () => {
    if (!document) return;
    
    // Si c'est un courrier pour un médecin, on préremplit avec les informations du contact
    if (document.templateId === 'courrier-medecin' && selectedContact) {
      setEmailData({
        to: selectedContact.email || '',
        subject: `Document: ${document.title}`,
        body: `Bonjour Dr ${selectedContact.name},\n\nVeuillez trouver ci-joint le document concernant votre patient.\n\nCordialement,\n[Votre signature]`,
      });
    } else {
      setEmailData({
        to: '',
        subject: `Document: ${document.title}`,
        body: content,
      });
    }
    
    onEmailOpen();
  };

  // Confirmation d'envoi d'email
  const confirmSendEmail = async () => {
    try {
      // Implémentez ici l'envoi d'email
      console.log('Envoi email à:', emailData.to, 'avec le contenu:', emailData);
      
      toast({
        title: 'Email envoyé',
        description: `Le document a été envoyé à ${emailData.to}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      onEmailClose();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer l\'email',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Gestionnaire de téléchargement
  const handleDownload = useCallback(() => {
    if (!document) return;
    
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${document.title}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [content, document]);
  
  // Gestionnaire de changement d'email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Affichage du chargement
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="xl" />
      </Box>
    );
  }

  // Document non trouvé
  if (!document) {
    return (
      <Box p={4}>
        <Text>Document non trouvé</Text>
        <Button mt={4} leftIcon={<ArrowBackIcon />} onClick={() => navigate('/documents')}>
          Retour à la liste
        </Button>
      </Box>
    );
  }

  // Rendu du contenu du document avec mise en forme conditionnelle selon le modèle
  const renderDocumentContent = useCallback(() => {
    if (!document) return null;
    
    if (isEditing) {
      return (
        <Box mb={6}>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minH="400px"
            fontFamily="mono"
            whiteSpace="pre-wrap"
          />
          
          {/* Bouton de dictée vocale */}
          <Box mt={4}>
            <VoiceToTextButton
              onTranscription={(text) => setContent(text)}
              lang="fr-FR"
            />
          </Box>
        </Box>
      );
    }
    
    // Rendu du contenu formaté selon le modèle
    return (
      <Box 
        ref={printRef}
        p={6}
        borderWidth="1px"
        borderRadius="md"
        borderColor={borderColor}
        bg={bgColor}
        whiteSpace="pre-wrap"
        fontFamily="body"
        lineHeight="tall"
        sx={{
          'h1, h2, h3, h4, h5, h6': {
            fontWeight: 'bold',
            mt: 4,
            mb: 2,
            color: 'gray.800',
          },
          'h1': { fontSize: 'xl', borderBottom: '1px solid', borderColor: 'gray.200', pb: 2 },
          'h2': { fontSize: 'lg' },
          'ul, ol': { pl: 6, my: 2 },
          'li': { mb: 1 },
          'p': { mb: 3 },
          'strong': { fontWeight: 'bold' },
          'em': { fontStyle: 'italic' },
        }}
        dangerouslySetInnerHTML={{ 
          __html: content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            .replace(/^\s*\n(\s*<li>.*<\/li>\s*)+/gm, '<ul>\n$&\n</ul>')
            .replace(/<\/ul>\s*<ul>/g, '')
            .replace(/\n/g, '<br />')
        }}
      />
    );
  }, [document, isEditing, content, borderColor, bgColor]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!document) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Heading as="h2" size="xl" mt={6} mb={2}>
          Document non trouvé
        </Heading>
        <Text color="gray.500" mb={6}>
          Le document que vous recherchez n'existe pas ou a été supprimé.
        </Text>
        <Button colorScheme="blue" onClick={() => navigate('/documents')}>
          Retour aux documents
        </Button>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <HStack mb={6} spacing={4} justify="space-between">
        <HStack spacing={4}>
          <IconButton
            icon={<ArrowBackIcon />}
            aria-label="Retour"
            variant="ghost"
            onClick={() => navigate(-1)}
          />
          <VStack align="start" spacing={0}>
            <Heading size="lg">{document.title}</Heading>
            <Text color="gray.500" fontSize="sm">
              Créé le {new Date(document.createdAt).toLocaleDateString()}
              {document.updatedAt && ` • Dernière modification le ${new Date(document.updatedAt).toLocaleDateString()}`}
            </Text>
          </VStack>
        </HStack>
        
        <HStack spacing={2}>
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
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
            </>
          ) : (
            <>
              <Button 
                leftIcon={<EditIcon />} 
                onClick={() => setIsEditing(true)}
                variant="outline"
              >
                Modifier
              </Button>
              
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  Actions
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<EmailIcon />} onClick={handleSendEmail}>
                    Envoyer par email
                  </MenuItem>
                  <MenuItem icon={<DownloadIcon />} onClick={handlePrint}>
                    Télécharger PDF
                  </MenuItem>
                  <MenuItem icon={<ViewIcon />} onClick={handlePrint}>
                    Aperçu avant impression
                  </MenuItem>
                  <Divider />
                  <MenuItem 
                    icon={hasCopied ? <CheckIcon /> : <CopyIcon />} 
                    onClick={handleCopy}
                  >
                    {hasCopied ? 'Copié !' : 'Copier le contenu'}
                  </MenuItem>
                  <Divider />
                  <MenuItem 
                    icon={<DeleteIcon />} 
                    color="red.500"
                    onClick={onDeleteOpen}
                  >
                    Supprimer
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          )}
        </HStack>
      </HStack>
      
      {/* Sélecteur de contact pour les courriers médicaux */}
      {document.templateId === 'courrier-medecin' && (
        <Box mb={6}>
          <ContactSelector 
            onSelect={setSelectedContact}
            selectedContact={selectedContact}
          />
        </Box>
      )}
      
      {/* Contenu du document */}
      <Card mb={6}>
        <CardBody>
          {renderDocumentContent()}
        </CardBody>
      </Card>

      {/* Modal de confirmation de suppression */}
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

      {/* Modal d'envoi d'email */}
      <Modal isOpen={isEmailOpen} onClose={onEmailClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Envoyer par email</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>Destinataire</FormLabel>
              <Input
                name="to"
                placeholder="email@exemple.com"
                value={emailData.to}
                onChange={handleEmailChange}
                type="email"
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel>Objet</FormLabel>
              <Input
                name="subject"
                value={emailData.subject}
                onChange={handleEmailChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Message</FormLabel>
              <Textarea
                name="body"
                value={emailData.body}
                onChange={handleEmailChange}
                minH="200px"
                fontFamily="body"
                whiteSpace="pre-wrap"
              />
            </FormControl>
            
            <Box mt={4} p={4} bg="gray.50" borderRadius="md">
              <Text fontSize="sm" color="gray.600" mb={2}>
                Pièce jointe : {document.title}.pdf
              </Text>
              <Text fontSize="sm" color="gray.500">
                Le document sera automatiquement joint à l'email au format PDF.
              </Text>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEmailClose}>
              Annuler
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={confirmSendEmail}
              leftIcon={<EmailIcon />}
              isLoading={isSaving}
            >
              Envoyer l'email
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DocumentDetail;

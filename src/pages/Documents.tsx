import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Heading, 
  Button, 
  Input, 
  HStack, 
  VStack, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  IconButton, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  useDisclosure, 
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Card,
  CardBody,
  Select,
  Badge,
  Tag,
  Divider,
  Text,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { 
  SearchIcon, 
  HamburgerIcon, 
  ViewIcon, 
  EditIcon, 
  DeleteIcon, 
  DownloadIcon, 
  EmailIcon,
  AddIcon
} from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import type { DocumentTemplate } from '../types/documentTemplates';
import DocumentTemplateSelector from '../components/documents/DocumentTemplateSelector';
import type { Document } from '../types/common';
import { documentService } from '../services/documentService';

const Documents = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  

  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  
  // Charger les documents au montage du composant
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const docs = await documentService.getAllDocuments();
        setDocuments(docs);
        setFilteredDocuments(docs);
      } catch (error) {
        console.error('Erreur lors du chargement des documents', error);
      }
    };

    loadDocuments();
  }, [toast]);

  // Mettre à jour les documents filtrés lorsque les filtres changent
  useEffect(() => {
    const filtered = documents.filter(doc => {
      const matchesSearch = searchTerm === '' || 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.patient.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
      const matchesType = filterType === 'all' || doc.type.toLowerCase() === filterType.toLowerCase();
      
      return matchesSearch && matchesStatus && matchesType;
    });
    setFilteredDocuments(filtered);
  }, [searchTerm, filterStatus, filterType, documents]);

  // Gestionnaires d'événements pour les champs de recherche et de filtre
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'brouillon':
        return 'gray';
      case 'finalisé':
        return 'blue';
      case 'envoyé':
        return 'green';
      case 'signé':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const handleDelete = (doc: Document) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      setDocumentToDelete(doc);
      onDeleteOpen();
    };
  };

  const confirmDelete = async () => {
    if (!documentToDelete) return;
    
    try {
      const success = await documentService.deleteDocument(documentToDelete.id || '');
      
      if (success) {
        // Mettre à jour la liste des documents
        const updatedDocs = await documentService.getAllDocuments();
        setDocuments(updatedDocs);
        setFilteredDocuments(updatedDocs);
        
        toast({
          title: 'Document supprimé',
          description: 'Le document a été supprimé avec succès.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du document', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression du document.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onDeleteClose();
      setDocumentToDelete(null);
    }
  };

  const handleNewDocument = async (document: any) => {
    if (!document) return;
    
    try {
      // Si le document a un ID, c'est qu'il a déjà été sauvegardé
      if (document.id) {
        // Rafraîchir la liste des documents
        const updatedDocs = await documentService.getAllDocuments();
        setDocuments(updatedDocs);
        setFilteredDocuments(updatedDocs);
        
        toast({
          title: 'Document enregistré',
          description: 'Le document a été enregistré avec succès.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Créer un nouveau document
        const newDoc = await documentService.createDocument({
          title: document.title || 'Nouveau document',
          type: document.type || 'Document personnalisé',
          patient: document.patient || {
            id: 'new-patient',
            name: 'Nouveau patient'
          },
          status: 'brouillon',
          content: document.content || 'Contenu du document...',
          createdBy: 'Utilisateur actuel',
          tags: document.tags || [],
          templateId: document.templateId,
          patientId: document.patientId
        });
        
        // Mettre à jour la liste des documents
        const updatedDocs = await documentService.getAllDocuments();
        setDocuments(updatedDocs);
        setFilteredDocuments(updatedDocs);
        
        toast({
          title: 'Document créé',
          description: 'Le document a été créé avec succès.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la création/édition du document', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la création/édition du document.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Box mb={6}>
        <HStack justify="space-between" mb={4}>
          <Heading size="lg">Documents</Heading>
<DocumentTemplateSelector 
            onSelect={handleNewDocument}
            buttonText="Nouveau document"
            buttonProps={{
              leftIcon: <AddIcon />,
              colorScheme: 'blue'
            }}
          />
        </HStack>
      </Box>

      <Card mb={6}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <InputGroup maxW="md">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input 
                  placeholder="Rechercher un document..." 
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </InputGroup>
              
              <Select 
                placeholder="Statut" 
                maxW="200px"
                value={filterStatus}
                onChange={handleStatusFilterChange}
              >
                <option value="all">Tous les statuts</option>
                <option value="brouillon">Brouillon</option>
                <option value="finalisé">Finalisé</option>
                <option value="envoyé">Envoyé</option>
                <option value="signé">Signé</option>
              </Select>
              
              <Select 
                placeholder="Type" 
                maxW="200px"
                value={filterType}
                onChange={handleTypeFilterChange}
              >
                <option value="all">Tous les types</option>
                <option value="consultation">Consultation</option>
                <option value="ordonnance">Ordonnance</option>
                <option value="certificat">Certificat</option>
                <option value="bilan">Bilan</option>
              </Select>
              
              {(filterStatus !== 'all' || filterType !== 'all' || searchTerm) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setFilterStatus('all');
                    setFilterType('all');
                    setSearchTerm('');
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nom du document</Th>
            <Th>Patient</Th>
            <Th>Type</Th>
            <Th>Statut</Th>
            <Th>Créé le</Th>
            <Th>Dernière modification</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <Tr 
                key={doc.id} 
                _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                onClick={() => navigate(`/documents/${doc.id}`)}
              >
                <Td fontWeight="medium">{doc.title}</Td>
                <Td>{doc.patient.name}</Td>
                <Td>
                  <Tag colorScheme="blue" variant="subtle">
                    {doc.type}
                  </Tag>
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(doc.status)}>
                    {doc.status}
                  </Badge>
                </Td>
                <Td>{doc.createdAt}</Td>
                <Td>{doc.updatedAt}</Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<HamburgerIcon />}
                      variant="ghost"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <MenuList onClick={(e) => e.stopPropagation()}>
                      <MenuItem 
                        icon={<ViewIcon />}
                        onClick={() => navigate(`/documents/${doc.id}`)}
                      >
                        Voir
                      </MenuItem>
                      <MenuItem 
                        icon={<EditIcon />}
                        onClick={() => navigate(`/documents/${doc.id}/edit`)}
                      >
                        Modifier
                      </MenuItem>
                      <MenuItem icon={<EmailIcon />}>
                        Envoyer par email
                      </MenuItem>
                      <MenuItem icon={<DownloadIcon />}>
                        Télécharger
                      </MenuItem>
                      <Divider my={1} />
                      <MenuItem 
                        icon={<DeleteIcon />} 
                        color="red.500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(doc);
                        }}
                      >
                        Supprimer
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={7} textAlign="center" py={8}>
                <Text color="gray.500">Aucun document trouvé</Text>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

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
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Supprimer
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Documents;

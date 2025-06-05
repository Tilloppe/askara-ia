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
import { DocumentTemplateSelector } from '../components/documents';
import type { Document } from '../types/common';
import { documentService } from '../services/documentService';
import MedicalDocumentCreator from '../components/documents/MedicalDocumentCreator';

const Documents = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  

  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
      // Créer un nouveau document avec les données du formulaire
      const newDocument = {
        title: document.title || 'Nouveau document',
        type: document.templateId || 'Document personnalisé',
        patient: document.patientId ? 
          { id: document.patientId, name: document.patientName } : 
          { id: 'new-patient', name: 'Nouveau patient' },
        status: 'brouillon',
        content: document.content || 'Contenu du document...',
        createdBy: 'Utilisateur actuel',
        tags: document.tags || [],
        templateId: document.templateId,
        data: document.data || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Enregistrer le document
      await documentService.createDocument(newDocument);
      
      // Mettre à jour la liste des documents
      const updatedDocs = await documentService.getAllDocuments();
      setDocuments(updatedDocs);
      setFilteredDocuments(updatedDocs);
      
      // Fermer le modal de création
      setIsCreateModalOpen(false);
      
      // Afficher un message de succès
      toast({
        title: 'Document créé',
        description: 'Le document a été créé avec succès.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erreur lors de la création du document', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la création du document.',
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
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Nouveau document
          </Button>
        </HStack>
      </Box>

      {/* Modal de création de document */}
      <MedicalDocumentCreator
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        patients={[
          // Simuler une liste de patients - à remplacer par un appel API réel
          { id: '1', firstName: 'Jean', lastName: 'Dupont', birthDate: '1980-05-15' },
          { id: '2', firstName: 'Marie', lastName: 'Martin', birthDate: '1975-11-22' },
        ]}
        templates={[
          // Modèle de compte rendu de consultation ORL
          {
            id: '1',
            title: 'Compte rendu de consultation ORL',
            content: 'Dr [Nom Prénom] – Oto-Rhino-Laryngologiste  \n' +
                    'Adresse : [Adresse du cabinet]  \n' +
                    'Téléphone : [Numéro] – Email : [Email]  \n' +
                    'Date : [JJ/MM/AAAA]  \n' +
                    'Patient(e) : [Nom – Prénom]  \n' +
                    'Date de naissance : [JJ/MM/AAAA]  \n' +
                    'N° de dossier : [Référence]\n\n' +
                    '🔹 **Motif de consultation :**  \n' +
                    '[motif]\n\n' +
                    '🔹 **Antécédents :**  \n' +
                    '[antécédents]\n\n' +
                    '🔹 **Examen clinique :**  \n' +
                    '[examen]\n\n' +
                    '🔹 **Examens complémentaires :**  \n' +
                    '[examens_complémentaires]\n\n' +
                    '🔹 **Diagnostic :**  \n' +
                    '[diagnostic]\n\n' +
                    '🔹 **Conduite à tenir :**  \n' +
                    '[conduite]\n\n' +
                    'Signature du praticien  \n' +
                    '[Nom / cachet]',
            fields: [
              'Nom Prénom', 'Adresse du cabinet', 'Numéro', 'Email', 
              'JJ/MM/AAAA', 'Nom – Prénom', 'JJ/MM/AAAA', 'Référence',
              'motif', 'antécédents', 'examen', 'examens_complémentaires',
              'diagnostic', 'conduite', 'Nom / cachet'
            ]
          },
          // Modèle de compte rendu post-opératoire ORL
          {
            id: '2',
            title: 'Compte rendu post-opératoire ORL',
            content: 'Dr [Nom Prénom] – Oto-Rhino-Laryngologiste  \n' +
                    'Établissement : [Nom clinique/hôpital]  \n' +
                    'Date : [JJ/MM/AAAA]  \n' +
                    'Patient(e) : [Nom – Prénom]  \n' +
                    'Date de naissance : [JJ/MM/AAAA]  \n' +
                    'N° de dossier : [Référence]\n\n' +
                    '🔹 **Intervention pratiquée :** [intervention]\n\n' +
                    '🔹 **Date de l\'intervention :** [JJ/MM/AAAA]  \n' +
                    '🔹 **Chirurgien opérateur :** Dr [Nom]  \n' +
                    '🔹 **Anesthésiste :** Dr [Nom]\n\n' +
                    '🔹 **Indications :**  \n' +
                    '[indications]\n\n' +
                    '🔹 **Technique opératoire :**  \n' +
                    '[technique]\n\n' +
                    '🔹 **Suites opératoires immédiates :**  \n' +
                    '[suites]\n\n' +
                    '🔹 **Conduite à tenir :**  \n' +
                    '[conduite]\n\n' +
                    'Signature du praticien  \n' +
                    '[Nom / cachet]',
            fields: [
              'Nom Prénom', 'Nom clinique/hôpital', 'JJ/MM/AAAA', 'Nom – Prénom',
              'JJ/MM/AAAA', 'Référence', 'intervention', 'JJ/MM/AAAA',
              'Nom', 'Nom', 'indications', 'technique', 'suites', 'conduite',
              'Nom / cachet'
            ]
          },
          // Modèle de dossier MDPH / ALD
          {
            id: '3',
            title: 'Dossier MDPH / ALD',
            content: '🔹 **Motif de la demande :**  \n' +
                    '[motif_demande]\n\n' +
                    '🔹 **Antécédents médicaux :**  \n' +
                    '[antecedents]\n\n' +
                    '🔹 **Situation actuelle :**  \n' +
                    '[situation]\n\n' +
                    '🔹 **Traitements en cours :**  \n' +
                    '[traitements]\n\n' +
                    '🔹 **Évolution :**  \n' +
                    '[evolution]\n\n' +
                    '🔹 **Handicap évalué :**  \n' +
                    '[handicap]\n\n' +
                    '🔹 **Avis médical :**  \n' +
                    '[avis]\n\n' +
                    'Signature et cachet du médecin  \n' +
                    '[Nom, spécialité, n° RPPS]',
            fields: [
              'motif_demande', 'antecedents', 'situation', 'traitements',
              'evolution', 'handicap', 'avis', 'Nom, spécialité, n° RPPS'
            ]
          }
        ]}
        onSave={handleNewDocument}
      />

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

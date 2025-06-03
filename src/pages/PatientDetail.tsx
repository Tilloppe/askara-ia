import { useState, useRef } from 'react';
import { 
  Box, 
  Heading, 
  VStack, 
  HStack, 
  Button, 
  Text, 
  Badge, 
  Icon, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  Card, 
  CardHeader, 
  CardBody, 
  Divider,
  Avatar,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiTrash2, 
  FiPrinter, 
  FiMail, 
  FiPhone, 
  FiHome, 
  FiCalendar, 
  FiUser, 
  FiPlus,
  FiChevronRight,
  FiFileText,
  FiDownload,
  FiClock,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';

// Mock data - in a real app, this would come from an API
const mockPatient = {
  id: '1',
  civility: 'M.',
  lastName: 'Dupont',
  firstName: 'Jean',
  fullName: 'Jean Dupont',
  birthDate: '15/05/1985',
  age: 38,
  birthPlace: 'Paris, France',
  socialSecurityNumber: '1 85 05 15 123 456 78',
  email: 'jean.dupont@example.com',
  phone: '01 23 45 67 89',
  mobile: '06 12 34 56 78',
  address: '123 Rue de l\'Exemple',
  postalCode: '75001',
  city: 'Paris',
  country: 'France',
  referringDoctor: 'Dr. Martin',
  referringDoctorPhone: '01 98 76 54 32',
  referringDoctorEmail: 'dr.martin@example.com',
  notes: 'Patient suivi pour acouphènes chroniques. Porte des appareils auditifs depuis 2020.',
  lastVisit: '15/05/2025',
  nextAppointment: '15/08/2025',
  documents: 12,
  status: 'actif',
};

// Mock documents
const mockDocuments = [
  {
    id: '1',
    title: 'Compte-rendu de consultation',
    type: 'Consultation',
    date: '15/05/2025',
    status: 'finalisé',
    tags: ['consultation', 'suivi'],
  },
  {
    id: '2',
    title: 'Ordonnance',
    type: 'Ordonnance',
    date: '10/05/2025',
    status: 'envoyé',
    tags: ['ordonnance', 'traitement'],
  },
  {
    id: '3',
    title: 'Bilan auditif',
    type: 'Bilan',
    date: '01/05/2025',
    status: 'signé',
    tags: ['bilan', 'audition'],
  },
];

// Mock appointments
const mockAppointments = [
  {
    id: '1',
    date: '15/08/2025',
    time: '14:30',
    type: 'Consultation de suivi',
    status: 'planifié',
    notes: 'Contrôle des appareils auditifs',
  },
  {
    id: '2',
    date: '15/05/2025',
    time: '14:30',
    type: 'Consultation',
    status: 'terminé',
    notes: 'Renouvellement ordonnance',
  },
  {
    id: '3',
    date: '15/02/2025',
    time: '10:00',
    type: 'Bilan auditif',
    status: 'terminé',
    notes: 'Bilan annuel',
  },
];

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  
  // In a real app, you would fetch the patient data using the id
  const [patient, setPatient] = useState(mockPatient);
  const [documents] = useState(mockDocuments);
  const [appointments] = useState(mockAppointments);
  
  const handleDelete = () => {
    // In a real app, this would call an API to delete the patient
    console.log('Deleting patient:', patient.id);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Patient supprimé',
        description: `Le patient ${patient.fullName} a été supprimé avec succès.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Redirect to patients list
      navigate('/patients');
    }, 1000);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif':
        return 'green';
      case 'inactif':
        return 'gray';
      case 'en attente':
        return 'orange';
      default:
        return 'blue';
    }
  };
  
  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'finalisé':
        return 'green';
      case 'envoyé':
        return 'blue';
      case 'signé':
        return 'purple';
      case 'brouillon':
      default:
        return 'gray';
    }
  };
  
  const getAppointmentStatusIcon = (status: string) => {
    switch (status) {
      case 'planifié':
        return <Icon as={FiClock} color="blue.500" />;
      case 'terminé':
        return <Icon as={FiCheckCircle} color="green.500" />;
      case 'annulé':
        return <Icon as={FiAlertCircle} color="red.500" />;
      default:
        return <Icon as={FiClock} color="gray.500" />;
    }
  };

  return (
    <Box>
      {/* Header with breadcrumb and actions */}
      <HStack justify="space-between" mb={6} align="center">
        <Breadcrumb spacing="8px" separator={<FiChevronRight color="gray.500" />}>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/patients">
              Patients
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">
              {patient.fullName}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <HStack spacing={2}>
          <Button 
            leftIcon={<FiArrowLeft />} 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>
          
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FiMoreVertical />}
              variant="outline"
            />
            <MenuList>
              <MenuItem 
                icon={<FiEdit2 />}
                onClick={() => navigate(`/patients/${id}/edit`)}
              >
                Modifier
              </MenuItem>
              <MenuItem 
                icon={<FiPrinter />}
                onClick={() => window.print()}
              >
                Imprimer la fiche
              </MenuItem>
              <MenuItem 
                icon={<FiMail />}
                onClick={() => navigate(`/patients/${id}/email`)}
              >
                Envoyer un email
              </MenuItem>
              <Divider my={1} />
              <MenuItem 
                icon={<FiTrash2 />} 
                color="red.500"
                onClick={onOpen}
              >
                Supprimer
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>
      
      {/* Patient header */}
      <Card mb={6}>
        <CardBody>
          <HStack spacing={6} align="flex-start">
            <Avatar 
              size="xl" 
              name={patient.fullName} 
              bg="blue.500" 
              color="white"
              showBorder
              borderWidth="2px"
              borderColor="blue.200"
            />
            
            <VStack align="flex-start" spacing={1} flex={1}>
              <HStack>
                <Heading size="lg">{patient.fullName}</Heading>
                <Badge 
                  colorScheme={getStatusColor(patient.status)}
                  variant="subtle"
                  fontSize="0.8em"
                  px={2}
                  py={1}
                  borderRadius="md"
                  textTransform="capitalize"
                >
                  {patient.status}
                </Badge>
              </HStack>
              
              <Text color="gray.600">
                {patient.civility} • {patient.age} ans • Né(e) le {patient.birthDate}
              </Text>
              
              <HStack spacing={4} mt={2} color="gray.600">
                <HStack>
                  <Icon as={FiPhone} />
                  <Text>{patient.phone}</Text>
                </HStack>
                <HStack>
                  <Icon as={FiPhone} />
                  <Text>{patient.mobile}</Text>
                </HStack>
                <HStack>
                  <Icon as={FiMail} />
                  <Link href={`mailto:${patient.email}`} color="blue.500">
                    {patient.email}
                  </Link>
                </HStack>
              </HStack>
              
              <HStack mt={2} color="gray.600">
                <Icon as={FiHome} />
                <Text>
                  {patient.address}, {patient.postalCode} {patient.city}, {patient.country}
                </Text>
              </HStack>
              
              <HStack mt={2} color="gray.600">
                <Icon as={FiUser} />
                <Text>
                  <Text as="span" fontWeight="medium">Médecin traitant :</Text>{' '}
                  {patient.referringDoctor} • {patient.referringDoctorPhone}
                </Text>
              </HStack>
            </VStack>
            
            <VStack align="flex-end" spacing={3}>
              <Stat textAlign="right">
                <StatLabel>Dernière visite</StatLabel>
                <StatNumber fontSize="lg">{patient.lastVisit}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  2 visites cette année
                </StatHelpText>
              </Stat>
              
              <Button 
                leftIcon={<FiPlus />} 
                colorScheme="blue"
                size="sm"
                onClick={() => navigate(`/documents/new?patientId=${patient.id}`)}
              >
                Nouveau document
              </Button>
              
              <Button 
                leftIcon={<FiCalendar />} 
                variant="outline"
                size="sm"
                onClick={() => navigate(`/appointments/new?patientId=${patient.id}`)}
              >
                Prendre RDV
              </Button>
            </VStack>
          </HStack>
        </CardBody>
      </Card>
      
      {/* Tabs */}
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>Résumé</Tab>
          <Tab>Documents ({documents.length})</Tab>
          <Tab>Rendez-vous</Tab>
          <Tab>Historique</Tab>
        </TabList>
        
        <TabPanels>
          {/* Summary Tab */}
          <TabPanel p={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Card>
                <CardHeader>
                  <Heading size="md">Informations médicales</Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Box>
                      <Text fontWeight="medium" color="gray.600">Groupe sanguin</Text>
                      <Text>Non renseigné</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" color="gray.600">Allergies</Text>
                      <Text>Aucune allergie connue</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" color="gray.600">Traitements en cours</Text>
                      <Text>Aucun traitement en cours</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" color="gray.600">Antécédents médicaux</Text>
                      <Text>Acouphènes chroniques depuis 2020</Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
              
              <Card>
                <CardHeader>
                  <Heading size="md">Derniers documents</Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    {documents.slice(0, 3).map((doc) => (
                      <Box 
                        key={doc.id} 
                        p={3} 
                        borderWidth="1px" 
                        borderRadius="md"
                        _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                        onClick={() => navigate(`/documents/${doc.id}`)}
                      >
                        <HStack justify="space-between">
                          <VStack align="flex-start" spacing={0}>
                            <Text fontWeight="medium">{doc.title}</Text>
                            <Text fontSize="sm" color="gray.500">{doc.date}</Text>
                          </VStack>
                          <Badge colorScheme={getDocumentStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                        </HStack>
                      </Box>
                    ))}
                    <Button 
                      variant="ghost" 
                      colorScheme="blue" 
                      size="sm" 
                      alignSelf="flex-start"
                      onClick={() => navigate(`/patients/${id}/documents`)}
                    >
                      Voir tous les documents
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
              
              <Card gridColumn={{ base: '1 / -1', md: '1 / 3' }}>
                <CardHeader>
                  <Heading size="md">Notes</Heading>
                </CardHeader>
                <Divider />
                <CardBody>
                  <Text whiteSpace="pre-line">
                    {patient.notes || "Aucune note pour le moment."}
                  </Text>
                </CardBody>
              </Card>
            </SimpleGrid>
          </TabPanel>
          
          {/* Documents Tab */}
          <TabPanel p={0}>
            <Card>
              <CardBody p={0}>
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Document</Th>
                      <Th>Type</Th>
                      <Th>Date</Th>
                      <Th>Statut</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {documents.map((doc) => (
                      <Tr key={doc.id} _hover={{ bg: 'gray.50' }}>
                        <Td>
                          <Text fontWeight="medium">{doc.title}</Text>
                          <HStack mt={1} spacing={2}>
                            {doc.tags.map(tag => (
                              <Tag key={tag} size="sm" variant="subtle" colorScheme="gray">
                                {tag}
                              </Tag>
                            ))}
                          </HStack>
                        </Td>
                        <Td>{doc.type}</Td>
                        <Td>{doc.date}</Td>
                        <Td>
                          <Badge colorScheme={getDocumentStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              aria-label="Voir le document"
                              icon={<FiFileText />}
                              size="sm"
                              variant="ghost"
                              onClick={() => navigate(`/documents/${doc.id}`)}
                            />
                            <IconButton
                              aria-label="Télécharger le document"
                              icon={<FiDownload />}
                              size="sm"
                              variant="ghost"
                              onClick={() => console.log('Download', doc.id)}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </TabPanel>
          
          {/* Appointments Tab */}
          <TabPanel p={0}>
            <Card>
              <CardBody p={0}>
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Date et heure</Th>
                      <Th>Type</Th>
                      <Th>Statut</Th>
                      <Th>Notes</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {appointments.map((appt) => (
                      <Tr key={appt.id} _hover={{ bg: 'gray.50' }}>
                        <Td>
                          <Text fontWeight="medium">{appt.date}</Text>
                          <Text fontSize="sm" color="gray.500">{appt.time}</Text>
                        </Td>
                        <Td>{appt.type}</Td>
                        <Td>
                          <HStack>
                            {getAppointmentStatusIcon(appt.status)}
                            <Text textTransform="capitalize">{appt.status}</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <Text noOfLines={1} maxW="300px">
                            {appt.notes}
                          </Text>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              aria-label="Voir le rendez-vous"
                              icon={<FiFileText />}
                              size="sm"
                              variant="ghost"
                              onClick={() => navigate(`/appointments/${appt.id}`)}
                            />
                            <IconButton
                              aria-label="Modifier le rendez-vous"
                              icon={<FiEdit2 />}
                              size="sm"
                              variant="ghost"
                              onClick={() => navigate(`/appointments/${appt.id}/edit`)}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </TabPanel>
          
          {/* History Tab */}
          <TabPanel p={0}>
            <Card>
              <CardBody>
                <Text>Historique des actions et modifications pour ce patient.</Text>
                {/* Timeline component would go here */}
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Supprimer le patient
            </AlertDialogHeader>

            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer le patient {patient.fullName} ?
              Toutes les données associées seront définitivement supprimées.
              Cette action est irréversible.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
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

export default PatientDetail;

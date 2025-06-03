import { useState, useRef } from 'react';
import { 
  Box, 
  Heading, 
  Button, 
  Input, 
  InputGroup, 
  InputLeftElement, 
  HStack, 
  VStack,
  Text, 
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Flex,
  Select,
  Avatar,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  SimpleGrid,
  useColorModeValue,
  Tooltip
} from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import * as FiIcons from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Composant d'icône compatible avec Chakra UI
const ChakraIcon = (props: { icon: keyof typeof FiIcons } & any) => {
  const IconComponent = FiIcons[props.icon];
  return <Icon as={IconComponent} {...props} />;
};

interface Patient {
  id: number;
  lastName: string;
  firstName: string;
  birthDate: string;
  code: string;
  createdAt: string;
  createdBy: string;
}

const Patients = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  // Mock data - in a real app, this would come from an API
  const patients: Patient[] = [
    {
      id: 1,
      lastName: 'Dupont',
      firstName: 'Jean',
      birthDate: '15/03/1975',
      code: 'DPJ750315',
      createdAt: '10/05/2025',
      createdBy: 'Dr. Martin',
    },
    {
      id: 2,
      lastName: 'Martin',
      firstName: 'Sophie',
      birthDate: '22/08/1982',
      code: 'MAS820822',
      createdAt: '05/05/2025',
      createdBy: 'Dr. Martin',
    },
    {
      id: 3,
      lastName: 'Bernard',
      firstName: 'Pierre',
      birthDate: '03/11/1965',
      code: 'BEP651103',
      createdAt: '28/04/2025',
      createdBy: 'Dr. Lefebvre',
    },
    {
      id: 4,
      lastName: 'Dubois',
      firstName: 'Marie',
      birthDate: '18/07/1990',
      code: 'DBM900718',
      createdAt: '01/06/2025',
      createdBy: 'Dr. Martin',
    },
    {
      id: 5,
      lastName: 'Leroy',
      firstName: 'Thomas',
      birthDate: '30/01/1978',
      code: 'LRT780130',
      createdAt: '30/05/2025',
      createdBy: 'Dr. Lefebvre',
    },
  ];
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // Suppression de la fonction inutilisée pour l'instant
  // const getInitials = (firstName: string, lastName: string) => {
  //   return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  // };

  const filteredPatients = patients.filter(patient => 
    `${patient.lastName} ${patient.firstName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt.split('/').reverse().join('-')).getTime() - 
             new Date(a.createdAt.split('/').reverse().join('-')).getTime();
    } else if (sortBy === 'name') {
      return a.lastName.localeCompare(b.lastName);
    }
    return 0;
  });

  const handleDeleteClick = (patient: Patient) => {
    setPatientToDelete(patient);
    onOpen();
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the patient
    toast({
      title: 'Patient supprimé',
      description: `Le patient ${patientToDelete?.firstName} ${patientToDelete?.lastName} a été supprimé.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <Box h="100%" display="flex" flexDirection="column" w="100%" maxW="100vw" overflowX="hidden">
      <Box px={{ base: 4, md: 6 }} pt={4} w="100%" maxW="100%">
        <Flex justify="space-between" align="center" mb={4}>
          <Box>
            <Heading size="lg" mb={1}>Patients</Heading>
            <Text color="gray.500" fontSize="sm">
              Gestion des dossiers patients
            </Text>
          </Box>
          <Button 
            leftIcon={<ChakraIcon icon="FiPlus" />} 
            colorScheme="blue"
            onClick={() => navigate('/patients/new')}
            size={{ base: 'sm', md: 'md' }}
          >
            Ajouter un patient
          </Button>
        </Flex>

        <Card variant="outline" mb={4}>
          <CardBody p={{ base: 4, md: 4 }}>
            <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
              <InputGroup maxW="400px">
                <InputLeftElement pointerEvents="none">
                  <ChakraIcon icon="FiSearch" color="gray.400" />
                </InputLeftElement>
                <Input 
                  placeholder="Rechercher un patient..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="md"
                />
              </InputGroup>
              
              <HStack spacing={3} ml={{ md: 'auto' }}>
                <Tooltip label="Filtrer">
                  <IconButton
                    icon={<ChakraIcon icon="FiFilter" />}
                    aria-label="Filtrer"
                    variant="outline"
                  />
                </Tooltip>
                <Select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  maxW="200px"
                  size="md"
                >
                  <option value="recent">Récents en premier</option>
                  <option value="name">Ordre alphabétique</option>
                </Select>
                <Button leftIcon={<ChakraIcon icon="FiDownload" boxSize="1.25rem" />} variant="outline" size="md">
                  Exporter
                </Button>
              </HStack>
            </Flex>
          </CardBody>
        </Card>
      </Box>

      <Box flex="1" overflowY="auto" px={{ base: 4, md: 6 }} pb={6} w="100%" maxW="100vw" mx="auto">
        {sortedPatients.length > 0 ? (
        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 3, xl: 4, '2xl': 5 }} 
          spacing={4} 
          w="100%"
          maxW="100%"
          mx="auto"
        >
          {sortedPatients.map((patient) => (
            <Card 
              key={patient.id} 
              variant="outline" 
              _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
              transition="all 0.2s"
              w="100%"
              maxW="100%"
            >
              <CardHeader pb={2}>
                <Flex alignItems="center">
                  <Avatar
                    name={`${patient.firstName} ${patient.lastName}`}
                    bg="blue.500"
                    color="white"
                    mr={3}
                    size="md"
                  />
                  <Box>
                    <Text fontWeight="semibold" fontSize="lg">
                      {patient.lastName} {patient.firstName}
                    </Text>
                    <Badge colorScheme="blue" variant="subtle">
                      {patient.code}
                    </Badge>
                  </Box>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<ChakraIcon icon="FiMoreVertical" />}
                      variant="ghost"
                      size="sm"
                      ml="auto"
                      aria-label="Options"
                    />
                    <MenuList>
                      <MenuItem 
                        icon={<ChakraIcon icon="FiEdit2" />} 
                        onClick={() => navigate(`/patients/${patient.id}/edit`)}
                      >
                        Modifier
                      </MenuItem>
                      <MenuItem 
                        icon={<ChakraIcon icon="FiTrash2" />} 
                        color="red.500"
                        onClick={() => handleDeleteClick(patient)}
                      >
                        Supprimer
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              </CardHeader>
              <CardBody pt={2} pb={4}>
                <VStack align="stretch" spacing={2}>
                  <Flex align="center">
                    <ChakraIcon icon="FiCalendar" mr={2} color="green.500" />
                    <Text fontSize="sm" color="gray.600">
                      Né(e) le <Text as="span" fontWeight="medium">{patient.birthDate}</Text>
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <ChakraIcon icon="FiUser" mr={2} color="gray.500" />
                    <Text fontSize="sm" color="gray.600">
                      Créé par <Text as="span" fontWeight="medium">{patient.createdBy}</Text>
                    </Text>
                  </Flex>
                  <Flex align="center">
                    <ChakraIcon icon="FiClock" mr={2} color="gray.400" />
                    <Text fontSize="sm" color="gray.600">
                      Créé le <Text as="span" fontWeight="medium">{patient.createdAt}</Text>
                    </Text>
                  </Flex>
                </VStack>
              </CardBody>
              <CardFooter pt={0}>
                <Button 
                  variant="outline" 
                  colorScheme="blue" 
                  size="sm" 
                  w="full"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  Voir le dossier
                </Button>
              </CardFooter>
            </Card>
          ))}
          </SimpleGrid>
        ) : (
          <Box 
            bg={cardBg} 
            p={8} 
            borderRadius="lg" 
            textAlign="center"
            borderWidth="1px"
            borderColor={borderColor}
            h="100%"
          >
            <Text fontSize="lg" color="gray.500" mb={4}>
              Aucun patient trouvé
            </Text>
            <Button 
              colorScheme="blue" 
              leftIcon={<ChakraIcon icon="FiPlus" boxSize="1.25rem" />}
              onClick={() => navigate('/patients/new')}
            >
              Ajouter un patient
            </Button>
          </Box>
        )}
      </Box>

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
              Êtes-vous sûr de vouloir supprimer {patientToDelete?.firstName} {patientToDelete?.lastName} ?
              Cette action est irréversible.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
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

export default Patients;

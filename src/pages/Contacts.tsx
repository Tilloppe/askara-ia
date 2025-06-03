import { 
  Box, 
  Heading, 
  Button, 
  Input, 
  InputGroup, 
  InputLeftElement, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  HStack, 
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
  VStack,
  Icon,
  Card
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';

// Importer directement les icônes nécessaires
import { 
  FiSearch, 
  FiPlus, 
  FiMoreVertical, 
  FiMail, 
  FiPhone, 
  FiUser, 
  FiBriefcase, 
  FiTrash2 
} from 'react-icons/fi';

interface Contact {
  id: number;
  type: 'Médecin' | 'Patient' | 'Autre';
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  specialty?: string;
  createdAt: string;
  createdBy: string;
}

// Composant d'icône personnalisé pour Chakra UI
const ChakraIcon = ({ icon: IconComponent, ...props }: { icon: any } & any) => {
  return <Icon as={IconComponent} {...props} />
};

const Contacts = () => {
  console.log('Composant Contacts rendu');
  const navigate = useNavigate();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  // Mock data - in a real app, this would come from an API
  const contacts: Contact[] = [
    {
      id: 1,
      type: 'Médecin',
      lastName: 'Martin',
      firstName: 'Sophie',
      email: 'sophie.martin@example.com',
      phone: '06 12 34 56 78',
      specialty: 'ORL',
      createdAt: '15/05/2025',
      createdBy: 'Dr. Martin',
    },
    {
      id: 2,
      type: 'Patient',
      lastName: 'Dupont',
      firstName: 'Jean',
      email: 'jean.dupont@example.com',
      phone: '06 98 76 54 32',
      createdAt: '10/05/2025',
      createdBy: 'Dr. Martin',
    },
    {
      id: 3,
      type: 'Médecin',
      lastName: 'Leroy',
      firstName: 'Pierre',
      email: 'pierre.leroy@example.com',
      phone: '06 45 67 89 01',
      specialty: 'Généraliste',
      createdAt: '01/05/2025',
      createdBy: 'Dr. Martin',
    },
  ];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      `${contact.lastName} ${contact.firstName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm);
    
    const matchesType = filterType === 'all' || contact.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    onOpen();
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the contact
    toast({
      title: 'Contact supprimé',
      description: `Le contact ${contactToDelete?.firstName} ${contactToDelete?.lastName} a été supprimé.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case 'Médecin':
        return 'blue';
      case 'Patient':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <Box w="100%" h="100%" display="flex" flexDirection="column" maxW="100%" overflowX="hidden">
      {/* En-tête avec titre et bouton */}
      <Box px={{ base: 4, md: 6 }} pt={6} w="100%" maxW="100%" bg="white" borderBottom="1px" borderColor="gray.200">
        <Flex justify="space-between" align="center" py={4}>
          <Heading size="lg" color="gray.800">Contacts</Heading>
          <Button 
            leftIcon={<ChakraIcon icon={FiPlus} />} 
            colorScheme="blue"
            size="sm"
            onClick={() => navigate('/contacts/new')}
            _hover={{ transform: 'translateY(-1px)' }}
            _active={{ transform: 'translateY(0)' }}
          >
            Nouveau contact
          </Button>
        </Flex>
      </Box>

      {/* Barre de filtres */}
      <Box px={{ base: 4, md: 6 }} py={4} bg="white" borderBottom="1px" borderColor="gray.200">
        <Flex justify="space-between" direction={{ base: 'column', md: 'row' }} gap={4}>
          <InputGroup maxW={{ base: '100%', md: '400px' }}>
            <InputLeftElement pointerEvents="none" h="100%" pl={2}>
              <ChakraIcon icon={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input 
              placeholder="Rechercher un contact..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              pl={10}
              size="sm"
              borderRadius="md"
              bg="white"
              borderColor="gray.200"
              _hover={{ borderColor: 'gray.300' }}
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px #3182ce',
              }}
            />
          </InputGroup>
          
          <HStack spacing={3} w={{ base: '100%', md: 'auto' }}>
            <Select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              maxW={{ base: '100%', md: '200px' }}
              size="sm"
              borderRadius="md"
              borderColor="gray.200"
              _hover={{ borderColor: 'gray.300' }}
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px #3182ce',
              }}
            >
              <option value="all">Tous les types</option>
              <option value="Médecin">Médecins</option>
              <option value="Patient">Patients</option>
              <option value="Autre">Autres</option>
            </Select>
            
            <Select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date')}
              maxW={{ base: '100%', md: '200px' }}
              size="sm"
              borderRadius="md"
              borderColor="gray.200"
              _hover={{ borderColor: 'gray.300' }}
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px #3182ce',
              }}
            >
              <option value="name">Trier par nom</option>
              <option value="date">Trier par date</option>
            </Select>
          </HStack>
        </Flex>
      </Box>

      {/* Liste des contacts */}
      <Box flex={1} overflowY="auto" px={{ base: 2, md: 6 }} pb={6} w="100%" maxW="100%" overflowX="auto" position="relative" zIndex={1}>
        <Card variant="outline" overflow="hidden" w="100%" maxW="100%">
          <Box overflowX="hidden" w="100%">
            <Table variant="simple" w="100%" layout="fixed">
              <Thead bg="gray.50">
                <Tr>
                  <Th whiteSpace="nowrap" textTransform="none" fontWeight="600" fontSize="sm" color="gray.600">Type</Th>
                  <Th whiteSpace="nowrap" textTransform="none" fontWeight="600" fontSize="sm" color="gray.600">Nom</Th>
                  <Th whiteSpace="nowrap" w="180px" textTransform="none" fontWeight="600" fontSize="sm" color="gray.600">Email</Th>
                  <Th whiteSpace="nowrap" w="140px" textTransform="none" fontWeight="600" fontSize="sm" color="gray.600">Téléphone</Th>
                  <Th whiteSpace="nowrap" minW="120px" textTransform="none" fontWeight="600" fontSize="sm" color="gray.600">Créé(e) le</Th>
                  <Th whiteSpace="nowrap" minW="120px" textTransform="none" fontWeight="600" fontSize="sm" color="gray.600">Créé(e) par</Th>
                  <Th textAlign="right" whiteSpace="nowrap" w="100px" pr={4} textTransform="none" fontWeight="600" fontSize="sm" color="gray.600">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <Tr key={contact.id} _hover={{ bg: 'gray.50' }}>
                      <Td>
                        <Badge 
                          colorScheme={getContactTypeColor(contact.type)}
                          display="flex" 
                          alignItems="center" 
                          w="fit-content"
                          px={2} py={1} borderRadius="md"
                        >
                          {contact.type === 'Médecin' ? (
                            <ChakraIcon icon={FiBriefcase} mr={1} />
                          ) : contact.type === 'Patient' ? (
                            <ChakraIcon icon={FiUser} mr={1} />
                          ) : (
                            <ChakraIcon icon={FiUser} mr={1} />
                          )}
                          {contact.type}
                          {contact.specialty && ` (${contact.specialty})`}
                        </Badge>
                      </Td>
                      <Td>
                        <Text fontWeight="medium">{contact.lastName} {contact.firstName}</Text>
                      </Td>
                      <Td>
                        <HStack spacing={1} color="blue.500" align="center">
                          <ChakraIcon icon={FiMail} boxSize={4} flexShrink={0} />
                          <Text fontSize="sm" isTruncated>{contact.email}</Text>
                        </HStack>
                      </Td>
                      <Td>
                        <HStack spacing={1} color="green.500" align="center">
                          <ChakraIcon icon={FiPhone} boxSize={4} flexShrink={0} />
                          <Text fontSize="sm" isTruncated>{contact.phone}</Text>
                        </HStack>
                      </Td>
                      <Td>{contact.createdAt}</Td>
                      <Td>{contact.createdBy}</Td>
                      <Td textAlign="right" w="100px" pr={4} pl={2}>
                        <Menu placement="bottom-end" isLazy offset={[0, 5]} strategy="fixed">
                          <MenuButton
                            as={IconButton}
                            icon={<ChakraIcon icon={FiMoreVertical} />}
                            mr={2}
                            variant="ghost"
                            size="sm"
                            aria-label="Actions"
                            _hover={{ bg: 'gray.100' }}
                          />
                          <MenuList minW="200px" zIndex={1400} boxShadow="md" py={1} borderColor="gray.200" borderWidth="1px">
                            <MenuItem 
                              icon={<ChakraIcon icon={FiMail} boxSize={4} />}
                              _hover={{ bg: 'gray.50' }}
                              fontSize="sm"
                              py={2}
                            >
                              Envoyer un email
                            </MenuItem>
                            <MenuItem 
                              icon={<ChakraIcon icon={FiPhone} boxSize={4} />}
                              _hover={{ bg: 'gray.50' }}
                              fontSize="sm"
                              py={2}
                            >
                              Appeler
                            </MenuItem>
                            <MenuItem 
                              icon={<ChakraIcon icon={FiUser} boxSize={4} />}
                              onClick={() => navigate(`/contacts/${contact.id}/edit`)}
                              _hover={{ bg: 'gray.50' }}
                              fontSize="sm"
                              py={2}
                            >
                              Modifier
                            </MenuItem>
                            <MenuItem 
                              icon={<ChakraIcon icon={FiTrash2} boxSize={4} />} 
                              color="red.500"
                              onClick={() => handleDeleteClick(contact)}
                              _hover={{ bg: 'red.50' }}
                              fontSize="sm"
                              py={2}
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
                      <VStack spacing={2}>
                        <Text color="gray.500">Aucun contact trouvé</Text>
                        {searchTerm && (
                          <Button 
                            variant="ghost" 
                            colorScheme="blue" 
                            size="sm"
                            onClick={() => setSearchTerm('')}
                          >
                            Réinitialiser la recherche
                          </Button>
                        )}
                      </VStack>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Card>
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
              Supprimer le contact
            </AlertDialogHeader>

            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer ce contact ? Cette action est irréversible.
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

export default Contacts;

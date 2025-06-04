import { useState } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Heading, 
  Text, 
  Card, 
  CardBody, 
  Button, 
  useDisclosure, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Badge,
  Icon,
  InputGroup,
  InputLeftElement,
  IconButton,
  Spinner
} from '@chakra-ui/react';
import { 
  FiSettings, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiClock, 
  FiLink2, 
  FiSearch, 
  FiX,
  FiExternalLink
} from 'react-icons/fi';

type SoftwareIntegration = {
  id: string;
  name: string;
  description: string;
  logo: string;
  connected: boolean;
  connectionDate?: string;
  category: string;
  settings?: Record<string, any>;
};

// Logos des logiciels
const logos = {
  audiowizard: 'https://cdn-icons-png.flaticon.com/512/2777/2777160.png',
  noah: 'https://www.auditdata.com/wp-content/uploads/2021/03/NOAH-Software-Logo-Color.png',
  otometrics: 'https://www.natus.com/sites/g/files/g10000126/f/201904/otometrics-logo.png',
  interacoustics: 'https://www.interacoustics.com/hubfs/Interacoustics_Logo_black_RGB_1.png',
  gnathe: 'https://www.gnathe.fr/wp-content/uploads/2021/03/logo-gnathe.png',
  audioscan: 'https://www.audioscan.com/wp-content/uploads/2018/09/audioscan-logo.png',
  audiogram: 'https://www.audiogram.fr/wp-content/uploads/2021/03/logo-audiogram.png'
};

// Données de démonstration
const initialIntegrations: SoftwareIntegration[] = [
  {
    id: 'audiowizard',
    name: 'AudioWizard',
    description: 'Logiciel d\'audioprothèse avancé pour la gestion des patients et des appareils auditifs',
    logo: logos.audiowizard,
    connected: true,
    connectionDate: '2023-06-01',
    category: 'Gestion de cabinet'
  },
  {
    id: 'noah',
    name: 'NOAH',
    description: 'Solution de gestion de cabinet d\'audioprothèse et partage de données',
    logo: logos.noah,
    connected: true,
    connectionDate: '2023-05-15',
    category: 'Gestion de cabinet'
  },
  {
    id: 'otometrics',
    name: 'Otometrics',
    description: 'Solutions de diagnostic auditif complet et équipements audiométriques',
    logo: logos.otometrics,
    connected: false,
    category: 'Diagnostic'
  },
  {
    id: 'interacoustics',
    name: 'Interacoustics',
    description: 'Solutions audiologiques complètes et équipements de pointe',
    logo: logos.interacoustics,
    connected: false,
    category: 'Diagnostic'
  },
  {
    id: 'gnathe',
    name: 'Gnathe',
    description: 'Logiciel de gestion pour audioprothésistes et centres auditifs',
    logo: logos.gnathe,
    connected: false,
    category: 'Gestion de cabinet'
  },
  {
    id: 'audioscan',
    name: 'AudioScan',
    description: 'Solutions de vérification et de validation des aides auditives',
    logo: logos.audioscan,
    connected: false,
    category: 'Vérification'
  },
  {
    id: 'audiogram',
    name: 'Audiogram',
    description: 'Logiciel d\'audiométrie et de gestion de patientèle',
    logo: logos.audiogram,
    connected: false,
    category: 'Audiométrie'
  }
];

const SoftwareGatewayPage = () => {
  const [integrations, setIntegrations] = useState<SoftwareIntegration[]>(initialIntegrations);
  const [selectedIntegration, setSelectedIntegration] = useState<SoftwareIntegration | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Catégories uniques pour le filtre
  const categories = ['Tous', ...Array.from(new Set(initialIntegrations.map(int => int.category)))];

  // Filtrer les intégrations par recherche et catégorie
  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConnect = (integration: SoftwareIntegration) => {
    setSelectedIntegration(integration);
    onOpen();
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(prev => 
      prev.map(int => 
        int.id === id 
          ? { ...int, connected: false, connectionDate: undefined }
          : int
      )
    );
    
    toast({
      title: 'Déconnexion réussie',
      description: `Vous avez été déconnecté de ${integrations.find(i => i.id === id)?.name}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSubmitConnection = () => {
    if (!selectedIntegration) return;
    
    setIsConnecting(true);
    
    // Simulation de connexion
    setTimeout(() => {
      setIntegrations(prev => 
        prev.map(int => 
          int.id === selectedIntegration.id 
            ? { 
                ...int, 
                connected: true, 
                connectionDate: new Date().toISOString() 
              }
            : int
        )
      );
      
      onClose();
      setIsConnecting(false);
      setApiKey('');
      
      toast({
        title: 'Connexion réussie',
        description: `Vous êtes maintenant connecté à ${selectedIntegration.name}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 1500);
  };

  return (
    <Box maxW="7xl" mx="auto" p={{ base: 4, md: 6 }}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="xl" mb={3} color="brand.600">Passerelle Logiciel</Heading>
          <Text color="gray.600" fontSize="lg">
            Connectez vos logiciels métier pour synchroniser automatiquement vos données et optimiser votre flux de travail.
          </Text>
        </Box>

        <Box mt={8}>
          <HStack justify="space-between" mb={6} flexWrap="wrap" gap={4}>
            <Box flex={1} minW="300px">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Rechercher un logiciel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="lg"
                  bg="white"
                  _dark={{ bg: 'gray.700' }}
                  borderColor="gray.200"
                  _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }}
                />
                {searchTerm && (
                  <IconButton
                    aria-label="Effacer la recherche"
                    icon={<FiX />}
                    size="sm"
                    variant="ghost"
                    onClick={() => setSearchTerm('')}
                    position="absolute"
                    right="2"
                    top="50%"
                    transform="translateY(-50%)"
                  />
                )}
              </InputGroup>
            </Box>
            <HStack spacing={3} flexWrap="wrap">
              {categories.map(category => (
                <Button
                  key={category}
                  size="sm"
                  variant={selectedCategory === category ? 'solid' : 'outline'}
                  colorScheme={selectedCategory === category ? 'brand' : 'gray'}
                  onClick={() => setSelectedCategory(category)}
                  borderRadius="full"
                  px={4}
                >
                  {category}
                </Button>
              ))}
            </HStack>
          </HStack>

          {filteredIntegrations.length === 0 ? (
            <Box textAlign="center" py={10} bg="gray.50" borderRadius="lg" _dark={{ bg: 'gray.800' }}>
              <Text fontSize="lg" color="gray.500">
                Aucun logiciel ne correspond à votre recherche.
              </Text>
            </Box>
          ) : (
            <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
              {filteredIntegrations.map((integration) => (
                <Card 
                  key={integration.id} 
                  variant="outline" 
                  _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                  transition="all 0.2s"
                  borderRadius="xl"
                  overflow="hidden"
                  borderWidth="1px"
                  borderColor="gray.100"
                  _dark={{ borderColor: 'gray.700', bg: 'gray.800' }}
                >
                  <CardBody p={6}>
                    <VStack spacing={4} align="stretch">
                      <HStack spacing={4}>
                        <Box 
                          p={2} 
                          bg="white" 
                          borderRadius="lg" 
                          borderWidth="1px" 
                          borderColor="gray.100"
                          _dark={{ bg: 'gray.700', borderColor: 'gray.600' }}
                        >
                          <img 
                            src={integration.logo} 
                            alt={`Logo ${integration.name}`} 
                            style={{ 
                              width: '48px', 
                              height: '48px', 
                              objectFit: 'contain',
                              filter: integration.connected ? 'none' : 'grayscale(100%)',
                              opacity: integration.connected ? 1 : 0.7
                            }} 
                          />
                        </Box>
                        <VStack align="flex-start" spacing={0} flex={1}>
                          <HStack justify="space-between" w="full">
                            <Heading size="md" color={integration.connected ? 'brand.600' : 'inherit'} _dark={{ color: integration.connected ? 'brand.300' : 'white' }}>
                              {integration.name}
                            </Heading>
                            {integration.connected ? (
                              <Badge colorScheme="green" px={2} py={1} borderRadius="full" fontSize="xs">
                                <HStack spacing={1}>
                                  <Icon as={FiCheckCircle} boxSize={3} />
                                  <Text>Connecté</Text>
                                </HStack>
                              </Badge>
                            ) : (
                              <Badge colorScheme="gray" px={2} py={1} borderRadius="full" fontSize="xs">
                                Non connecté
                              </Badge>
                            )}
                          </HStack>
                          <Badge colorScheme="blue" variant="subtle" size="sm" mt={1}>
                            {integration.category}
                          </Badge>
                        </VStack>
                      </HStack>
                      
                      <Text color="gray.600" _dark={{ color: 'gray.300' }} fontSize="sm">
                        {integration.description}
                      </Text>
                      
                      {integration.connected && integration.connectionDate && (
                        <Text fontSize="xs" color="gray.500" mt={1}>
                          <Icon as={FiClock} mr={1} />
                          Connecté le {new Date(integration.connectionDate).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </Text>
                      )}
                      
                      <HStack spacing={3} mt={4}>
                        {integration.connected ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              leftIcon={<FiSettings />}
                              flex={1}
                              _hover={{ bg: 'gray.100' }}
                              _dark={{ _hover: { bg: 'gray.700' } }}
                            >
                              Paramètres
                            </Button>
                            <Button 
                              variant="outline" 
                              colorScheme="red"
                              size="sm"
                              onClick={() => handleDisconnect(integration.id)}
                              flex={1}
                            >
                              Déconnecter
                            </Button>
                          </>
                        ) : (
                          <Button 
                            colorScheme="brand" 
                            size="sm"
                            onClick={() => handleConnect(integration)}
                            w="full"
                            leftIcon={<FiLink2 />}
                          >
                            Connecter
                          </Button>
                        )}
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </VStack>

      {/* Modal de connexion */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connecter {selectedIntegration?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text mb={4} color="gray.600">
              Veuillez entrer vos informations de connexion pour {selectedIntegration?.name}.
            </Text>
            <FormControl>
              <FormLabel>Clé API</FormLabel>
              <Input 
                placeholder="Entrez votre clé API" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Text mt={2} fontSize="sm" color="gray.500">
                Vous pouvez trouver votre clé API dans les paramètres de votre compte {selectedIntegration?.name}.
              </Text>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Annuler
            </Button>
            <Button 
              colorScheme="brand" 
              onClick={handleSubmitConnection}
              isLoading={isConnecting}
              loadingText="Connexion..."
              leftIcon={<FiLink2 />}
            >
              Se connecter
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SoftwareGatewayPage;

import { 
  Box, 
  Heading, 
  Text, 
  SimpleGrid, 
  Card, 
  CardBody, 
  VStack, 
  HStack, 
  Button, 
  Icon, 
  useToast, 
  Flex, 
  Avatar, 
  Badge, 
  Progress, 
  Select,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  FiFileText, 
  FiUserPlus, 
  FiUpload, 
  FiUsers, 
  FiFile, 
  FiMessageSquare, 
  FiBell, 
  FiSearch, 
  FiChevronDown, 
  FiPlus,
  FiCalendar,
  FiClock,
  FiPieChart,
  FiBarChart2,
  FiFilter,
  FiDownload,
  FiMoreVertical
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Données pour les graphiques
const monthlyData = [
  { name: 'Jan', patients: 20, documents: 15 },
  { name: 'Fév', patients: 25, documents: 18 },
  { name: 'Mar', patients: 18, documents: 22 },
  { name: 'Avr', patients: 30, documents: 25 },
  { name: 'Mai', patients: 28, documents: 30 },
  { name: 'Juin', patients: 35, documents: 28 },
];

const documentTypes = [
  { name: 'Comptes-rendus', value: 35, color: '#4299E1' },
  { name: 'Ordonnances', value: 25, color: '#9F7AEA' },
  { name: 'Factures', value: 20, color: '#48BB78' },
  { name: 'Autres', value: 20, color: '#F6AD55' },
];

const recentDocuments = [
  { 
    id: 1, 
    title: 'Compte-rendu audio', 
    patient: 'Jean Dupont', 
    date: 'Aujourd\'hui', 
    type: 'Compte-rendu', 
    status: 'Terminé',
    size: '2.4 Mo'
  },
  { 
    id: 2, 
    title: 'Ordonnance médicale', 
    patient: 'Marie Martin', 
    date: 'Hier', 
    type: 'Ordonnance', 
    status: 'En attente',
    size: '1.8 Mo'
  },
  { 
    id: 3, 
    title: 'Bilan auditif', 
    patient: 'Pierre Durand', 
    date: '23/05/2025', 
    type: 'Bilan', 
    status: 'Brouillon',
    size: '3.2 Mo'
  },
  { 
    id: 4, 
    title: 'Facture consultation', 
    patient: 'Sophie Petit', 
    date: '20/05/2025', 
    type: 'Facture', 
    status: 'Envoyé',
    size: '1.1 Mo'
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // État pour le nombre de documents créés
  const [documentsCreated, setDocumentsCreated] = useState(() => {
    // Récupérer le nombre de documents depuis le localStorage ou utiliser 124 comme valeur par défaut
    const savedCount = localStorage.getItem('documentsCreated');
    return savedCount ? parseInt(savedCount, 10) : 124;
  });
  
  // Calculer le temps gagné (7 minutes par document)
  const timeSavedMinutes = documentsCreated * 7;
  const timeSavedHours = Math.floor(timeSavedMinutes / 60);
  const remainingMinutes = timeSavedMinutes % 60;
  
  // Mettre à jour le localStorage quand le nombre de documents change
  useEffect(() => {
    localStorage.setItem('documentsCreated', documentsCreated.toString());
  }, [documentsCreated]);

  const quickActions = [
    {
      icon: FiFileText,
      title: 'Nouveau document',
      description: 'Créer un nouveau document à partir d\'un modèle',
      action: () => navigate('/documents/new'),
      color: 'blue',
    },
    {
      icon: FiUserPlus,
      title: 'Nouveau patient',
      description: 'Ajouter un nouveau patient à la base de données',
      action: () => navigate('/patients/new'),
      color: 'green',
    },
    {
      icon: FiCalendar,
      title: 'Prendre RDV',
      description: 'Planifier un nouveau rendez-vous',
      action: () => navigate('/appointments/new'),
      color: 'purple',
    },
  ];

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading size="lg" mb={1}>
            Tableau de bord
          </Heading>
          <Text color="gray.500">
            Bon retour, Dr. Dupont. Voici un aperçu de votre activité.
          </Text>
        </Box>
        <HStack spacing={4}>
          <Button leftIcon={<Icon as={FiPlus} />} colorScheme="blue">
            Nouvelle action
          </Button>
          <IconButton
            icon={<Icon as={FiBell} />}
            aria-label="Notifications"
            variant="ghost"
            position="relative"
          >
            <Box
              position="absolute"
              top={2}
              right={2}
              w={2}
              h={2}
              bg="red.500"
              borderRadius="full"
            />
          </IconButton>
        </HStack>
      </Flex>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card bg="white" borderRadius="lg" boxShadow="sm">
          <CardBody>
            <HStack justify="space-between">
              <Box>
                <Text color="gray.500" fontSize="sm" mb={1}>Patients</Text>
                <Heading size="lg">1,248</Heading>
                <Text color="green.500" fontSize="sm" mt={1}>
                  +12.5% vs mois dernier
                </Text>
              </Box>
              <Box p={3} bg="blue.50" borderRadius="full">
                <Icon as={FiUsers} boxSize={6} color="blue.500" />
              </Box>
            </HStack>
          </CardBody>
        </Card>

        <Card bg="white" borderRadius="lg" boxShadow="sm">
          <CardBody>
            <HStack justify="space-between">
              <Box>
                <Text color="gray.500" fontSize="sm" mb={1}>RDV aujourd'hui</Text>
                <Heading size="lg">8</Heading>
                <Text color="green.500" fontSize="sm" mt={1}>
                  +2 aujourd'hui
                </Text>
              </Box>
              <Box p={3} bg="green.50" borderRadius="full">
                <Icon as={FiCalendar} boxSize={6} color="green.500" />
              </Box>
            </HStack>
          </CardBody>
        </Card>

        <Card bg="white" borderRadius="lg" boxShadow="sm">
          <CardBody>
            <HStack justify="space-between">
              <Box>
                <Text color="gray.500" fontSize="sm" mb={1}>Temps gagné</Text>
                <Heading size="lg">{timeSavedMinutes} min</Heading>
                <Text color="green.500" fontSize="sm" mt={1}>
                  {timeSavedHours > 0 ? `${timeSavedHours}h ${remainingMinutes}min` : `${remainingMinutes}min`} économisées
                </Text>
              </Box>
              <Box p={3} bg="purple.50" borderRadius="full">
                <Icon as={FiClock} boxSize={6} color="purple.500" />
              </Box>
            </HStack>
          </CardBody>
        </Card>

        <Card bg="white" borderRadius="lg" boxShadow="sm">
          <CardBody>
            <HStack justify="space-between">
              <Box>
                <Text color="gray.500" fontSize="sm" mb={1}>Documents traités</Text>
                <Heading size="lg">{documentsCreated}</Heading>
                <Text color="green.500" fontSize="sm" mt={1}>
                  +15% vs mois dernier
                </Text>
              </Box>
              <Box p={3} bg="orange.50" borderRadius="full">
                <Icon as={FiFileText} boxSize={6} color="orange.500" />
              </Box>
            </HStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Charts Row */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        {/* Activity Chart */}
        <Card bg="white" borderRadius="lg" boxShadow="sm">
          <CardBody>
            <HStack justify="space-between" mb={6}>
              <Box>
                <Text fontWeight="600">Activité mensuelle</Text>
                <Text color="gray.500" fontSize="sm">Patients et documents</Text>
              </Box>
              <Select size="sm" maxW="150px" variant="filled">
                <option>Mai 2025</option>
                <option>Avril 2025</option>
                <option>Mars 2025</option>
              </Select>
            </HStack>
            <Box h="250px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="patients" 
                    stroke="#3182CE" 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 6, stroke: '#3182CE', strokeWidth: 2, fill: 'white' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="documents" 
                    stroke="#38B2AC" 
                    strokeWidth={2} 
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={{ r: 6, stroke: '#38B2AC', strokeWidth: 2, fill: 'white' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
            <HStack mt={4} spacing={4}>
              <HStack>
                <Box w={3} h={3} bg="blue.400" borderRadius="sm" />
                <Text fontSize="sm" color="gray.600">Patients</Text>
              </HStack>
              <HStack>
                <Box w={3} h={3} bg="teal.400" borderRadius="sm" />
                <Text fontSize="sm" color="gray.600">Documents</Text>
              </HStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Document Types Chart */}
        <Card bg="white" borderRadius="lg" boxShadow="sm">
          <CardBody>
            <HStack justify="space-between" mb={6}>
              <Box>
                <Text fontWeight="600">Types de documents</Text>
                <Text color="gray.500" fontSize="sm">Répartition des documents</Text>
              </Box>
              <Button 
                rightIcon={<Icon as={FiDownload} />} 
                size="sm" 
                variant="ghost"
              >
                Exporter
              </Button>
            </HStack>
            <Box h="250px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={documentTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {documentTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <SimpleGrid columns={2} spacing={4} mt={6}>
              {documentTypes.map((doc, index) => (
                <HStack key={index} spacing={3}>
                  <Box w={3} h={3} bg={doc.color} borderRadius="sm" />
                  <Box>
                    <Text fontSize="sm" fontWeight="500">{doc.name}</Text>
                    <Text fontSize="sm" color="gray.500">{doc.value}%</Text>
                  </Box>
                </HStack>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Quick Actions */}
      <Box mb={8}>
        <Text fontSize="lg" fontWeight="600" mb={4}>
          Actions rapides
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              p={6}
              h="auto"
              textAlign="left"
              onClick={action.action}
              borderColor="gray.200"
              _hover={{ bg: `${action.color}.50`, borderColor: `${action.color}.200` }}
            >
              <HStack spacing={4} w="100%">
                <Box
                  p={2}
                  bg={`${action.color}.100`}
                  color={`${action.color}.600`}
                  borderRadius="md"
                >
                  <Icon as={action.icon} boxSize={5} />
                </Box>
                <Box flex={1}>
                  <Text fontWeight="600" color="gray.800">
                    {action.title}
                  </Text>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    {action.description}
                  </Text>
                </Box>
              </HStack>
            </Button>
          ))}
        </SimpleGrid>
      </Box>

      {/* Recent Documents */}
      <Card bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden">
        <Box p={6} borderBottomWidth="1px" borderColor="gray.100">
          <HStack justify="space-between">
            <Box>
              <Text fontSize="lg" fontWeight="600" mb={1}>
                Derniers documents créés
              </Text>
              <Text color="gray.500" fontSize="sm">
                {recentDocuments.length} documents récemment créés
              </Text>
            </Box>
            <HStack>
              <Button 
                leftIcon={<Icon as={FiFilter} />} 
                size="sm" 
                variant="outline"
              >
                Filtrer
              </Button>
              <Button 
                leftIcon={<Icon as={FiDownload} />} 
                size="sm" 
                variant="outline"
              >
                Exporter
              </Button>
            </HStack>
          </HStack>
        </Box>
        <Box overflowX="auto">
          <Box as="table" w="full">
            <Box as="thead" bg="gray.50">
              <Box as="tr" h={12}>
                <Box as="th" px={6} textAlign="left" fontWeight="500" color="gray.500" fontSize="sm">
                  Titre
                </Box>
                <Box as="th" px={6} textAlign="left" fontWeight="500" color="gray.500" fontSize="sm">
                  Patient
                </Box>
                <Box as="th" px={6} textAlign="left" fontWeight="500" color="gray.500" fontSize="sm">
                  Date
                </Box>
                <Box as="th" px={6} textAlign="left" fontWeight="500" color="gray.500" fontSize="sm">
                  Type
                </Box>
                <Box as="th" px={6} textAlign="left" fontWeight="500" color="gray.500" fontSize="sm">
                  Taille
                </Box>
                <Box as="th" px={6} textAlign="left" fontWeight="500" color="gray.500" fontSize="sm">
                  Statut
                </Box>
                <Box as="th" px={6} textAlign="right" fontWeight="500" color="gray.500" fontSize="sm">
                  Actions
                </Box>
              </Box>
            </Box>
            <Box as="tbody">
              {recentDocuments.map((doc) => (
                <Box 
                  as="tr" 
                  key={doc.id} 
                  h={16}
                  borderBottomWidth="1px"
                  borderColor="gray.100"
                  _last={{ borderBottomWidth: 0 }}
                  _hover={{ bg: 'gray.50' }}
                >
                  <Box as="td" px={6}>
                    <Text fontWeight="500">{doc.title}</Text>
                  </Box>
                  <Box as="td" px={6}>
                    <Text>{doc.patient}</Text>
                  </Box>
                  <Box as="td" px={6} color="gray.500">
                    {doc.date}
                  </Box>
                  <Box as="td" px={6}>
                    <Badge 
                      colorScheme={
                        doc.type === 'Compte-rendu' ? 'blue' : 
                        doc.type === 'Ordonnance' ? 'green' :
                        doc.type === 'Bilan' ? 'purple' : 'gray'
                      }
                      variant="subtle"
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      {doc.type}
                    </Badge>
                  </Box>
                  <Box as="td" px={6}>
                    <Text color="gray.500">{doc.size}</Text>
                  </Box>
                  <Box as="td" px={6}>
                    <Badge 
                      colorScheme={
                        doc.status === 'Terminé' ? 'green' : 
                        doc.status === 'Envoyé' ? 'blue' :
                        doc.status === 'Brouillon' ? 'yellow' : 'gray'
                      }
                      variant="subtle"
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      {doc.status}
                    </Badge>
                  </Box>
                  <Box as="td" px={6} textAlign="right">
                    <IconButton
                      icon={<Icon as={FiMoreVertical} />}
                      aria-label={`Actions pour le document ${doc.title}`}
                      variant="ghost"
                      size="sm"
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default Dashboard;

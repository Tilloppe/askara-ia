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
  FiDollarSign,
  FiPieChart,
  FiBarChart2,
  FiFilter,
  FiDownload,
  FiMoreVertical
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
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

const recentPatients = [
  { id: 1, name: 'Jean Dupont', lastVisit: 'Aujourd\'hui', status: 'Nouveau', progress: 80 },
  { id: 2, name: 'Marie Martin', lastVisit: 'Hier', status: 'En cours', progress: 45 },
  { id: 3, name: 'Pierre Durand', lastVisit: '23/05/2025', status: 'En attente', progress: 20 },
  { id: 4, name: 'Sophie Petit', lastVisit: '20/05/2025', status: 'Terminé', progress: 100 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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
      title: 'Ajouter un patient',
      description: 'Enregistrer un nouveau patient dans votre base',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nouveau': return 'blue';
      case 'En cours': return 'yellow';
      case 'En attente': return 'orange';
      case 'Terminé': return 'green';
      default: return 'gray';
    }
  };

  return (
    <Box p={{ base: 4, md: 6 }}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading size="lg" mb={1}>Bonjour, Dr. Antoine</Heading>
          <Text color="gray.500">Voici un aperçu de votre activité</Text>
        </Box>
        <HStack spacing={4}>
          <Button leftIcon={<FiPlus />} colorScheme="blue" size="sm">
            Nouveau
          </Button>
          <IconButton
            aria-label="Notifications"
            icon={<FiBell />}
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
                <Text color="gray.500" fontSize="sm" mb={1}>Revenus du mois</Text>
                <Heading size="lg">4,850€</Heading>
                <Text color="green.500" fontSize="sm" mt={1}>
                  +8.2% vs mois dernier
                </Text>
              </Box>
              <Box p={3} bg="purple.50" borderRadius="full">
                <Icon as={FiDollarSign} boxSize={6} color="purple.500" />
              </Box>
            </HStack>
          </CardBody>
        </Card>

        <Card bg="white" borderRadius="lg" boxShadow="sm">
          <CardBody>
            <HStack justify="space-between">
              <Box>
                <Text color="gray.500" fontSize="sm" mb={1}>Documents traités</Text>
                <Heading size="lg">124</Heading>
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
                    stroke="#4299E1" 
                    strokeWidth={2} 
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, stroke: '#3182ce', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="documents" 
                    stroke="#9F7AEA" 
                    strokeWidth={2} 
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, stroke: '#805ad5', strokeWidth: 2 }}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
            <HStack spacing={6} mt={4} justify="center">
              <HStack>
                <Box w={3} h={3} bg="#4299E1" borderRadius="full" />
                <Text fontSize="sm">Patients</Text>
              </HStack>
              <HStack>
                <Box w={3} h={3} bg="#9F7AEA" borderRadius="full" />
                <Text fontSize="sm">Documents</Text>
              </HStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Documents by Type */}
        <Card bg="white" borderRadius="lg" boxShadow="sm">
          <CardBody>
            <HStack justify="space-between" mb={6}>
              <Box>
                <Text fontWeight="600">Répartition des documents</Text>
                <Text color="gray.500" fontSize="sm">Par type de document</Text>
              </Box>
              <Button size="sm" variant="ghost" rightIcon={<FiDownload />}>
                Exporter
              </Button>
            </HStack>
            <HStack spacing={8}>
              <Box w="40%" h="200px">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={documentTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
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
              <VStack align="start" spacing={3} mt={6}>
                {documentTypes.map((doc, index) => (
                  <HStack key={index} w="100%" justify="space-between">
                    <HStack>
                      <Box w={3} h={3} bg={doc.color} borderRadius="sm" />
                      <Text fontSize="sm">{doc.name}</Text>
                    </HStack>
                    <Text fontWeight="600" fontSize="sm">{doc.value}%</Text>
                  </HStack>
                ))}
              </VStack>
            </HStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Recent Patients */}
      <Card bg="white" borderRadius="lg" boxShadow="sm" mb={8}>
        <CardBody>
          <HStack justify="space-between" mb={6}>
            <Box>
              <Text fontWeight="600">Derniers patients</Text>
              <Text color="gray.500" fontSize="sm">Patients récemment ajoutés ou modifiés</Text>
            </Box>
            <Button size="sm" variant="outline" leftIcon={<FiFilter />}>
              Filtrer
            </Button>
          </HStack>
          
          <Box overflowX="auto">
            <Box minW="800px">
              <HStack 
                px={4} 
                py={2} 
                bg="gray.50" 
                borderRadius="md" 
                mb={2}
                fontWeight="500"
                fontSize="sm"
                color="gray.600"
              >
                <Box w="40%">Patient</Box>
                <Box w="20%">Dernière visite</Box>
                <Box w="20%">Statut</Box>
                <Box w="20%">Progression</Box>
              </HStack>
              
              <VStack spacing={3} align="stretch">
                {recentPatients.map((patient) => (
                  <Box 
                    key={patient.id}
                    p={4} 
                    borderWidth="1px" 
                    borderRadius="md"
                    _hover={{ bg: 'gray.50' }}
                    cursor="pointer"
                    onClick={() => navigate(`/patients/${patient.id}`)}
                  >
                    <HStack>
                      <Box w="40%">
                        <HStack>
                          <Avatar size="sm" name={patient.name} mr={2} />
                          <Text fontWeight="500">{patient.name}</Text>
                        </HStack>
                      </Box>
                      <Box w="20%" color="gray.600" fontSize="sm">
                        {patient.lastVisit}
                      </Box>
                      <Box w="20%">
                        <Badge 
                          colorScheme={getStatusColor(patient.status)}
                          variant="subtle"
                          px={2}
                          py={1}
                          borderRadius="full"
                          fontSize="xs"
                        >
                          {patient.status}
                        </Badge>
                      </Box>
                      <Box w="20%">
                        <HStack spacing={2}>
                          <Box flex={1}>
                            <Progress 
                              value={patient.progress} 
                              size="sm" 
                              colorScheme={getStatusColor(patient.status)}
                              borderRadius="full"
                            />
                          </Box>
                          <Text fontSize="sm" color="gray.500" minW="40px">
                            {patient.progress}%
                          </Text>
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          </Box>
          
          <Flex justify="flex-end" mt={4}>
            <Button variant="link" colorScheme="blue" size="sm">
              Voir tous les patients
            </Button>
          </Flex>
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <Box mb={8}>
        <Text fontWeight="600" mb={4}>Actions rapides</Text>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              height="auto"
              p={4}
              borderRadius="lg"
              textAlign="left"
              whiteSpace="normal"
              onClick={action.action}
              _hover={{ bg: `${action.color}.50`, borderColor: `${action.color}.200` }}
            >
              <HStack spacing={3} align="start">
                <Box p={2} bg={`${action.color}.100`} borderRadius="md">
                  <Icon as={action.icon} color={`${action.color}.600`} />
                </Box>
                <Box>
                  <Text fontWeight="500">{action.title}</Text>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    {action.description}
                  </Text>
                </Box>
              </HStack>
            </Button>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Dashboard;

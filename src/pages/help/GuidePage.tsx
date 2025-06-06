import React from 'react';
import { 
  VStack, 
  Heading, 
  Text, 
  Box, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  List, 
  ListItem, 
  ListIcon,
  Link as ChakraLink,
  useColorModeValue,
  Icon,
  Flex
} from '@chakra-ui/react';
import { 
  FaBookOpen, 
  FaUserTie, 
  FaUsers, 
  FaCode, 
  FaMobileAlt,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';
import HelpCategoryLayout from '../../components/help/HelpCategoryLayout';

const GuidePage: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const guides = [
    {
      title: 'Guide de démarrage',
      icon: FaBookOpen,
      description: 'Prenez en main la plateforme en quelques étapes simples',
      steps: [
        'Créer votre premier projet',
        'Importer vos fichiers audio',
        'Configurer les paramètres de base',
        'Partager votre projet avec votre équipe'
      ]
    },
    {
      title: 'Guide administrateur',
      icon: FaUserTie,
      description: 'Gérez les paramètres et les utilisateurs de votre organisation',
      steps: [
        'Configurer les droits utilisateurs',
        'Gérer les abonnements et facturation',
        'Configurer les préférences de sécurité',
        'Exporter les données d\'utilisation'
      ]
    },
    {
      title: 'Guide d\'intégration',
      icon: FaCode,
      description: 'Intégrez nos API dans vos applications existantes',
      steps: [
        'Authentification API',
        'Endpoints disponibles',
        'Gestion des erreurs',
        'Meilleures pratiques de développement'
      ]
    },
    {
      title: 'Guide mobile',
      icon: FaMobileAlt,
      description: 'Utilisez notre application mobile sur iOS et Android',
      steps: [
        'Télécharger et installer l\'app',
        'Se connecter à votre compte',
        'Synchroniser vos projets',
        'Utiliser les fonctionnalités hors ligne'
      ]
    },
    {
      title: 'Guide d\'équipe',
      icon: FaUsers,
      description: 'Collaborez efficacement avec votre équipe',
      steps: [
        'Inviter des membres d\'équipe',
        'Gérer les permissions',
        'Utiliser les commentaires et annotations',
        'Suivre les modifications et versions'
      ]
    }
  ];

  return (
    <HelpCategoryLayout
      title="Guides complets"
      description="Des guides détaillés pour toutes les fonctionnalités"
      icon={<FaBookOpen />}
      colorScheme="green"
    >
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={4}>Sélectionnez un guide</Heading>
          <Text color={useColorModeValue('gray.600', 'gray.300')}>
            Parcourez nos guides complets pour maîtriser toutes les fonctionnalités de notre plateforme.
          </Text>
        </Box>

        <Tabs variant="enclosed" colorScheme="green">
          <TabList overflowX="auto" overflowY="hidden" pb="1">
            {guides.map((guide, index) => (
              <Tab 
                key={index}
                whiteSpace="nowrap"
                _selected={{ 
                  color: 'green.500', 
                  borderColor: 'green.500',
                  borderBottomColor: 'white',
                  mb: '-1px'
                }}
              >
                <Icon as={guide.icon} mr={2} />
                {guide.title}
              </Tab>
            ))}
          </TabList>

          <Box 
            borderWidth="1px" 
            borderTopWidth="0" 
            borderColor={borderColor}
            borderRadius="0 0 8px 8px"
            p={6}
            bg={bgColor}
          >
            <TabPanels>
              {guides.map((guide, index) => (
                <TabPanel key={index} p={0}>
                  <VStack align="stretch" spacing={6}>
                    <Box>
                      <Heading size="md" mb={2}>{guide.title}</Heading>
                      <Text color={useColorModeValue('gray.600', 'gray.300')}>
                        {guide.description}
                      </Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="medium" mb={3}>Étapes principales :</Text>
                      <List spacing={3}>
                        {guide.steps.map((step, stepIndex) => (
                          <ListItem key={stepIndex} display="flex" alignItems="flex-start">
                            <ListIcon as={FaCheckCircle} color="green.500" mt={1} />
                            <Text>{step}</Text>
                          </ListItem>
                        ))}
                      </List>
                    </Box>

                    <ChakraLink 
                      href="#" 
                      color="green.600" 
                      fontWeight="medium"
                      display="inline-flex"
                      alignItems="center"
                      _hover={{ textDecoration: 'none', color: 'green.700' }}
                    >
                      Voir le guide complet <Icon as={FaArrowRight} ml={2} />
                    </ChakraLink>
                  </VStack>
                </TabPanel>
              ))}
            </TabPanels>
          </Box>
        </Tabs>

        <Box 
          bg={useColorModeValue('green.50', 'green.900')} 
          p={6} 
          borderRadius="lg"
          borderLeft="4px solid"
          borderColor="green.500"
        >
          <Flex direction={{ base: 'column', md: 'row' }} align="center">
            <Box flex={1} mb={{ base: 4, md: 0 }}>
              <Heading size="md" mb={2} color={useColorModeValue('green.800', 'white')}>
                Vous ne trouvez pas ce que vous cherchez ?
              </Heading>
              <Text color={useColorModeValue('green.700', 'green.200')}>
                Notre équipe de support est là pour vous aider à résoudre votre problème.
              </Text>
            </Box>
            <ChakraLink
              href="/help/support"
              bg="green.600"
              color="white"
              px={6}
              py={3}
              borderRadius="md"
              fontWeight="medium"
              _hover={{
                bg: 'green.700',
                textDecoration: 'none',
                transform: 'translateY(-2px)',
                boxShadow: 'md'
              }}
              transition="all 0.2s"
              display="inline-flex"
              alignItems="center"
            >
              Contacter le support
            </ChakraLink>
          </Flex>
        </Box>
      </VStack>
    </HelpCategoryLayout>
  );
};

export default GuidePage;

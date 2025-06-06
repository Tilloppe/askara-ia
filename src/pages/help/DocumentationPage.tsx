import React from 'react';
import { 
  VStack, 
  Heading, 
  Text, 
  Box, 
  List, 
  ListItem, 
  ListIcon, 
  Link as ChakraLink,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  DownloadIcon, 
  SettingsIcon, 
  ViewIcon,
  InfoIcon,
  EditIcon,
  ChatIcon,
  ExternalLinkIcon
} from '@chakra-ui/icons';
import HelpCategoryLayout from '../../components/help/HelpCategoryLayout';

const DocumentationPage: React.FC = () => {
  const iconColor = useColorModeValue('blue.500', 'blue.300');
  const linkColor = useColorModeValue('blue.600', 'blue.200');
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('blue.200', 'blue.700');
  const textColor = useColorModeValue('blue.800', 'blue.100');

  return (
    <HelpCategoryLayout
      title="Documentation"
      description="Toutes les ressources pour bien démarrer et maîtriser notre plateforme"
      icon={<ViewIcon />}
      colorScheme="blue"
    >
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={4}>Bienvenue dans la documentation</Heading>
          <Text mb={4}>
            Notre documentation complète vous guide à travers toutes les fonctionnalités de notre plateforme.
            Découvrez comment tirer le meilleur parti de nos outils pour votre flux de travail audio.
          </Text>
        </Box>

        <Box>
          <Heading size="md" mb={4} color={linkColor}>Guides de démarrage rapide</Heading>
          <List spacing={3}>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={EditIcon} color={iconColor} />
              <ChakraLink href="#" color={linkColor} _hover={{ textDecoration: 'underline' }}>
                Premiers pas avec Askara Audio
              </ChakraLink>
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={DownloadIcon} color={iconColor} />
              <ChakraLink href="#" color={linkColor} _hover={{ textDecoration: 'underline' }}>
                Installation et configuration
              </ChakraLink>
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={SettingsIcon} color={iconColor} />
              <ChakraLink href="#" color={linkColor} _hover={{ textDecoration: 'underline' }}>
                Configuration des paramètres
              </ChakraLink>
            </ListItem>
          </List>
        </Box>

        <Box>
          <Heading size="md" mb={4} color={linkColor}>Guides avancés</Heading>
          <List spacing={3}>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={ExternalLinkIcon} color={iconColor} />
              <ChakraLink href="#" color={linkColor} _hover={{ textDecoration: 'underline' }}>
                API et intégration
              </ChakraLink>
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={ChatIcon} color={iconColor} />
              <ChakraLink href="#" color={linkColor} _hover={{ textDecoration: 'underline' }}>
                Gestion des utilisateurs et des équipes
              </ChakraLink>
            </ListItem>
          </List>
        </Box>

        <Box bg={bgColor} p={4} borderRadius="md" borderLeft="4px solid" borderColor={borderColor}>
          <Heading size="sm" mb={2} color={textColor} display="flex" alignItems="center">
            <InfoIcon style={{ marginRight: '8px' }} />
            Conseil
          </Heading>
          <Text color={textColor}>
            Consultez nos tutoriels vidéo pour une démonstration visuelle de nos fonctionnalités.
          </Text>
        </Box>
      </VStack>
    </HelpCategoryLayout>
  );
};

export default DocumentationPage;

import React from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Button,
  Input,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';

// Import des icônes
import { 
  FaQuestionCircle, 
  FaBook, 
  FaVideo, 
  FaEnvelope, 
  FaUsers, 
  FaSearch
} from 'react-icons/fa';

import { Link as RouterLink } from 'react-router-dom';
import PopularArticles from '../components/help/PopularArticles';

interface HelpCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  color: string;
}

const HelpCard: React.FC<HelpCardProps> = ({ 
  icon, 
  title, 
  description, 
  link, 
  color 
}) => {
  const iconColor = useColorModeValue(`${color}.500`, `${color}.300`);
  
  return (
    <Box
      as={RouterLink}
      to={link}
      bg={useColorModeValue('white', 'gray.800')}
      p={6}
      rounded="xl"
      shadow="md"
      borderLeft="4px solid"
      borderColor={`${color}.400`}
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'lg',
        textDecoration: 'none',
      }}
      transition="all 0.2s"
      height="100%"
    >
      <Flex align="center" mb={4}>
        <Box 
          as="span"
          color={iconColor}
          boxSize={6}
          mr={3}
          display="inline-flex"
          alignItems="center"
        >
          {icon}
        </Box>
        <Heading size="md">{title}</Heading>
      </Flex>
      <Text color={useColorModeValue('gray.600', 'gray.400')}>
        {description}
      </Text>
    </Box>
  );
};

const HelpCenterPage = () => {
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.50, purple.50)',
    'linear(to-r, gray.900, gray.800)'
  );

  const helpSections = [
    {
      title: 'Documentation complète',
      description: 'Explorez notre documentation complète pour maîtriser toutes les fonctionnalités',
      icon: <FaBook size={20} />,
      link: '/documentation',
      color: 'blue'
    },
    {
      title: 'FAQ',
      description: 'Trouvez des réponses aux questions les plus fréquemment posées',
      icon: <FaQuestionCircle size={20} />,
      link: '/help/faq',
      color: 'green'
    },
    {
      title: 'Tutoriels vidéo',
      description: 'Apprenez à utiliser Askara Audio IA avec nos tutoriels vidéo',
      icon: <FaVideo size={20} />,
      link: '/help/videos',
      color: 'red'
    },
    {
      title: 'Support technique',
      description: 'Contactez notre équipe de support pour une assistance personnalisée',
      icon: <FaEnvelope size={20} />,
      link: '/help/support',
      color: 'green'
    },
    {
      title: 'Communauté',
      description: 'Rejoignez notre communauté pour échanger avec d\'autres utilisateurs',
      icon: <FaUsers size={20} />,
      link: '/community',
      color: 'orange'
    },
    {
      title: 'Mises à jour',
      description: 'Découvrez les dernières nouveautés et améliorations',
      icon: <FaBook size={20} />,
      link: '/updates',
      color: 'teal'
    }
  ];

  const popularArticles = [
    { title: 'Comment créer un nouveau document', category: 'Documentation', views: 1245 },
    { title: 'Résolution des problèmes audio', category: 'Dépannage', views: 987 },
    { title: 'Personnalisation des modèles', category: 'Astuces', views: 876 },
    { title: 'Intégration avec les logiciels tiers', category: 'Guide', views: 765 },
  ];

  return (
    <Box minH="calc(100vh - 64px)" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Hero Section */}
      <Box 
        bgGradient={bgGradient}
        py={16}
        borderBottomWidth="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Container maxW="6xl">
          <VStack spacing={6} textAlign="center" color={useColorModeValue('gray.800', 'white')}>
            <Heading as="h1" size="2xl" maxW="2xl" lineHeight="1.2">
              Comment pouvons-nous vous aider ?
            </Heading>
            <Text fontSize="xl" maxW="2xl" color={useColorModeValue('gray.600', 'gray.300')}>
              Trouvez des réponses à vos questions ou contactez notre équipe de support.
            </Text>
            
            {/* Barre de recherche */}
            <Box w="full" maxW="2xl" mt={4}>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <Box as="span" color="gray.400">
                    <FaSearch size={16} />
                  </Box>
                </InputLeftElement>
                <Input 
                  type="text" 
                  placeholder="Rechercher dans l'aide..." 
                  bg="white"
                  rounded="full"
                  _focus={{
                    borderColor: 'blue.400',
                    boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
                  }}
                />
              </InputGroup>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Contenu principal */}
      <Container maxW="6xl" py={12}>
        <VStack spacing={12} align="stretch">
          {/* Sections d'aide */}
          <Box>
            <Heading size="lg" mb={6} color={useColorModeValue('gray.800', 'white')}>
              Ressources d'aide
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {helpSections.map((section, index) => (
                <HelpCard
                  key={index}
                  icon={section.icon}
                  title={section.title}
                  description={section.description}
                  link={section.link}
                  color={section.color}
                />
              ))}
            </SimpleGrid>
          </Box>

          <Box mt={12}>
            <PopularArticles />
          </Box>

          {/* Contact Support */}
          <Box 
            bg={useColorModeValue('white', 'gray.800')} 
            p={8} 
            rounded="xl"
            shadow="md"
            borderLeft="4px solid"
            borderColor="blue.400"
          >
            <Flex direction={{ base: 'column', md: 'row' }} alignItems="center">
              <Box flex={1} mb={{ base: 4, md: 0 }}>
                <Heading size="md" mb={2} color={useColorModeValue('gray.800', 'white')}>
                  Vous ne trouvez pas ce que vous cherchez ?
                </Heading>
                <Text color={useColorModeValue('gray.600', 'gray.400')}>
                  Notre équipe de support est là pour vous aider. Contactez-nous et nous vous répondrons dans les plus brefs délais.
                </Text>
              </Box>
              <Button 
                as={RouterLink}
                to="/help/support"
                colorScheme="blue"
                size="lg"
                leftIcon={<Box as="span"><FaEnvelope size={16} /></Box>}
              >
                Contacter le support
              </Button>
            </Flex>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default HelpCenterPage;

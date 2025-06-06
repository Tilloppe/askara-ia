import React from 'react';
import {
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Box,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Input,
  Badge,
  HStack,
  Icon,
  Flex,
  AspectRatio
} from '@chakra-ui/react';
import { FaSearch, FaPlay, FaClock, FaBookmark } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import HelpLayout from '../../components/help/HelpLayout';

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  thumbnail: string;
  isNew?: boolean;
  isPopular?: boolean;
}

const VideosPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const categories = [
    { id: 'getting-started', label: 'Pour commencer' },
    { id: 'features', label: 'Fonctionnalités' },
    { id: 'tips', label: 'Astuces et bonnes pratiques' },
    { id: 'updates', label: 'Nouveautés' },
  ];

  // Données de démonstration pour les tutoriels vidéo
  const videoTutorials: VideoTutorial[] = [
    {
      id: '1',
      title: 'Bienvenue sur Askara Audio IA',
      description: 'Découvrez comment prendre en main la plateforme Askara Audio IA en quelques minutes.',
      duration: '4:32',
      category: 'getting-started',
      thumbnail: 'https://via.placeholder.com/400x225/4A90E2/FFFFFF?text=Askara+Audio+IA',
      isNew: true
    },
    {
      id: '2',
      title: 'Créer votre premier document',
      description: 'Apprenez à créer et personnaliser votre premier document audio avec notre éditeur intuitif.',
      duration: '7:15',
      category: 'getting-started',
      thumbnail: 'https://via.placeholder.com/400x225/50E3C2/FFFFFF?text=Créer+un+document',
      isPopular: true
    },
    {
      id: '3',
      title: 'Utilisation des modèles avancés',
      description: 'Maîtrisez l\'utilisation des modèles avancés pour des résultats encore plus précis.',
      duration: '9:45',
      category: 'features',
      thumbnail: 'https://via.placeholder.com/400x225/9013FE/FFFFFF?text=Modèles+avancés'
    },
    {
      id: '4',
      title: 'Partage et collaboration',
      description: 'Découvrez comment partager vos documents et collaborer en temps réel avec votre équipe.',
      duration: '5:20',
      category: 'features',
      thumbnail: 'https://via.placeholder.com/400x225/F5A623/FFFFFF?text=Partage',
      isNew: true
    },
    {
      id: '5',
      title: 'Optimisation de la qualité audio',
      description: 'Conseils et astuces pour obtenir la meilleure qualité audio possible avec votre matériel.',
      duration: '11:30',
      category: 'tips',
      thumbnail: 'https://via.placeholder.com/400x225/F8E71C/000000?text=Qualité+audio',
      isPopular: true
    },
    {
      id: '6',
      title: 'Nouvelles fonctionnalités - Juin 2025',
      description: 'Découvrez toutes les nouvelles fonctionnalités ajoutées dans notre dernière mise à jour.',
      duration: '6:50',
      category: 'updates',
      thumbnail: 'https://via.placeholder.com/400x225/7ED321/FFFFFF?text=Nouveautés',
      isNew: true
    },
  ];

  const filteredVideos = videoTutorials.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.label : categoryId;
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <HelpLayout
      title="Tutoriels vidéo"
      description="Apprenez à utiliser Askara Audio IA avec nos tutoriels vidéo"
      breadcrumbItems={[
        { label: 'Tutoriels vidéo', href: '/help/videos', isCurrentPage: true }
      ]}
    >
      <VStack spacing={8} align="stretch">
        {/* En-tête et recherche */}
        <Box>
          <VStack spacing={4} align="stretch">
            <Box>
              <Heading size="lg" mb={2}>Tutoriels vidéo</Heading>
              <Text color={useColorModeValue('gray.600', 'gray.300')}>
                Apprenez à utiliser toutes les fonctionnalités d'Askara Audio IA grâce à nos tutoriels vidéo.
              </Text>
            </Box>
            
            <InputGroup size="lg" maxW="xl">
              <InputLeftElement pointerEvents="none">
                <FaSearch color="gray.300" />
              </InputLeftElement>
              <Input 
                placeholder="Rechercher des tutoriels..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg={bgColor}
                borderColor={borderColor}
                _hover={{ borderColor: 'gray.300' }}
              />
            </InputGroup>
          </VStack>
        </Box>

        {/* Filtres par catégorie */}
        <Box>
          <HStack spacing={2} flexWrap="wrap">
            <Box 
              as="button"
              px={4}
              py={2}
              borderRadius="full"
              bg={!selectedCategory ? 'blue.500' : 'transparent'}
              color={!selectedCategory ? 'white' : 'currentColor'}
              borderWidth="1px"
              borderColor={!selectedCategory ? 'blue.500' : borderColor}
              _hover={{
                bg: !selectedCategory ? 'blue.600' : hoverBg,
                borderColor: !selectedCategory ? 'blue.600' : undefined
              }}
              onClick={() => setSelectedCategory(null)}
            >
              Tous
            </Box>
            {categories.map(category => (
              <Box 
                key={category.id}
                as="button"
                px={4}
                py={2}
                borderRadius="full"
                bg={selectedCategory === category.id ? 'blue.500' : 'transparent'}
                color={selectedCategory === category.id ? 'white' : 'currentColor'}
                borderWidth="1px"
                borderColor={selectedCategory === category.id ? 'blue.500' : borderColor}
                _hover={{
                  bg: selectedCategory === category.id ? 'blue.600' : hoverBg,
                  borderColor: selectedCategory === category.id ? 'blue.600' : undefined
                }}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </Box>
            ))}
          </HStack>
        </Box>

        {/* Liste des vidéos */}
        {filteredVideos.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredVideos.map((video) => (
              <Box 
                key={video.id}
                as={RouterLink}
                to={`/help/videos/${video.id}`}
                bg={bgColor}
                borderRadius="lg"
                overflow="hidden"
                borderWidth="1px"
                borderColor={borderColor}
                _hover={{
                  transform: 'translateY(-4px)',
                  shadow: 'lg',
                  textDecoration: 'none',
                }}
                transition="all 0.2s"
                position="relative"
              >
                {/* Badges */}
                <HStack position="absolute" top={3} left={3} zIndex={1} spacing={2}>
                  {video.isNew && (
                    <Badge colorScheme="green" variant="solid">
                      Nouveau
                    </Badge>
                  )}
                  {video.isPopular && (
                    <Badge colorScheme="orange" variant="solid">
                      Populaire
                    </Badge>
                  )}
                </HStack>
                
                {/* Miniature de la vidéo avec bouton de lecture */}
                <Box position="relative">
                  <AspectRatio ratio={16/9}>
                    <Box
                      bgImage={`url(${video.thumbnail})`}
                      bgSize="cover"
                      bgPosition="center"
                    >
                      <Flex
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        bg="blackAlpha.500"
                        alignItems="center"
                        justifyContent="center"
                        opacity={0.7}
                        _hover={{
                          opacity: 0.9
                        }}
                        transition="opacity 0.2s"
                      >
                        <Icon as={FaPlay} boxSize={8} color="white" />
                      </Flex>
                    </Box>
                  </AspectRatio>
                </Box>

                {/* Durée */}
                <Box 
                  position="absolute" 
                  bottom="120px" 
                  right={3} 
                  bg="blackAlpha.800" 
                  color="white" 
                  px={2} 
                  py={1} 
                  borderRadius="md"
                  fontSize="sm"
                >
                  {video.duration}
                </Box>

                <Box p={5}>
                  <HStack spacing={2} mb={2}>
                    <Badge colorScheme="blue" variant="subtle">
                      {getCategoryLabel(video.category)}
                    </Badge>
                    <HStack spacing={1} color={useColorModeValue('gray.500', 'gray.400')}>
                      <Icon as={FaClock} boxSize={3} />
                      <Text fontSize="sm">{video.duration}</Text>
                    </HStack>
                  </HStack>
                  <Heading size="md" mb={2} noOfLines={2}>
                    {video.title}
                  </Heading>
                  <Text 
                    color={useColorModeValue('gray.600', 'gray.300')}
                    noOfLines={2}
                    fontSize="sm"
                  >
                    {video.description}
                  </Text>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Box 
            textAlign="center" 
            py={12} 
            bg={bgColor} 
            borderRadius="lg"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Icon as={FaBookmark} boxSize={8} color="gray.400" mb={4} />
            <Heading size="md" mb={2}>Aucun tutoriel trouvé</Heading>
            <Text color={useColorModeValue('gray.600', 'gray.300')} maxW="md" mx="auto">
              Aucun tutoriel ne correspond à votre recherche. Essayez d'autres termes ou catégories.
            </Text>
          </Box>
        )}

        {/* Section de ressources supplémentaires */}
        <Box 
          bg={useColorModeValue('blue.50', 'blue.900')} 
          p={8} 
          borderRadius="lg"
          mt={8}
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <Box>
              <Heading size="md" mb={4}>Vous ne trouvez pas ce que vous cherchez ?</Heading>
              <Text mb={4}>
                Consultez notre FAQ complète ou contactez notre équipe de support pour une assistance personnalisée.
              </Text>
              <HStack spacing={4}>
                <Button as={RouterLink} to="/help/faq" variant="outline" colorScheme="blue">
                  Voir la FAQ
                </Button>
                <Button as={RouterLink} to="/help/support" colorScheme="blue">
                  Contacter le support
                </Button>
              </HStack>
            </Box>
            <Box>
              <Heading size="md" mb={4}>Documentation complète</Heading>
              <Text mb={4}>
                Accédez à notre documentation technique détaillée pour des informations approfondies sur toutes les fonctionnalités.
              </Text>
              <Button as={RouterLink} to="/documentation" variant="outline" colorScheme="blue">
                Voir la documentation
              </Button>
            </Box>
          </SimpleGrid>
        </Box>
      </VStack>
    </HelpLayout>
  );
};

export default VideosPage;

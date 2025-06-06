import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  HStack,
  Avatar,
  Badge,
  IconButton,
  Textarea,
  Divider,
  Flex,
  Tag,
  TagLabel,
  TagLeftIcon
} from '@chakra-ui/react';
import { 
  FaSearch, 
  FaRegComment, 
  FaRegThumbsUp, 
  FaRegBookmark, 
  FaRegShareSquare,
  FaUserPlus,
  FaHashtag,
  FaFire,
  FaRegClock,
  FaRegStar,
  FaRegCheckCircle,
  FaRegLightbulb
} from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import HelpLayout from '../components/help/HelpLayout';

// Types
interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  date: string;
  likes: number;
  comments: number;
  tags: string[];
  isPinned?: boolean;
  isFeatured?: boolean;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  postCount: number;
}

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [newPost, setNewPost] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedText = useColorModeValue('gray.600', 'gray.400');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // Données de démonstration
  const topics: Topic[] = [
    {
      id: 'general',
      title: 'Général',
      description: 'Discussions générales sur Askara Audio IA',
      icon: FaRegComment,
      color: 'blue',
      postCount: 1245
    },
    {
      id: 'tips',
      title: 'Astuces et conseils',
      description: 'Partagez vos meilleures astuces pour utiliser Askara',
      icon: FaRegLightbulb,
      color: 'green',
      postCount: 876
    },
    {
      id: 'feedback',
      title: 'Suggestions',
      description: 'Proposez des idées pour améliorer Askara',
      icon: FaRegStar,
      color: 'purple',
      postCount: 543
    },
    {
      id: 'updates',
      title: 'Annonces',
      description: 'Nouveautés et mises à jour',
      icon: FaRegCheckCircle,
      color: 'orange',
      postCount: 98
    },
    {
      id: 'troubleshooting',
      title: 'Aide et dépannage',
      description: 'Obtenez de l\'aide pour résoudre les problèmes',
      icon: FaRegClock,
      color: 'red',
      postCount: 321
    },
    {
      id: 'showcase',
      title: 'Réalisations',
      description: 'Partagez vos créations et succès',
      icon: FaFire,
      color: 'pink',
      postCount: 432
    }
  ];

  const posts: Post[] = [
    {
      id: '1',
      title: 'Comment optimiser la reconnaissance vocale pour les termes médicaux ?',
      content: 'Je partage ma technique pour améliorer la précision de la reconnaissance vocale sur les termes médicaux complexes...',
      author: {
        name: 'Dr. Sophie Martin',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        role: 'Médecin généraliste'
      },
      date: 'Il y a 2 heures',
      likes: 24,
      comments: 8,
      tags: ['astuce', 'reconnaissance vocale', 'médical'],
      isPinned: true,
      isFeatured: true
    },
    {
      id: '2',
      title: 'Nouvelle fonctionnalité demandée : Modèles personnalisables',
      content: 'Je pense qu\'il serait très utile de pouvoir créer nos propres modèles de documents personnalisés. Qui est partant ?',
      author: {
        name: 'Dr. Thomas Leroy',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        role: 'Kinésithérapeute'
      },
      date: 'Il y a 5 heures',
      likes: 42,
      comments: 15,
      tags: ['suggestion', 'fonctionnalité'],
      isFeatured: true
    },
    {
      id: '3',
      title: 'Problème avec l\'export PDF',
      content: 'Quelqu\'un a-t-il déjà eu un problème avec l\'export PDF qui coupe le bas de page ?',
      author: {
        name: 'Dr. Amélie Dubois',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        role: 'Dentiste'
      },
      date: 'Hier',
      likes: 7,
      comments: 3,
      tags: ['bug', 'aide']
    }
  ];

  const filteredTopics = topics.filter(topic => 
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <HelpLayout
      title="Communauté Askara"
      description="Rejoignez notre communauté d'utilisateurs"
      breadcrumbItems={[
        { label: 'Communauté', href: '/community', isCurrentPage: true }
      ]}
    >
      <Tabs 
        variant="soft-rounded" 
        colorScheme="blue"
        index={activeTab}
        onChange={(index) => setActiveTab(index)}
        isLazy
      >
        <TabList mb={6} overflowX="auto" pb={2}>
          <Tab>Découvrir</Tab>
          <Tab>Discussions récentes</Tab>
          <Tab>Populaires</Tab>
          <Tab>Non lues</Tab>
        </TabList>

        <TabPanels>
          {/* Onglet Découvrir */}
          <TabPanel p={0}>
            <VStack spacing={8} align="stretch">
              {/* Barre de recherche */}
              <Box>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none">
                    <FaSearch color="gray.300" />
                  </InputLeftElement>
                  <Input 
                    placeholder="Rechercher des sujets ou des discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    bg={bgColor}
                    borderColor={borderColor}
                    _hover={{ borderColor: 'gray.300' }}
                  />
                </InputGroup>
              </Box>

              {/* Nouveau post */}
              <Box 
                bg={bgColor} 
                p={6} 
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <HStack spacing={4} align="flex-start">
                  <Avatar size="md" name="Vous" src="" />
                  <Box flex={1}>
                    <Textarea
                      placeholder="Partagez quelque chose avec la communauté..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      borderColor={borderColor}
                      _hover={{ borderColor: 'gray.300' }}
                      minH="100px"
                      mb={4}
                    />
                    <Flex justify="space-between" align="center">
                      <HStack spacing={2}>
                        <Button size="sm" variant="outline" leftIcon={<FaRegComment />}>
                          Discussion
                        </Button>
                        <Button size="sm" variant="outline" leftIcon={<FaRegLightbulb />}>
                          Astuce
                        </Button>
                        <Button size="sm" variant="outline" leftIcon={<FaRegStar />}>
                          Suggestion
                        </Button>
                      </HStack>
                      <Button 
                        colorScheme="blue" 
                        isDisabled={!newPost.trim()}
                        onClick={() => {
                          // Logique de publication
                          setNewPost('');
                        }}
                      >
                        Publier
                      </Button>
                    </Flex>
                  </Box>
                </HStack>
              </Box>

              {/* Sujets populaires */}
              <Box>
                <Heading size="md" mb={4}>Parcourir par catégorie</Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  {filteredTopics.map((topic) => {
                    const Icon = topic.icon;
                    return (
                      <Box
                        key={topic.id}
                        as={RouterLink}
                        to={`/community/topics/${topic.id}`}
                        bg={bgColor}
                        p={5}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: 'md',
                          textDecoration: 'none',
                        }}
                        transition="all 0.2s"
                      >
                        <HStack spacing={3} mb={3}>
                          <Box
                            p={2}
                            bg={`${topic.color}.100`}
                            color={`${topic.color}.600`}
                            borderRadius="md"
                          >
                            <Icon size={20} />
                          </Box>
                          <Text fontWeight="bold" fontSize="lg">{topic.title}</Text>
                        </HStack>
                        <Text color={mutedText} fontSize="sm" mb={3} noOfLines={2}>
                          {topic.description}
                        </Text>
                        <Text color={mutedText} fontSize="xs">
                          {topic.postCount.toLocaleString()} discussions
                        </Text>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              </Box>
            </VStack>
          </TabPanel>

          {/* Onglet Discussions récentes */}
          <TabPanel p={0}>
            <VStack spacing={6} align="stretch">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Box 
                    key={post.id}
                    as={RouterLink}
                    to={`/community/posts/${post.id}`}
                    bg={bgColor}
                    p={6}
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                      textDecoration: 'none',
                    }}
                    transition="all 0.2s"
                    position="relative"
                  >
                    {post.isPinned && (
                      <Badge 
                        colorScheme="yellow" 
                        variant="solid" 
                        position="absolute" 
                        top={4} 
                        right={4}
                      >
                        Épinglé
                      </Badge>
                    )}
                    
                    <HStack spacing={4} align="flex-start">
                      <Avatar 
                        name={post.author.name} 
                        src={post.author.avatar} 
                        size="md"
                      />
                      <Box flex={1}>
                        <HStack spacing={2} mb={2}>
                          <Text fontWeight="bold">{post.author.name}</Text>
                          <Text color={mutedText} fontSize="sm">•</Text>
                          <Text color={mutedText} fontSize="sm">{post.date}</Text>
                          {post.author.role && (
                            <>
                              <Text color={mutedText} fontSize="sm">•</Text>
                              <Text color={mutedText} fontSize="sm">{post.author.role}</Text>
                            </>
                          )}
                        </HStack>
                        <Heading size="md" mb={2} color={useColorModeValue('gray.800', 'white')}>
                          {post.title}
                        </Heading>
                        <Text mb={3} noOfLines={2} color={mutedText}>
                          {post.content}
                        </Text>
                        <HStack spacing={4}>
                          <HStack spacing={1} color={mutedText}>
                            <FaRegThumbsUp />
                            <Text fontSize="sm">{post.likes}</Text>
                          </HStack>
                          <HStack spacing={1} color={mutedText}>
                            <FaRegComment />
                            <Text fontSize="sm">{post.comments} commentaires</Text>
                          </HStack>
                          <HStack spacing={2} ml="auto">
                            {post.tags.map((tag, index) => (
                              <Tag 
                                key={index} 
                                size="sm" 
                                variant="subtle" 
                                colorScheme="blue"
                                borderRadius="full"
                              >
                                <TagLeftIcon as={FaHashtag} />
                                <TagLabel>{tag}</TagLabel>
                              </Tag>
                            ))}
                          </HStack>
                        </HStack>
                      </Box>
                    </HStack>
                  </Box>
                ))
              ) : (
                <Box 
                  textAlign="center" 
                  py={12} 
                  bg={bgColor}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Text fontSize="lg" color={mutedText}>
                    Aucune discussion trouvée. Essayez une autre recherche ou créez un nouveau sujet !
                  </Text>
                </Box>
              )}
            </VStack>
          </TabPanel>

          {/* Onglets vides pour l'exemple */}
          <TabPanel p={0}>
            <Box 
              bg={bgColor} 
              p={8} 
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              textAlign="center"
            >
              <Heading size="md" mb={4}>Contenu populaire</Heading>
              <Text color={mutedText}>
                Les publications les plus populaires apparaîtront ici.
              </Text>
            </Box>
          </TabPanel>
          <TabPanel p={0}>
            <Box 
              bg={bgColor} 
              p={8} 
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              textAlign="center"
            >
              <Heading size="md" mb={4}>Discussions non lues</Heading>
              <Text color={mutedText}>
                Vos discussions non lues apparaîtront ici.
              </Text>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </HelpLayout>
  );
};

export default CommunityPage;

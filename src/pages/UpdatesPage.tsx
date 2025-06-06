import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  HStack,
  Badge,
  Flex,
  Avatar,
  Link as ChakraLink,
  Tag,
  TagLabel
} from '@chakra-ui/react';

// Import des icônes utilisées dans le composant
import { 
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaTag,
  FaRocket,
  FaBug,
  FaTools,
  FaBullhorn,
  FaInfoCircle
} from 'react-icons/fa';

// Fonction pour obtenir l'icône en fonction du type de mise à jour
const getUpdateIcon = (type: UpdateType) => {
  const iconStyle = { width: '16px', height: '16px' };
  
  switch (type) {
    case 'feature':
      return <FaRocket style={iconStyle} />;
    case 'bugfix':
      return <FaBug style={iconStyle} />;
    case 'improvement':
      return <FaTools style={iconStyle} />;
    case 'announcement':
      return <FaBullhorn style={iconStyle} />;
    default:
      return <FaInfoCircle style={iconStyle} />;
  }
};

import { Link as RouterLink } from 'react-router-dom';
import HelpLayout from '../components/help/HelpLayout';

// Types
type UpdateType = 'feature' | 'improvement' | 'bugfix' | 'announcement';

interface Update {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: UpdateType;
  version: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  details?: string[];
  relatedLink?: string;
  isNew?: boolean;
  tags?: string[];
}

const UpdatesPage: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedText = useColorModeValue('gray.600', 'gray.400');
  // Suppression de la variable non utilisée

  // Fonction pour formater la date
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };


  // Fonction pour obtenir la couleur en fonction du type de mise à jour
  const getUpdateColor = (type: UpdateType): string => {
    switch (type) {
      case 'feature':
        return 'green';
      case 'improvement':
        return 'blue';
      case 'bugfix':
        return 'red';
      case 'announcement':
        return 'purple';
      default:
        return 'gray';
    }
  };

  // Fonction pour obtenir le libellé en fonction du type de mise à jour
  const getUpdateLabel = (type: UpdateType): string => {
    switch (type) {
      case 'feature':
        return 'Nouvelle fonctionnalité';
      case 'improvement':
        return 'Amélioration';
      case 'bugfix':
        return 'Correction de bug';
      case 'announcement':
        return 'Annonce';
      default:
        return 'Mise à jour';
    }
  };

  // Données des mises à jour
  const updates: Update[] = [
    {
      id: '1',
      title: 'Nouveau module de synthèse vocale',
      description: "Découvrez notre nouveau moteur de synthèse vocale plus naturel et expressif.",
      date: new Date('2025-05-15'),
      type: 'feature',
      version: '2.1.0',
      author: {
        name: 'Équipe Askara',
        role: 'Développement',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
      },
      details: [
        'Nouveaux modèles vocaux haute fidélité',
        'Support des émotions vocales',
        'Vitesse de lecture ajustable',
        'Prévisualisation en temps réel'
      ],
      relatedLink: '/documentation/synthese-vocale',
      isNew: true,
      tags: ['voix', 'accessibilité', 'nouveauté']
    },
    {
      id: '2',
      title: 'Amélioration des temps de chargement',
      description: "Optimisation des performances pour un chargement plus rapide.",
      date: new Date('2025-05-10'),
      type: 'improvement',
      version: '2.0.3',
      author: {
        name: 'Jean Dupont',
        role: 'Ingénieur performance',
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
      },
      details: [
        'Optimisation des requêtes API',
        'Mise en cache améliorée',
        'Réduction de la taille des ressources'
      ]
    },
    {
      id: '3',
      title: 'Correction des problèmes de sauvegarde automatique',
      description: "Résolution d'un problème qui empêchait la sauvegarde automatique dans certains navigateurs.",
      date: new Date('2025-05-05'),
      type: 'bugfix',
      version: '2.0.2',
      author: {
        name: 'Sophie Martin',
        role: 'Développeuse frontend',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
      },
      details: [
        'Correction du système de sauvegarde automatique',
        'Amélioration de la gestion des erreurs',
        'Meilleurs messages pour l\'utilisateur'
      ]
    },
    {
      id: '4',
      title: 'Nouveau plan gratuit',
      description: "Nouveau plan gratuit avec des fonctionnalités étendues disponibles !",
      date: new Date('2025-04-28'),
      type: 'announcement',
      version: '2.0.0',
      author: {
        name: 'Équipe Askara',
        role: 'Communication',
        avatar: 'https://randomuser.me/api/portraits/lego/2.jpg'
      },
      details: [
        'Jusqu\'à 5 documents par mois',
        'Accès aux modèles de base',
        'Support communautaire',
        'Et bien plus encore !'
      ],
      relatedLink: '/pricing',
      isNew: false,
      tags: ['abonnement', 'gratuit']
    },
    {
      id: '5',
      title: 'Nouveaux modèles de documents',
      description: "Ajout de 10 nouveaux modèles de documents médicaux prédéfinis.",
      date: new Date('2025-04-20'),
      type: 'feature',
      version: '1.9.5',
      author: {
        name: 'Dr. Emma Laurent',
        role: 'Conseillère médicale',
        avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
      },
      details: [
        '5 modèles de comptes-rendus',
        '3 modèles d\'ordonnances',
        '2 modèles de courriers',
        'Conformité aux normes en vigueur'
      ],
      tags: ['modèles', 'médical', 'productivité']
    }
  ];

  // Filtre les mises à jour
  const filteredUpdates = updates.filter(update => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(update.date);
  });

  // Grouper les mises à jour par mois
  const updatesByMonth = filteredUpdates.reduce<Record<string, Update[]>>((acc, update) => {
    const monthYear = new Intl.DateTimeFormat('fr-FR', { 
      year: 'numeric', 
      month: 'long' 
    }).format(update.date);
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    
    acc[monthYear].push(update);
    return acc;
  }, {});

  return (
    <HelpLayout
      title="Mises à jour"
      description="Découvrez les dernières nouveautés et améliorations"
      breadcrumbItems={[
        { label: 'Mises à jour', href: '/updates', isCurrentPage: true }
      ]}
    >
      <VStack spacing={8} align="stretch">
        <Box 
          bg={useColorModeValue('blue.50', 'blue.900')} 
          p={6} 
          borderRadius="lg"
        >
          <Heading size="lg" mb={2}>Dernières mises à jour</Heading>
          <Text>
            Restez informé des dernières fonctionnalités, améliorations et corrections apportées à Askara Audio IA.
            Abonnez-vous pour recevoir les mises à jour par email.
          </Text>
        </Box>

        <VStack spacing={12} align="stretch">
          {Object.entries(updatesByMonth).map(([monthYear, monthUpdates]) => (
            <Box key={monthYear}>
              <HStack mb={6} pb={2} borderBottomWidth="1px" borderColor={borderColor}>
                <FaCalendarAlt style={{ color: mutedText, width: '20px', height: '20px' }} />
                <Heading size="md">{monthYear}</Heading>
              </HStack>
              
              <VStack spacing={6} align="stretch">
                {monthUpdates.map((update) => {
                  const colorScheme = getUpdateColor(update.type);
                  const label = getUpdateLabel(update.type);
                  
                  return (
                    <Box 
                      key={update.id}
                      as="article"
                      bg={bgColor}
                      p={6}
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor={borderColor}
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'md',
                      }}
                      transition="all 0.2s"
                    >
                      <VStack align="stretch" spacing={4}>
                        <Flex justify="space-between" align="flex-start">
                          <HStack spacing={3}>
                            <Box 
                              p={2} 
                              bg={`${colorScheme}.100`} 
                              borderRadius="md"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              width="40px"
                              height="40px"
                            >
                              {getUpdateIcon(update.type)}
                            </Box>
                            <VStack align="flex-start" spacing={0}>
                              <HStack spacing={2}>
                                <Badge 
                                  colorScheme={colorScheme} 
                                  variant="subtle"
                                  fontSize="0.7em"
                                  px={2}
                                  py={0.5}
                                  borderRadius="full"
                                >
                                  {label}
                                </Badge>
                                {update.isNew && (
                                  <Badge 
                                    colorScheme="green" 
                                    variant="solid"
                                    fontSize="0.7em"
                                    px={2}
                                    py={0.5}
                                    borderRadius="full"
                                  >
                                    Nouveau
                                  </Badge>
                                )}
                              </HStack>
                              <Text fontSize="xs" color={mutedText}>
                                Version {update.version} • {formatDate(update.date)}
                              </Text>
                            </VStack>
                          </HStack>
                          
                          <HStack>
                            {update.tags?.map((tag, index) => (
                              <Tag 
                                key={index} 
                                size="sm" 
                                variant="outline" 
                                colorScheme="gray"
                                borderRadius="full"
                              >
                                <FaTag style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                                <TagLabel>{tag}</TagLabel>
                              </Tag>
                            ))}
                          </HStack>
                        </Flex>
                        
                        <Box>
                          <Heading size="md" mb={2}>
                            {update.title}
                          </Heading>
                          <Text mb={4}>
                            {update.description}
                          </Text>
                          
                          {update.details && update.details.length > 0 && (
                            <Box 
                              as="ul" 
                              pl={5} 
                              mb={4}
                              sx={{ '& > li': { mb: 1 } }}
                            >
                              {update.details.map((detail, i) => (
                                <li key={i}>
                                  <Text>{detail}</Text>
                                </li>
                              ))}
                            </Box>
                          )}
                          
                          <Flex justify="space-between" align="center" mt={4}>
                            <HStack spacing={2}>
                              <Avatar 
                                size="sm" 
                                name={update.author.name} 
                                src={update.author.avatar} 
                              />
                              <Box>
                                <Text fontSize="sm" fontWeight="medium">{update.author.name}</Text>
                                <Text fontSize="xs" color={mutedText}>{update.author.role}</Text>
                              </Box>
                            </HStack>
                            
                            {update.relatedLink && (
                              <ChakraLink 
                                as={RouterLink} 
                                to={update.relatedLink}
                                color="blue.500"
                                display="inline-flex"
                                alignItems="center"
                                _hover={{ textDecoration: 'none' }}
                              >
                                En savoir plus <Box as={FaExternalLinkAlt} ml={1} style={{ display: 'inline-flex', alignItems: 'center', width: '14px', height: '14px' }} />
                              </ChakraLink>
                            )}
                          </Flex>
                        </Box>
                      </VStack>
                    </Box>
                  );
                })}
              </VStack>
            </Box>
          ))}
        </VStack>
        
        <Box 
          bg={useColorModeValue('gray.50', 'gray.700')} 
          p={6} 
          borderRadius="lg"
          textAlign="center"
        >
          <Heading size="md" mb={4}>Vous souhaitez être informé des prochaines mises à jour ?</Heading>
          <Text mb={6}>
            Abonnez-vous à notre newsletter pour recevoir les dernières actualités et fonctionnalités directement dans votre boîte mail.
          </Text>
          <ChakraLink
            as={RouterLink}
            to="/newsletter"
            colorScheme="blue"
            variant="solid"
            px={6}
            py={2}
            borderRadius="md"
            bg="blue.500"
            color="white"
            _hover={{
              bg: 'blue.600',
              textDecoration: 'none',
            }}
          >
            S'abonner à la newsletter
          </ChakraLink>
        </Box>
      </VStack>
    </HelpLayout>
  );
};

export default UpdatesPage;

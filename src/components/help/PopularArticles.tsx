import React from 'react';
import { 
  VStack, 
  Heading, 
  Text, 
  Box, 
  HStack, 
  Badge, 
  useColorModeValue,
  Link as ChakraLink,
  Flex,
  Icon
} from '@chakra-ui/react';
import { FaBook, FaTools, FaLightbulb, FaBookOpen } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

interface PopularArticleProps {
  id: string;
  title: string;
  category: string;
  views: number;
  icon: React.ReactElement;
  colorScheme: string;
}

const PopularArticle: React.FC<PopularArticleProps> = ({ 
  title, 
  category, 
  views, 
  icon,
  colorScheme
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  
  return (
    <ChakraLink 
      as={RouterLink} 
      to={`/help/${category.toLowerCase().replace(/\s+/g, '-')}`}
      _hover={{ textDecoration: 'none' }}
    >
      <Box
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        bg={bgColor}
        _hover={{
          bg: hoverBg,
          transform: 'translateY(-2px)',
          boxShadow: 'md',
        }}
        transition="all 0.2s"
      >
        <HStack spacing={4} align="flex-start">
          <Flex
            p={2}
            borderRadius="md"
            bg={`${colorScheme}.100`}
            color={`${colorScheme}.600`}
            align="center"
            justify="center"
            flexShrink={0}
            width="40px"
            height="40px"
          >
            <Icon as={() => icon} boxSize={5} />
          </Flex>
          <Box flex={1}>
            <Badge 
              colorScheme={colorScheme} 
              variant="subtle"
              fontSize="0.7em"
              mb={1}
              textTransform="uppercase"
              letterSpacing="wider"
            >
              {category}
            </Badge>
            <Text fontWeight="medium" mb={1} noOfLines={2}>
              {title}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {views.toLocaleString()} vues
            </Text>
          </Box>
        </HStack>
      </Box>
    </ChakraLink>
  );
};

const PopularArticles: React.FC = () => {
  const articles: PopularArticleProps[] = [
    {
      id: '1',
      title: 'Comment créer un nouveau document',
      category: 'Documentation',
      views: 1245,
      icon: <FaBook />,
      colorScheme: 'blue',
    },
    {
      id: '2',
      title: 'Résolution des problèmes audio',
      category: 'Dépannage',
      views: 987,
      icon: <FaTools />,
      colorScheme: 'red',
    },
    {
      id: '3',
      title: 'Personnalisation des modèles',
      category: 'Astuces',
      views: 876,
      icon: <FaLightbulb />,
      colorScheme: 'yellow',
    },
    {
      id: '4',
      title: 'Intégration avec les logiciels tiers',
      category: 'Guide',
      views: 765,
      icon: <FaBookOpen />,
      colorScheme: 'green',
    },
  ];

  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h2" size="lg">
        Articles populaires
      </Heading>
      <VStack spacing={4} align="stretch">
        {articles.map((article) => (
          <PopularArticle key={article.id} {...article} />
        ))}
      </VStack>
    </VStack>
  );
};

export default PopularArticles;

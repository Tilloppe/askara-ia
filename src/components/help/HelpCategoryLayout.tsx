import React from 'react';
import { 
  Box, 
  VStack, 
  HStack,
  Heading, 
  Text, 
  useColorModeValue,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  SimpleGrid,
  Link as ChakraLink,
  Icon
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';

interface HelpCategoryLayoutProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  colorScheme: string;
  children: React.ReactNode;
}

const HelpCategoryLayout: React.FC<HelpCategoryLayoutProps> = ({
  title,
  description,
  icon,
  colorScheme,
  children
}) => {
  const bgGradient = useColorModeValue(
    `linear(to-r, ${colorScheme}.50, ${colorScheme}.100)`,
    `linear(to-r, ${colorScheme}.900, ${colorScheme}.800)`
  );

  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);

  return (
    <Box minH="calc(100vh - 64px)" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* En-tête de la catégorie */}
      <Box 
        bgGradient={bgGradient}
        py={12}
        borderBottomWidth="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Container maxW="6xl">
          <Breadcrumb 
            spacing="8px" 
            separator={<Icon as={FaChevronRight} color="gray.500" />}
            mb={4}
          >
            <BreadcrumbItem>
              <ChakraLink as={RouterLink} to="/" display="flex" alignItems="center">
                <Icon as={FaHome} mr={2} />
                Accueil
              </ChakraLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <ChakraLink as={RouterLink} to="/help">
                Aide
              </ChakraLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <ChakraLink>{title}</ChakraLink>
            </BreadcrumbItem>
          </Breadcrumb>
          
          <HStack spacing={4} align="center">
            <Box
              p={3}
              bg={`${colorScheme}.500`}
              color="white"
              borderRadius="lg"
              boxShadow="md"
            >
              <Icon as={() => icon} boxSize={8} />
            </Box>
            <VStack align="flex-start" spacing={2}>
              <Heading as="h1" size="2xl" color="white">
                {title}
              </Heading>
              <Text fontSize="lg" color={useColorModeValue(`${colorScheme}.100`, `${colorScheme}.200`)}>
                {description}
              </Text>
            </VStack>
          </HStack>
        </Container>
      </Box>

      {/* Contenu de la catégorie */}
      <Container maxW="6xl" py={8}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {/* Contenu principal */}
          <Box gridColumn={{ base: '1 / -1', md: '1 / 3' }}>
            {children}
          </Box>
          
          {/* Barre latérale */}
          <Box>
            <VStack spacing={6} align="stretch">
              {/* Articles populaires */}
              <Box 
                bg={useColorModeValue('white', 'gray.800')}
                p={6}
                borderRadius="lg"
                boxShadow="sm"
                borderWidth="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
              >
                <Heading size="md" mb={4}>
                  Articles populaires
                </Heading>
                <VStack spacing={4} align="stretch">
                  <ChakraLink as={RouterLink} to="/help/documentation/creer-document" display="block" p={2} _hover={{ bg: useColorModeValue('gray.50', 'gray.700'), borderRadius: 'md' }}>
                    Comment créer un nouveau document
                  </ChakraLink>
                  <ChakraLink as={RouterLink} to="/help/depannage/problemes-audio" display="block" p={2} _hover={{ bg: useColorModeValue('gray.50', 'gray.700'), borderRadius: 'md' }}>
                    Résolution des problèmes audio
                  </ChakraLink>
                  <ChakraLink as={RouterLink} to="/help/astuce/personnalisation-modeles" display="block" p={2} _hover={{ bg: useColorModeValue('gray.50', 'gray.700'), borderRadius: 'md' }}>
                    Personnalisation des modèles
                  </ChakraLink>
                </VStack>
              </Box>
              
              {/* Contact support */}
              <Box 
                bg={useColorModeValue('white', 'gray.800')}
                p={6}
                borderRadius="lg"
                boxShadow="sm"
                borderWidth="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
              >
                <Heading size="md" mb={4}>
                  Besoin d'aide ?
                </Heading>
                <Text mb={4}>
                  Notre équipe de support est là pour vous aider.
                </Text>
                <ChakraLink 
                  as={RouterLink} 
                  to="/help/support" 
                  color={`${colorScheme}.500`}
                  fontWeight="medium"
                  _hover={{ textDecoration: 'underline' }}
                >
                  Contacter le support →
                </ChakraLink>
              </Box>
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default HelpCategoryLayout;

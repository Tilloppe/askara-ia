import React, { ReactNode } from 'react';
import { 
  Box, 
  Container, 
  VStack, 
  Heading, 
  Text, 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink,
  useColorModeValue
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

interface HelpLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  breadcrumbItems?: Array<{
    label: string;
    href: string;
    isCurrentPage?: boolean;
  }>;
}

const HelpLayout: React.FC<HelpLayoutProps> = ({
  title,
  description,
  children,
  breadcrumbItems = []
}) => {
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.50, purple.50)',
    'linear(to-r, gray.900, gray.800)'
  );

  const defaultBreadcrumb = [
    { label: 'Accueil', href: '/' },
    { label: 'Aide', href: '/help' },
    ...breadcrumbItems
  ];

  return (
    <Box minH="calc(100vh - 64px)" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* En-tête */}
      <Box 
        bgGradient={bgGradient}
        py={8}
        borderBottomWidth="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Container maxW="6xl">
          <VStack spacing={4} align="flex-start">
            <Breadcrumb fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
              {defaultBreadcrumb.map((item, index) => (
                <BreadcrumbItem key={index} isCurrentPage={item.isCurrentPage}>
                  <BreadcrumbLink as={RouterLink} to={item.href}>
                    {item.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
            <Heading as="h1" size="xl">
              {title}
            </Heading>
            {description && (
              <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.300')}>
                {description}
              </Text>
            )}
          </VStack>
        </Container>
      </Box>

      {/* Contenu principal */}
      <Container maxW="6xl" py={8}>
        {children}
      </Container>
    </Box>
  );
};

export default HelpLayout;

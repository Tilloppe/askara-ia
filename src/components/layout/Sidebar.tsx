import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Divider, 
  Button,
  useColorModeValue,
  Icon
} from '@chakra-ui/react';
import { 
  QuestionIcon
} from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: 'home', label: 'Accueil', path: '/' },
  { icon: 'users', label: 'Patients', path: '/patients' },
  { icon: 'user', label: 'Contacts', path: '/contacts' },
  { icon: 'document', label: 'Documents', path: '/documents' },
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'home':
      return <Icon viewBox="0 0 24 24" w={5} h={5}><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></Icon>;
    case 'users':
      return <Icon viewBox="0 0 24 24" w={5} h={5}><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></Icon>;
    case 'user':
      return <Icon viewBox="0 0 24 24" w={5} h={5}><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></Icon>;
    case 'document':
      return <Icon viewBox="0 0 24 24" w={5} h={5}><path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></Icon>;
    default:
      return <Icon viewBox="0 0 24 24" w={5} h={5}><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></Icon>;
  }
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const activeBg = useColorModeValue('brand.50', 'brand.900');
  const activeColor = useColorModeValue('brand.600', 'brand.200');
  
  const handleLogout = () => {
    // Supprimer l'état d'authentification
    localStorage.removeItem('isAuthenticated');
    // Rediriger vers la page de connexion
    navigate('/login', { replace: true });
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Box
      w="250px"
      minH="100vh"
      bg={bgColor}
      color={textColor}
      p={4}
      display="flex"
      flexDirection="column"
      boxShadow="md"
      borderRight="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      {/* Logo */}
      <HStack 
        as={RouterLink} 
        to="/dashboard" 
        mb={8} 
        p={2}
        _hover={{ textDecoration: 'none' }}
      >
        <Text fontSize="xl" fontWeight="bold" color="brand.600">
          Askara Audio IA
        </Text>
      </HStack>

{/* Menu principal */}
      <VStack spacing={1} align="stretch" flex={1}>
        {menuItems.map((item) => {
          const isItemActive = isActive(item.path);
          return (
            <Button
              key={item.path}
              as={RouterLink}
              to={item.path}
              leftIcon={getIcon(item.icon)}
              variant="ghost"
              justifyContent="flex-start"
              colorScheme={isItemActive ? 'brand' : 'gray'}
              bg={isItemActive ? activeBg : 'transparent'}
              color={isItemActive ? activeColor : 'inherit'}
              _hover={{
                bg: isItemActive ? activeBg : hoverBg,
              }}
              _active={{
                bg: activeBg,
                color: activeColor,
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </VStack>

      {/* Bouton Passer à l'offre Pro */}
      <Box mt="auto" mb={4} px={2}>
        <Button
          as={RouterLink}
          to="/pricing"
          size="md"
          w="full"
          bg="brand.600"
          color="white"
          fontWeight="medium"
          py={2}
          borderRadius="md"
          border="1px solid"
          borderColor="brand.700"
          leftIcon={
            <Icon 
              viewBox="0 0 24 24" 
              w={4} 
              h={4} 
              fill="currentColor"
            >
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
            </Icon>
          }
          _hover={{
            bg: 'brand.700',
            transform: 'translateY(-1px)',
          }}
          _active={{
            bg: 'brand.800',
            transform: 'translateY(0)',
          }}
          transition="all 0.2s"
        >
          Passer à l'offre Pro
        </Button>
      </Box>

      {/* Paramètres et Déconnexion */}
      <VStack spacing={1} align="stretch">
        <Divider my={2} />
        
        <Button
          leftIcon={<QuestionIcon />}
          variant="ghost"
          justifyContent="flex-start"
          colorScheme="gray"
          _hover={{
            bg: hoverBg,
          }}
        >
          Aide et support
        </Button>
        
        <Button
          variant="ghost"
          justifyContent="flex-start"
          leftIcon={<QuestionIcon />}
          onClick={handleLogout}
          _hover={{
            bg: 'red.50',
            color: 'red.600',
          }}
          mt={2}
        >
          Déconnexion
        </Button>
      </VStack>
    </Box>
  );
};

export default Sidebar;

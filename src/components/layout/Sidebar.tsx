import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Divider, 
  Button,
  useColorModeValue,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import { 
  QuestionIcon,
  SettingsIcon,
  ChevronDownIcon,
  ViewIcon,
  AtSignIcon,
  LockIcon,
  SunIcon
} from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: 'home', label: 'Accueil', path: '/' },
  { icon: 'users', label: 'Patients', path: '/patients' },
  { icon: 'contact', label: 'Contacts', path: '/contacts' },
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
    case 'contact':
      return <Icon viewBox="0 0 24 24" w={5} h={5}><path fill="currentColor" d="M20 0H4v24h16V0zm-2 22H6V2h12v20zM8 6h8v2H8zm0 4h8v2H8zm0 4h5v2H8z"/></Icon>;
    case 'document':
      return <Icon viewBox="0 0 24 24" w={5} h={5}><path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></Icon>;
    case 'help':
      return <Icon viewBox="0 0 24 24" w={5} h={5}><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></Icon>;
    case 'settings':
      return <Icon viewBox="0 0 24 24" w={5} h={5}><path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></Icon>;
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
          colorScheme="yellow"
          size="sm"
          w="full"
          leftIcon={<Icon viewBox="0 0 24 24" w={4} h={4}><path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/></Icon>}
          variant="solid"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
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
          as={RouterLink}
          to="/help"
          leftIcon={<QuestionIcon />}
          variant="ghost"
          justifyContent="flex-start"
          colorScheme="gray"
          _hover={{
            bg: hoverBg,
          }}
          mb={2}
        >
          Aide et support
        </Button>
        
        <Menu>
          <Box>
            <MenuButton 
              as={Button} 
              leftIcon={<ViewIcon />}
              variant="ghost"
              justifyContent="flex-start"
              rightIcon={<ChevronDownIcon />}
              iconSpacing={2}
              _hover={{
                bg: hoverBg,
              }}
              pl={3}
              w="100%"
              textAlign="left"
            >
              Mon compte
            </MenuButton>
          </Box>
          <MenuList>
            <MenuItem 
              icon={<ViewIcon />}
              as={RouterLink}
              to="/profile"
              _hover={{
                textDecoration: 'none',
                bg: 'gray.100'
              }}
            >
              Profil
            </MenuItem>
            <MenuItem 
              icon={<AtSignIcon />}
              as={RouterLink}
              to="/equipe"
              _hover={{
                textDecoration: 'none',
                bg: 'gray.100'
              }}
            >
              Équipe
            </MenuItem>
            <MenuItem 
              icon={<SettingsIcon />}
              as={RouterLink}
              to="/parametres"
              _hover={{
                textDecoration: 'none',
                bg: 'gray.100'
              }}
            >
              Paramètres
            </MenuItem>
            <MenuItem 
              icon={<LockIcon />}
              as={RouterLink}
              to="/passerelle"
              _hover={{
                textDecoration: 'none',
                bg: 'gray.100'
              }}
            >
              Passerelle logiciel
            </MenuItem>
            <MenuItem 
              icon={<SunIcon />}
              as={RouterLink}
              to="/personnalisation"
              _hover={{
                textDecoration: 'none',
                bg: 'gray.100'
              }}
            >
              Personnalisation
            </MenuItem>
          </MenuList>
        </Menu>
        
        <Button
          variant="ghost"
          justifyContent="flex-start"
          leftIcon={<QuestionIcon />}
          onClick={handleLogout}
          _hover={{
            bg: 'red.50',
            color: 'red.600',
          }}
          mt={1}
        >
          Déconnexion
        </Button>
      </VStack>
    </Box>
  );
};

export default Sidebar;

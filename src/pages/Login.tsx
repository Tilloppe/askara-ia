import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Flex, 
  VStack, 
  Heading, 
  Text, 
  Input, 
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Button, 
  Checkbox, 
  Image,
  Link as ChakraLink,
  Icon as ChakraIcon,
  useToast,
  FormControl,
  FormLabel,
  useColorModeValue,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const toast = useToast({
    position: 'top-right',
    duration: 3000,
    isClosable: true,
    variant: 'solid',
    containerStyle: {
      width: '100%',
      maxWidth: '400px',
    },
  });
  const navigate = useNavigate();
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    } as FormData));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simuler une requête API
    setTimeout(() => {
      setIsLoading(false);
      // Stocker l'état de connexion dans localStorage
      localStorage.setItem('isAuthenticated', 'true');
      
      toast({
        title: 'Connexion réussie',
        description: 'Vous êtes maintenant connecté.',
        status: 'success',
      });
      
      // Rediriger vers le tableau de bord
      navigate('/dashboard', { replace: true });
    }, 1000);
  };
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  
  return (
    <Flex 
      minH="100vh" 
      bg={bgColor} 
      align="center" 
      justify="center" 
      p={4}
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflowY="auto"
    >
      <VStack 
        spacing={8} 
        maxW="md" 
        w="100%" 
        py={12} 
        px={6}
        bg={cardBg}
        borderRadius="lg"
        boxShadow="lg"
        position="relative"
        zIndex={1}
        mx="auto"
        my={8}
      >
        <VStack spacing={4} align="center" w="100%">
          <Box textAlign="center">
            <Image 
              src="/logo.png" 
              alt="Askara Audio IA" 
              height="80px" 
              mb={4}
              mx="auto"
            />
            <Heading as="h1" size="xl" color="blue.600" mb={2}>
              Askara Audio IA
            </Heading>
          </Box>
          <VStack spacing={2} textAlign="center">
            <Heading size="lg">Connectez-vous à votre compte</Heading>
            <Text color="gray.600">
              Gérez vos patients et vos documents en toute simplicité
            </Text>
          </VStack>
        </VStack>
        
        <Box rounded="lg" bg={cardBg} boxShadow="lg" p={8} w="100%">
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl id="email">
                <FormLabel>Adresse email</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <ChakraIcon as={FiMail as unknown as React.ComponentType} color="gray.400" />
                  </InputLeftElement>
                  <Input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    pl={10}
                    isRequired
                  />
                </InputGroup>
              </FormControl>
              
              <FormControl id="password">
                <Flex justify="space-between" mb={1}>
                  <FormLabel>Mot de passe</FormLabel>
                  <ChakraLink as="a" href="/forgot-password" color="blue.500" fontSize="sm">
                    Mot de passe oublié ?
                  </ChakraLink>
                </Flex>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <ChakraIcon as={FiLock as unknown as React.ComponentType} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    pl={10}
                    isRequired
                  />
                  <InputRightElement>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      _hover={{ bg: 'transparent' }}
                      _active={{ bg: 'transparent' }}
                    >
                      <ChakraIcon as={(showPassword ? FiEyeOff : FiEye) as unknown as React.ComponentType} color="gray.400" />
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              
              <HStack w="100%" justify="space-between">
                <Checkbox 
                  name="rememberMe"
                  isChecked={formData.rememberMe}
                  onChange={handleChange}
                  colorScheme="blue"
                >
                  Se souvenir de moi
                </Checkbox>
              </HStack>
              
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontSize="md"
                isLoading={isLoading}
                loadingText="Connexion en cours..."
                width="100%"
                _hover={{
                  bg: 'blue.600',
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
              
              <HStack w="100%" py={4}>
                <Divider />
                <Text color="gray.500" fontSize="sm" whiteSpace="nowrap" px={2}>
                  OU
                </Text>
                <Divider />
              </HStack>
              
              <Text textAlign="center" fontSize="sm" color="gray.600">
                Pas encore de compte ?{' '}
                <ChakraLink as="a" href="/register" color="blue.500" fontWeight="medium">
                  Créer un compte
                </ChakraLink>
              </Text>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Flex>
  );
};

export default Login;

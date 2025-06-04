import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useColorModeValue,
  useToast,
  Link,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useState } from 'react';
// Imports directs des icônes
import { FiMail, FiMapPin, FiClock, FiGlobe, FiSend } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const ContactPage = () => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler un envoi de formulaire
    setTimeout(() => {
      console.log('Formulaire soumis:', formData);
      setIsSubmitting(false);
      toast({
        title: 'Message envoyé',
        description: 'Nous vous remercions pour votre message. Nous vous répondrons dans les plus brefs délais.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Composants d'icônes personnalisés
  // Composant d'icône personnalisé
  const CustomIcon = ({ icon: Icon, ...props }: { icon: React.ElementType } & any) => (
    <Box as="span" display="inline-flex" alignItems="center" justifyContent="center" {...props}>
      <Icon />
    </Box>
  );
  
  const iconStyle = { color: 'brand.500', size: '20px' };
  const socialIconStyle = { color: 'brand.500', size: '24px' };

  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} minH="calc(100vh - 64px)" py={4}>
      <Container maxW="6xl" py={4}>
        <VStack spacing={2} textAlign="center" mb={8}>
          <Heading as="h1" size="2xl" fontWeight="bold" color={useColorModeValue('brand.600', 'brand.400')}>
            Contactez-nous
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')} maxW="2xl" textAlign="center">
            Notre équipe est à votre écoute pour répondre à toutes vos questions.
          </Text>
        </VStack>

        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
          {/* Colonne de gauche - Informations de contact */}
          <GridItem>
            <Box 
              bg={cardBg} 
              p={8}
              rounded="xl"
              shadow={cardShadow}
              h="100%"
              border="1px solid"
              borderColor={borderColor}
            >
              <VStack spacing={6} align="flex-start">
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4}>Informations de contact</Text>
                  <VStack spacing={4} align="flex-start">
                    <HStack spacing={3}>
                      <CustomIcon icon={FiMail} {...iconStyle} />
                      <Text>contact@askara-audio.com</Text>
                    </HStack>
                    <HStack spacing={3}>
                      <CustomIcon icon={FiGlobe} {...iconStyle} />
                      <Text>www.askara-audio.com</Text>
                    </HStack>
                    <HStack spacing={3}>
                      <CustomIcon icon={FiMapPin} {...iconStyle} />
                      <Text>12 rue de l'église, 92300 Levallois-Perret, France</Text>
                    </HStack>
                  </VStack>
                </Box>

                <Box w="full">
                  <Text fontSize="lg" fontWeight="semibold" mb={4}>Heures d'ouverture</Text>
                  <VStack spacing={2} align="flex-start">
                    <HStack spacing={3}>
                      <CustomIcon icon={FiClock} {...iconStyle} />
                      <Text>Lundi - Vendredi: 9h00 - 18h00</Text>
                    </HStack>
                    <HStack spacing={3}>
                      <CustomIcon icon={FiClock} {...iconStyle} />
                      <Text>Samedi: 10h00 - 14h00</Text>
                    </HStack>
                    <HStack spacing={3}>
                      <CustomIcon icon={FiClock} {...iconStyle} />
                      <Text>Dimanche: Fermé</Text>
                    </HStack>
                  </VStack>
                </Box>

                <Box w="full">
                  <Text fontSize="lg" fontWeight="semibold" mb={4}>Suivez-nous</Text>
                  <HStack spacing={4}>
                    <Link href="https://facebook.com" isExternal _hover={{ color: 'brand.500' }}>
                      <CustomIcon icon={FaFacebook} {...socialIconStyle} />
                    </Link>
                    <Link href="https://twitter.com" isExternal _hover={{ color: 'brand.500' }}>
                      <CustomIcon icon={FaTwitter} {...socialIconStyle} />
                    </Link>
                    <Link href="https://linkedin.com" isExternal _hover={{ color: 'brand.500' }}>
                      <CustomIcon icon={FaLinkedin} {...socialIconStyle} />
                    </Link>
                  </HStack>
                </Box>
              </VStack>
            </Box>
          </GridItem>

          <GridItem>
            <Box 
              bg={cardBg} 
              p={6} 
              rounded="xl" 
              shadow={cardShadow}
              border="1px solid"
              borderColor={borderColor}
              display="flex"
              flexDirection="column"
            >
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} flex="1">
                  <FormControl id="name" isRequired>
                    <FormLabel>Votre nom</FormLabel>
                    <Input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom complet"
                    />
                  </FormControl>

                  <FormControl id="email" isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                    />
                  </FormControl>

                  <FormControl id="subject" isRequired>
                    <FormLabel>Sujet</FormLabel>
                    <Input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Objet de votre message"
                    />
                  </FormControl>

                  <FormControl id="message" isRequired>
                    <FormLabel>Message</FormLabel>
                    <Textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Décrivez-nous votre demande..."
                      rows={3}
                      resize="vertical"
                      minH="100px"
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    rightIcon={<CustomIcon icon={FiSend} />}
                    isLoading={isSubmitting}
                    loadingText="Envoi en cours..."
                    w="full"
                  >
                    Envoyer le message
                  </Button>
                </VStack>
              </form>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactPage;

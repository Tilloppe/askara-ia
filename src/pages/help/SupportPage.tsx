import React, { useState } from 'react';
import {
  VStack,
  Heading,
  Text,
  Box,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Select,
  useToast,
  HStack,
  Icon,
  SimpleGrid
} from '@chakra-ui/react';
import { FaEnvelope, FaPhone, FaClock, FaCheckCircle } from 'react-icons/fa';
import HelpLayout from '../../components/help/HelpLayout';

const SupportPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler un envoi de formulaire
    setTimeout(() => {
      console.log('Formulaire soumis :', formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      toast({
        title: 'Message envoyé',
        description: 'Notre équipe vous répondra dans les plus brefs délais.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
    }, 1500);
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (isSubmitted) {
    return (
      <HelpLayout
        title="Message envoyé"
        description="Nous avons bien reçu votre demande"
        breadcrumbItems={[
          { label: 'Support', href: '/help/support', isCurrentPage: true }
        ]}
      >
        <VStack spacing={6} textAlign="center" py={20}>
          <Icon as={FaCheckCircle} boxSize={16} color="green.500" />
          <Heading size="lg">Merci pour votre message !</Heading>
          <Text maxW="2xl" color={useColorModeValue('gray.600', 'gray.300')}>
            Nous avons bien reçu votre demande et notre équipe de support vous répondra dans les plus brefs délais.
            Vous recevrez une confirmation par email à l'adresse que vous avez fournie.
          </Text>
          <Button
            as="a"
            href="/help/faq"
            colorScheme="blue"
            mt={4}
          >
            Consulter la FAQ
          </Button>
        </VStack>
      </HelpLayout>
    );
  }

  return (
    <HelpLayout
      title="Support technique"
      description="Notre équipe est là pour vous aider"
      breadcrumbItems={[
        { label: 'Support', href: '/help/support', isCurrentPage: true }
      ]}
    >
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        <Box>
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="lg" mb={4}>Contactez notre équipe</Heading>
              <Text color={useColorModeValue('gray.600', 'gray.300')}>
                Remplissez le formulaire pour nous faire part de vos questions ou problèmes.
                Notre équipe de support vous répondra dans les plus brefs délais.
              </Text>
            </Box>

            <Box 
              bg={useColorModeValue('blue.50', 'blue.900')} 
              p={6} 
              borderRadius="lg"
            >
              <VStack spacing={4} align="flex-start">
                <HStack spacing={4}>
                  <Icon as={FaEnvelope} boxSize={6} color="blue.500" />
                  <Box>
                    <Text fontWeight="bold">Email</Text>
                    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
                      support@askara-audio.com
                    </Text>
                  </Box>
                </HStack>
                <HStack spacing={4}>
                  <Icon as={FaPhone} boxSize={6} color="blue.500" />
                  <Box>
                    <Text fontWeight="bold">Téléphone</Text>
                    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
                      +33 1 23 45 67 89
                    </Text>
                  </Box>
                </HStack>
                <HStack spacing={4}>
                  <Icon as={FaClock} boxSize={6} color="blue.500" />
                  <Box>
                    <Text fontWeight="bold">Horaires d'ouverture</Text>
                    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
                      Lundi - Vendredi : 9h - 18h
                    </Text>
                  </Box>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </Box>

        <Box 
          bg={bgColor} 
          p={8} 
          borderRadius="lg"
          boxShadow="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>Votre nom</FormLabel>
                <Input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre nom complet"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Sujet</FormLabel>
                <Input 
                  type="text" 
                  name="subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Objet de votre message"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Catégorie</FormLabel>
                <Select 
                  name="category" 
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="general">Question générale</option>
                  <option value="technical">Problème technique</option>
                  <option value="billing">Facturation</option>
                  <option value="account">Compte utilisateur</option>
                  <option value="other">Autre</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Message</FormLabel>
                <Textarea 
                  name="message" 
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Décrivez votre demande en détail..."
                  rows={6}
                />
              </FormControl>

              <Button 
                type="submit" 
                colorScheme="blue" 
                width="full"
                size="lg"
                isLoading={isSubmitting}
                loadingText="Envoi en cours..."
              >
                Envoyer le message
              </Button>
            </VStack>
          </form>
        </Box>
      </SimpleGrid>
    </HelpLayout>
  );
};

export default SupportPage;

import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  Input,
  Textarea,
  Button,
  SimpleGrid
} from '@chakra-ui/react';
import { EmailIcon, TimeIcon, QuestionIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

// Interface pour les ressources
interface ResourceItem {
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  link?: string;
}

const HelpAndSupportPage = () => {
  // Variables de style

  const faqs = [
    {
      question: "Comment créer un nouveau document ?",
      answer: "Allez dans la section 'Documents' et cliquez sur le bouton 'Nouveau document'. Suivez ensuite les étapes pour sélectionner un modèle et remplir les champs requis."
    },
    {
      question: "Comment ajouter un nouveau patient ?",
      answer: "Dans la barre de navigation, cliquez sur 'Patients' puis sur 'Nouveau patient'. Remplissez le formulaire avec les informations du patient et enregistrez."
    },
    {
      question: "Comment exporter mes documents ?",
      answer: "Dans la vue d'un document, cliquez sur le bouton 'Exporter' et choisissez le format souhaité (PDF, Word, etc.)."
    },
    {
      question: "Comment mettre à jour mes informations de facturation ?",
      answer: "Allez dans les paramètres de votre compte et sélectionnez l'onglet 'Facturation'. Vous pourrez alors mettre à jour vos informations de paiement."
    },
    {
      question: "Comment contacter le support technique ?",
      answer: "Vous pouvez nous contacter par email à support@askara-audio.com ou utiliser le formulaire de contact. Notre équipe vous répondra dans les 24 heures ouvrables."
    }
  ];

  // Resources cards data
  const resources: ResourceItem[] = [
    {
      title: "Documentation complète",
      description: "Guide d'utilisation détaillé de l'application",
      icon: ExternalLinkIcon,
      iconColor: 'blue.500',
      link: "/documentation"
    },
    {
      title: "Tutoriels vidéo",
      description: "Vidéos explicatives pour prendre en main l'application",
      icon: ExternalLinkIcon,
      iconColor: 'red.500'
    },
    {
      title: "Centre d'aide",
      description: "Articles et guides pour résoudre les problèmes courants",
      icon: QuestionIcon,
      iconColor: 'green.500'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de soumission du formulaire
    console.log('Formulaire soumis');
  };

  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} minH="calc(100vh - 64px)" py={8}>
      <Container maxW="6xl">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={4} color={useColorModeValue('brand.600', 'brand.400')}>
              Aide et Support
            </Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
              Trouvez des réponses à vos questions ou contactez notre équipe de support
            </Text>
          </Box>

          {/* Section Contact Rapide */}
          <Box 
            bgGradient={useColorModeValue(
              'linear(to-r, brand.50, blue.50)',
              'linear(to-r, gray.800, blue.900)'
            )}
            p={8}
            rounded="2xl"
            shadow="xl"
            border="1px solid"
            borderColor={useColorModeValue('brand.100', 'blue.900')}
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: '300px',
              height: '300px',
              bg: useColorModeValue('brand.100', 'blue.800'),
              opacity: 0.6,
              borderRadius: '50%',
              zIndex: 0,
            }}
          >
            <Box position="relative" zIndex={1}>
              <Heading 
                as="h2" 
                size="xl" 
                mb={6}
                color={useColorModeValue('brand.700', 'white')}
                position="relative"
                _after={{
                  content: '""',
                  position: 'absolute',
                  bottom: '-12px',
                  left: 0,
                  width: '60px',
                  height: '4px',
                  bg: useColorModeValue('brand.400', 'brand.300'),
                  borderRadius: '2px'
                }}
              >
                Contactez-nous
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mt={8}>
              <Box
                bg={useColorModeValue('white', 'gray.800')}
                p={6}
                rounded="xl"
                shadow="md"
                borderLeft="4px solid"
                borderColor="brand.400"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'lg',
                  transition: 'all 0.3s ease'
                }}
                transition="all 0.3s ease"
              >
                <Box display="flex" alignItems="center" mb={3}>
                  <Box
                    p={2}
                    bg="brand.50"
                    color="brand.600"
                    rounded="lg"
                    mr={3}
                  >
                    <EmailIcon boxSize={5} />
                  </Box>
                  <Text fontWeight="bold" fontSize="lg">Par email</Text>
                </Box>
                <Text fontSize="lg" fontWeight="medium" mb={2}>
                  support@askara-audio.com
                </Text>
                <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                  Notre équipe vous répondra dans les 24 heures
                </Text>
              </Box>

              <Box
                bg={useColorModeValue('white', 'gray.800')}
                p={6}
                rounded="xl"
                shadow="md"
                borderLeft="4px solid"
                borderColor="blue.400"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'lg',
                  transition: 'all 0.3s ease'
                }}
                transition="all 0.3s ease"
              >
                <Box display="flex" alignItems="center" mb={3}>
                  <Box
                    p={2}
                    bg="blue.50"
                    color="blue.600"
                    rounded="lg"
                    mr={3}
                  >
                    <TimeIcon boxSize={5} />
                  </Box>
                  <Text fontWeight="bold" fontSize="lg">Heures d'ouverture</Text>
                </Box>
                <VStack align="start" spacing={1}>
                  <Text><Text as="span" fontWeight="medium">Lun - Ven:</Text> 9h00 - 18h00</Text>
                  <Text><Text as="span" fontWeight="medium">Sam:</Text> 10h00 - 14h00</Text>
                  <Text><Text as="span" fontWeight="medium">Dim:</Text> Fermé</Text>
                </VStack>
              </Box>
              </SimpleGrid>
            </Box>
          </Box>

          {/* Section FAQ */}
          <Box 
            bgGradient={useColorModeValue(
              'linear(to-r, purple.50, pink.50)',
              'linear(to-r, gray.800, purple.900)'
            )}
            p={8}
            rounded="2xl"
            shadow="xl"
            border="1px solid"
            borderColor={useColorModeValue('purple.100', 'purple.900')}
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              bottom: '-20%',
              left: '-10%',
              width: '300px',
              height: '300px',
              bg: useColorModeValue('purple.100', 'purple.800'),
              opacity: 0.6,
              borderRadius: '50%',
              zIndex: 0,
            }}
          >
            <Box position="relative" zIndex={1}>
              <Heading 
                as="h2" 
                size="xl" 
                mb={8}
                color={useColorModeValue('purple.700', 'white')}
                position="relative"
                _after={{
                  content: '""',
                  position: 'absolute',
                  bottom: '-12px',
                  left: 0,
                  width: '60px',
                  height: '4px',
                  bg: useColorModeValue('purple.400', 'purple.300'),
                  borderRadius: '2px'
                }}
              >
                Foire aux questions
              </Heading>
              <Accordion allowToggle>
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    border="none" 
                    mb={3}
                    bg={useColorModeValue('white', 'gray.800')}
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow="md"
                    _notLast={{ mb: 4 }}
                  >
                    <AccordionButton 
                      _expanded={{ 
                        bg: useColorModeValue('purple.50', 'purple.900'),
                        color: 'purple.600',
                        fontWeight: 'bold'
                      }}
                      p={5}
                      _hover={{ 
                        bg: useColorModeValue('purple.50', 'purple.900'),
                      }}
                    >
                      <Box as="span" flex='1' textAlign='left' fontWeight="medium">
                        {faq.question}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel 
                      p={5}
                      bg={useColorModeValue('white', 'gray.800')}
                      borderTop="1px solid"
                      borderColor={useColorModeValue('gray.100', 'gray.700')}
                    >
                      <Text color={useColorModeValue('gray.700', 'gray.300')}>
                        {faq.answer}
                      </Text>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
          </Box>

          {/* Ressources utiles */}
          <Box
            bgGradient={useColorModeValue(
              'linear(to-r, teal.50, cyan.50)',
              'linear(to-r, gray.800, teal.900)'
            )}
            p={8}
            rounded="2xl"
            shadow="xl"
            border="1px solid"
            borderColor={useColorModeValue('teal.100', 'teal.900')}
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: '300px',
              height: '300px',
              bg: useColorModeValue('teal.100', 'teal.800'),
              opacity: 0.6,
              borderRadius: '50%',
              zIndex: 0,
            }}
          >
            <Box position="relative" zIndex={1}>
              <Heading 
                as="h2" 
                size="xl" 
                mb={8}
                color={useColorModeValue('teal.800', 'white')}
                position="relative"
                _after={{
                  content: '""',
                  position: 'absolute',
                  bottom: '-12px',
                  left: 0,
                  width: '60px',
                  height: '4px',
                  bg: useColorModeValue('teal.400', 'teal.300'),
                  borderRadius: '2px'
                }}
              >
                Ressources utiles
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                {resources.map((resource, index) => (
                  resource.link ? (
                    <RouterLink key={index} to={resource.link} style={{ textDecoration: 'none' }}>
                      <Box
                        bg={useColorModeValue('white', 'gray.800')}
                        p={6}
                        rounded="xl"
                        shadow="md"
                        borderLeft="4px solid"
                        borderColor={`${resource.iconColor}.400`}
                        position="relative"
                        overflow="hidden"
                        _hover={{
                          transform: 'translateY(-6px)',
                          boxShadow: 'xl',
                          transition: 'all 0.3s ease',
                          '.resource-icon': {
                            transform: 'scale(1.1)',
                            transition: 'all 0.3s ease'
                          }
                        }}
                        transition="all 0.3s ease"
                      >
                        <Icon 
                          as={resource.icon} 
                          className="resource-icon"
                          boxSize={8}
                          color={`${resource.iconColor}.500`}
                          mb={4}
                          transition="all 0.3s ease"
                        />
                        <Heading as="h3" size="md" mb={3} color={useColorModeValue('gray.800', 'white')}>
                          {resource.title}
                        </Heading>
                        <Text color={useColorModeValue('gray.600', 'gray.300')} fontSize="sm">
                          {resource.description}
                        </Text>
                      </Box>
                    </RouterLink>
                  ) : (
                    <Box
                      key={index}
                      bg={useColorModeValue('white', 'gray.800')}
                      p={6}
                      rounded="xl"
                      shadow="md"
                      borderLeft="4px solid"
                      borderColor={`${resource.iconColor}.400`}
                      position="relative"
                      overflow="hidden"
                      _hover={{
                        transform: 'translateY(-6px)',
                        boxShadow: 'xl',
                        transition: 'all 0.3s ease',
                        '.resource-icon': {
                          transform: 'scale(1.1)',
                          transition: 'all 0.3s ease'
                        }
                      }}
                      transition="all 0.3s ease"
                    >
                      <Icon 
                        as={resource.icon} 
                        className="resource-icon"
                        boxSize={8}
                        color={`${resource.iconColor}.500`}
                        mb={4}
                        transition="all 0.3s ease"
                      />
                      <Heading as="h3" size="md" mb={3} color={useColorModeValue('gray.800', 'white')}>
                        {resource.title}
                      </Heading>
                      <Text color={useColorModeValue('gray.600', 'gray.300')} fontSize="sm">
                        {resource.description}
                      </Text>
                    </Box>
                  )
                ))}
              </SimpleGrid>
            </Box>
          </Box>

          {/* Section Contact Form */}
          <Box 
            bgGradient={useColorModeValue(
              'linear(to-r, orange.50, yellow.50)',
              'linear(to-r, gray.800, yellow.900)'
            )}
            p={8}
            rounded="2xl"
            shadow="xl"
            border="1px solid"
            borderColor={useColorModeValue('orange.100', 'yellow.900')}
            position="relative"
            overflow="hidden"
            mt={8}
            _before={{
              content: '""',
              position: 'absolute',
              bottom: '-30%',
              right: '-10%',
              width: '400px',
              height: '400px',
              bg: useColorModeValue('orange.100', 'yellow.800'),
              opacity: 0.4,
              borderRadius: '50%',
              zIndex: 0,
            }}
          >
            <Box position="relative" zIndex={1}>
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading 
                    as="h2" 
                    size="xl" 
                    mb={4}
                    color={useColorModeValue('orange.700', 'white')}
                    position="relative"
                    _after={{
                      content: '""',
                      position: 'absolute',
                      bottom: '-10px',
                      left: 0,
                      width: '60px',
                      height: '4px',
                      bg: useColorModeValue('orange.400', 'yellow.300'),
                      borderRadius: '2px'
                    }}
                  >
                    Besoin d'aide supplémentaire ?
                  </Heading>
                  <Text 
                    fontSize="lg"
                    color={useColorModeValue('orange.800', 'gray.200')}
                    maxW="2xl"
                  >
                    Notre équipe est là pour vous aider. Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                  </Text>
                </Box>
              
                <Box as="form" onSubmit={handleSubmit} mt={4} w="full">
                  <VStack spacing={6} align="stretch">
                    <Box w="full">
                      <Text 
                        mb={2} 
                        fontWeight="medium"
                        color={useColorModeValue('orange.800', 'orange.100')}
                      >
                        Email
                      </Text>
                      <Input 
                        type="email" 
                        placeholder="votre@email.com" 
                        size="lg"
                        bg={useColorModeValue('white', 'gray.800')}
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _hover={{ 
                          borderColor: 'orange.300',
                          boxShadow: 'sm'
                        }}
                        _focus={{
                          borderColor: 'orange.500',
                          boxShadow: '0 0 0 1px var(--chakra-colors-orange-500)',
                          bg: 'white'
                        }}
                        _placeholder={{
                          color: 'gray.400'
                        }}
                      />
                    </Box>
                    
                    <Box w="full">
                      <Text
                        mb={2}
                        fontWeight="medium"
                        color={useColorModeValue('orange.800', 'orange.100')}
                      >
                        Message
                      </Text>
                      <Textarea
                        placeholder="Décrivez votre problème ou votre question en détail..."
                        size="lg"
                        rows={5}
                        bg={useColorModeValue('white', 'gray.800')}
                        borderColor={useColorModeValue('gray.200', 'gray.600')}
                        _hover={{
                          borderColor: 'orange.300',
                          boxShadow: 'sm'
                        }}
                        _focus={{
                          borderColor: 'orange.500',
                          boxShadow: '0 0 0 1px var(--chakra-colors-orange-500)',
                          bg: 'white'
                        }}
                        _placeholder={{
                          color: 'gray.400'
                        }}
                      />
                    </Box>
                    
                    <Box w="full" textAlign="right">
                      <Button 
                        type="submit"
                        colorScheme="orange"
                        size="lg"
                        rightIcon={<EmailIcon />}
                        px={8}
                        py={6}
                        fontSize="md"
                        fontWeight="semibold"
                        borderRadius="xl"
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: 'lg',
                        }}
                        _active={{
                          transform: 'translateY(0)',
                        }}
                        transition="all 0.2s"
                      >
                        Envoyer le message
                      </Button>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default HelpAndSupportPage;

import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const plans = [
    {
      name: 'Starter',
      price: '0',
      period: '/mois',
      description: 'Parfait pour commencer',
      features: [
        '5 documents/mois',
        'Modèles basiques',
        'Support par email',
        'Accès à la communauté',
      ],
      buttonText: 'Commencer gratuitement',
      popular: false,
    },
    {
      name: 'Pro',
      price: '19',
      period: '/mois',
      description: 'Pour les professionnels',
      features: [
        '50 documents/mois',
        'Tous les modèles',
        'Support prioritaire',
        'Export PDF/Word',
        'Personnalisation',
      ],
      buttonText: 'Essai gratuit 7 jours',
      popular: true,
    },
    {
      name: 'Entreprise',
      price: '49',
      period: '/mois',
      description: 'Pour les équipes',
      features: [
        'Documents illimités',
        'Tous les modèles',
        'Support 24/7',
        'Export PDF/Word',
        'Personnalisation avancée',
        'API d\'intégration',
      ],
      buttonText: 'Nous contacter',
      popular: false,
    },
  ];

  return (
    <Box bg={bgColor} minH="calc(100vh - 64px)" display="flex" alignItems="center">
      <Container maxW="7xl" py={8} as={Stack} spacing={8}>
        <Stack spacing={3} textAlign="center" maxW="3xl" mx="auto">
          <Text color="blue.500" fontWeight={600} fontSize="md">
            Tarification
          </Text>
          <Heading as="h1" size="xl" fontWeight="bold">
            Des forfaits adaptés à vos besoins
          </Heading>
          <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.400')}>
            Choisissez le forfait qui correspond le mieux à vos besoins.
          </Text>
        </Stack>

        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
          gap={6}
          px={{ base: 2, md: 0 }}
          alignItems="stretch"
        >
          {plans.map((plan, index) => (
            <GridItem key={index} colSpan={1}>
              <Box
                bg={cardBg}
                p={6}
                h="100%"
                rounded="xl"
                shadow="md"
                borderWidth={plan.popular ? '2px' : '1px'}
                borderColor={plan.popular ? 'blue.500' : 'gray.200'}
                position="relative"
                display="flex"
                flexDirection="column"
                _hover={{
                  transform: 'translateY(-3px)',
                  boxShadow: 'lg',
                  transition: 'all 0.2s',
                }}
              >
                {plan.popular && (
                  <Box
                    position="absolute"
                    top={-3}
                    right={4}
                    bg="blue.500"
                    color="white"
                    px={3}
                    py={1}
                    rounded="full"
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    Populaire
                  </Box>
                )}
                <VStack spacing={4} align="stretch" h="100%">
                  <Box>
                    <Text fontWeight="bold" fontSize="xl">
                      {plan.name}
                    </Text>
                    <Text color={useColorModeValue('gray.600', 'gray.400')}>
                      {plan.description}
                    </Text>
                  </Box>
                  <Box>
                    <Flex align="baseline">
                      <Text fontSize="4xl" fontWeight="bold">
                        {plan.price}
                      </Text>
                      <Text color={useColorModeValue('gray.600', 'gray.400')}>
                        {plan.period}
                      </Text>
                    </Flex>
                  </Box>
                  <Box flexGrow={1} mt={2}>
                    <List spacing={2} mt={2}>
                      {plan.features.map((feature, i) => (
                        <ListItem key={i} display="flex" alignItems="flex-start">
                          <ListIcon as={CheckIcon} color="green.500" mt={1} />
                          <Text fontSize="sm">{feature}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  <Button
                    colorScheme={plan.popular ? 'blue' : 'gray'}
                    size="md"
                    w="full"
                    mt={4}
                    onClick={() => {
                      if (plan.name === 'Pro') {
                        // Rediriger vers la page de paiement ou d'inscription
                        console.log('Souscrire à Pro');
                      } else if (plan.name === 'Starter') {
                        navigate('/register');
                      } else {
                        // Contact pour l'entreprise
                        console.log('Contact entreprise');
                      }
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                </VStack>
              </Box>
            </GridItem>
          ))}
        </Grid>

        <Box textAlign="center" mt={4}>
          <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="sm">
            Besoin d'une solution personnalisée ?{' '}
            <Text 
              as="span" 
              color="blue.500" 
              fontWeight="medium" 
              cursor="pointer"
              onClick={() => navigate('/contact')}
              _hover={{ textDecoration: 'underline' }}
            >
              Contactez-nous
            </Text>
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default PricingPage;

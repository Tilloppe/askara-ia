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
    <Box bg={bgColor} minH="100vh" py={20}>
      <Container maxW="7xl" py={16} as={Stack} spacing={12}>
        <Stack spacing={4} textAlign="center" maxW="4xl" mx="auto">
          <Text color="blue.500" fontWeight={600} fontSize="lg">
            Tarification
          </Text>
          <Heading as="h1" size="2xl" fontWeight="bold">
            Des forfaits adaptés à vos besoins
          </Heading>
          <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
            Choisissez le forfait qui correspond le mieux à vos besoins. Commencez gratuitement ou profitez de notre essai de 7 jours.
          </Text>
        </Stack>

        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
          gap={8}
          px={{ base: 4, md: 0 }}
        >
          {plans.map((plan, index) => (
            <GridItem key={index} colSpan={1}>
              <Box
                bg={cardBg}
                p={8}
                rounded="xl"
                shadow="lg"
                borderWidth={plan.popular ? '2px' : '1px'}
                borderColor={plan.popular ? 'blue.500' : 'gray.200'}
                position="relative"
                _hover={{
                  transform: 'translateY(-5px)',
                  transition: 'all 0.3s',
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
                  <Box flexGrow={1}>
                    <List spacing={3} mt={4}>
                      {plan.features.map((feature, i) => (
                        <ListItem key={i} display="flex" alignItems="center">
                          <ListIcon as={CheckIcon} color="green.500" />
                          <Text>{feature}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  <Button
                    colorScheme={plan.popular ? 'blue' : 'gray'}
                    size="lg"
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

        <Box textAlign="center" mt={8}>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            Vous avez besoin d'une solution personnalisée ?{' '}
            <Text as="span" color="blue.500" fontWeight="medium" cursor="pointer">
              Contactez-nous
            </Text>
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default PricingPage;

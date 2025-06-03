import { Box, Button, Heading, Text, VStack, Container, Image } from '@chakra-ui/react';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={8} textAlign="center">
        <Box>
          <Heading size="2xl" fontWeight="extrabold" mb={4}>
            404
          </Heading>
          <Text fontSize="xl" color="gray.600" mb={8}>
            Oups ! La page que vous recherchez est introuvable.
          </Text>
          <Image
            src="/illustrations/404.svg"
            alt="Page non trouvée"
            maxW="400px"
            mx="auto"
            mb={8}
          />
          <Text color="gray.500" mb={8}>
            La page que vous essayez d'atteindre n'existe pas ou a été déplacée.
            Essayez de revenir à la page d'accueil ou utilisez la barre de recherche.
          </Text>
        </Box>
        
        <HStack spacing={4}>
          <Button
            leftIcon={<FiArrowLeft />}
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>
          <Button
            leftIcon={<FiHome />}
            colorScheme="blue"
            onClick={() => navigate('/')}
          >
            Page d'accueil
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
};

export default NotFound;

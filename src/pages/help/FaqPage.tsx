import React from 'react';
import {
  VStack,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  useColorModeValue,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import HelpLayout from '../../components/help/HelpLayout';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FaqPage: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Données de la FAQ (à remplacer par des données réelles plus tard)
  const faqItems: FaqItem[] = [
    {
      question: 'Comment créer un nouveau document ?',
      answer: 'Pour créer un nouveau document, allez dans la section "Documents" et cliquez sur le bouton "Nouveau document". Suivez ensuite les étapes pour personnaliser votre document.',
      category: 'Documents'
    },
    {
      question: 'Comment partager un document avec un collègue ?',
      answer: 'Ouvrez le document que vous souhaitez partager, cliquez sur le bouton "Partager" et entrez l\'adresse email de votre collègue. Vous pouvez définir des permissions de lecture ou d\'édition.',
      category: 'Partage'
    },
    {
      question: 'Quels sont les formats de fichiers supportés ?',
      answer: 'Nous supportons les formats suivants : DOCX, PDF, TXT, et ODT. Les fichiers ne doivent pas dépasser 10 Mo.',
      category: 'Fichiers'
    },
    {
      question: 'Comment mettre à jour mes informations de facturation ?',
      answer: 'Allez dans les paramètres de votre compte, puis dans la section "Facturation". Vous pourrez y mettre à jour vos informations de paiement.',
      category: 'Facturation'
    },
    {
      question: 'Comment supprimer mon compte ?',
      answer: 'Pour supprimer votre compte, allez dans les paramètres, faites défiler jusqu\'à la section "Supprimer mon compte" et suivez les instructions. Attention, cette action est irréversible.',
      category: 'Compte'
    }
  ];

  const categories = [...new Set(faqItems.map(item => item.category))];

  return (
    <HelpLayout
      title="Foire aux questions"
      description="Trouvez des réponses aux questions les plus fréquemment posées"
      breadcrumbItems={[
        { label: 'FAQ', href: '/help/faq', isCurrentPage: true }
      ]}
    >
      <VStack spacing={8} align="stretch">
        {/* Barre de recherche */}
        <Box>
          <InputGroup size="lg" maxW="xl">
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.300" />
            </InputLeftElement>
            <Input 
              placeholder="Rechercher dans la FAQ..." 
              bg={bgColor}
              borderColor={borderColor}
              _hover={{ borderColor: 'gray.300' }}
            />
          </InputGroup>
        </Box>

        {/* Catégories */}
        <Box>
          <Heading size="md" mb={4}>Catégories</Heading>
          <SimpleGrid columns={[2, 3, 4]} spacing={4}>
            {categories.map((category, index) => (
              <Box 
                key={index}
                p={4} 
                bg={bgColor} 
                borderRadius="md" 
                border="1px" 
                borderColor={borderColor}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'md',
                  cursor: 'pointer'
                }}
                transition="all 0.2s"
              >
                <Text fontWeight="medium">{category}</Text>
                <Text fontSize="sm" color="gray.500">
                  {faqItems.filter(item => item.category === category).length} questions
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Liste des questions */}
        <Box>
          <Heading size="md" mb={4}>Questions fréquentes</Heading>
          <Accordion allowToggle>
            {faqItems.map((item, index) => (
              <AccordionItem key={index} borderColor={borderColor} mb={2}>
                <h3>
                  <AccordionButton 
                    _expanded={{ bg: useColorModeValue('blue.50', 'blue.900') }}
                    py={4}
                  >
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="medium">{item.question}</Text>
                      <Text fontSize="sm" color="gray.500">{item.category}</Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h3>
                <AccordionPanel pb={4} bg={bgColor}>
                  {item.answer}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>

        {/* Section d'aide supplémentaire */}
        <Box 
          bg={useColorModeValue('blue.50', 'blue.900')} 
          p={6} 
          borderRadius="lg"
          mt={8}
        >
          <VStack spacing={4} align="center" textAlign="center">
            <Heading size="md">Vous ne trouvez pas de réponse à votre question ?</Heading>
            <Text>
              Notre équipe de support est là pour vous aider. Contactez-nous et nous vous répondrons dans les plus brefs délais.
            </Text>
            <Box 
              as="button"
              bg={useColorModeValue('blue.600', 'blue.500')}
              color="white"
              px={6}
              py={2}
              borderRadius="md"
              _hover={{
                bg: useColorModeValue('blue.700', 'blue.600'),
                transform: 'translateY(-2px)'
              }}
              transition="all 0.2s"
            >
              Contacter le support
            </Box>
          </VStack>
        </Box>
      </VStack>
    </HelpLayout>
  );
};

export default FaqPage;

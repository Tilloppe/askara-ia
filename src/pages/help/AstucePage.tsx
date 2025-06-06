import React from 'react';
import { VStack, Heading, Text, Box, SimpleGrid, Tag, TagLabel, TagLeftIcon, useColorModeValue, Link as ChakraLink, Icon } from '@chakra-ui/react';
import { FaLightbulb, FaKeyboard, FaMousePointer, FaSearch, FaClock, FaChartLine } from 'react-icons/fa';
import { MdSpeed, MdOutlineTipsAndUpdates, MdOutlineSecurity } from 'react-icons/md';
import HelpCategoryLayout from '../../components/help/HelpCategoryLayout';

interface TipCardProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  tags: string[];
}

const TipCard: React.FC<TipCardProps> = ({ icon, title, description, tags }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const tagBg = useColorModeValue('yellow.100', 'yellow.900');
  const tagColor = useColorModeValue('yellow.800', 'yellow.100');

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'lg',
      }}
      transition="all 0.2s"
      height="100%"
    >
      <Icon as={icon} boxSize={8} color="yellow.500" mb={4} />
      <Heading size="md" mb={3}>{title}</Heading>
      <Text mb={4} color={useColorModeValue('gray.600', 'gray.300')}>
        {description}
      </Text>
      <Box>
        {tags.map((tag, index) => (
          <Tag
            key={index}
            size="sm"
            mr={2}
            mb={2}
            bg={tagBg}
            color={tagColor}
            borderRadius="full"
          >
            {tag}
          </Tag>
        ))}
      </Box>
    </Box>
  );
};

const AstucePage: React.FC = () => {
  const tips = [
    {
      icon: FaKeyboard,
      title: 'Raccourcis clavier',
      description: 'Utilisez Ctrl+K (ou Cmd+K sur Mac) pour ouvrir rapidement la barre de commande et accéder à n\'importe quelle fonctionnalité.',
      tags: ['Productivité', 'Raccourcis']
    },
    {
      icon: FaMousePointer,
      title: 'Sélection rapide',
      description: 'Double-cliquez sur un mot pour le sélectionner, triple-cliquez pour sélectionner toute la ligne.',
      tags: ['Édition', 'Astuce']
    },
    {
      icon: FaSearch,
      title: 'Recherche avancée',
      description: 'Utilisez les opérateurs booléens (AND, OR, NOT) dans la recherche pour affiner vos résultats.',
      tags: ['Recherche', 'Astuce']
    },
    {
      icon: FaClock,
      title: 'Sauvegarde automatique',
      description: 'Activez la sauvegarde automatique pour ne jamais perdre votre travail en cas de problème.',
      tags: ['Sécurité', 'Astuce']
    },
    {
      icon: FaChartLine,
      title: 'Suivi des performances',
      description: 'Utilisez le tableau de bord pour identifier les goulots d\'étranglement dans votre flux de travail.',
      tags: ['Performance', 'Analyse']
    },
    {
      icon: MdOutlineSecurity,
      title: 'Sécurité renforcée',
      description: 'Activez l\'authentification à deux facteurs pour une protection supplémentaire de votre compte.',
      tags: ['Sécurité', 'Astuce']
    }
  ];

  return (
    <HelpCategoryLayout
      title="Astuces & Conseils"
      description="Découvrez des astuces pour optimiser votre utilisation de la plateforme"
      icon={<FaLightbulb />}
      colorScheme="yellow"
    >
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={4}>Astuces pour gagner du temps</Heading>
          <Text color={useColorModeValue('gray.600', 'gray.300')}>
            Découvrez des astuces et conseils pour optimiser votre flux de travail et tirer le meilleur parti de nos outils.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {tips.map((tip, index) => (
            <TipCard
              key={index}
              icon={tip.icon}
              title={tip.title}
              description={tip.description}
              tags={tip.tags}
            />
          ))}
        </SimpleGrid>

        <Box bg="yellow.50" p={6} borderRadius="lg" borderLeft="4px solid" borderColor="yellow.400">
          <Heading size="md" mb={3} color="yellow.800" display="flex" alignItems="center">
            <Icon as={MdOutlineTipsAndUpdates} mr={2} />
            Le saviez-vous ?
          </Heading>
          <Text color="yellow.800" mb={3}>
            Notre équipe publie régulièrement de nouvelles astuces sur notre blog. Abonnez-vous à notre newsletter pour ne rien manquer !
          </Text>
          <ChakraLink 
            href="#" 
            color="yellow.700" 
            fontWeight="medium"
            textDecoration="underline"
            _hover={{ color: 'yellow.900' }}
          >
            S'abonner à la newsletter →
          </ChakraLink>
        </Box>
      </VStack>
    </HelpCategoryLayout>
  );
};

export default AstucePage;

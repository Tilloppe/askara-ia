import { Box, Container, VStack, Heading, Text, Link, List, ListItem, ListIcon, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useColorModeValue } from '@chakra-ui/react';
import { CheckCircleIcon, ExternalLinkIcon } from '@chakra-ui/icons';

const DocumentationPage = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} minH="calc(100vh - 64px)" py={8}>
      <Container maxW="6xl">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={4} color={useColorModeValue('brand.600', 'brand.400')}>
              Documentation Complète
            </Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
              Guide d'utilisation d'Askara Audio IA
            </Text>
          </Box>

          {/* Table des matières */}
          <Box bg={bgColor} p={6} rounded="xl" shadow="md" borderWidth="1px" borderColor={borderColor}>
            <Heading as="h2" size="lg" mb={4} color={useColorModeValue('brand.600', 'brand.400')}>
              Table des matières
            </Heading>
            <List spacing={2}>
              {['Introduction', 'Gestion des patients', 'Création de documents', 'Reconnaissance vocale', 'FAQ'].map((item) => (
                <ListItem key={item} display="flex" alignItems="center">
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  <Link href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} color="blue.500" _hover={{ textDecoration: 'underline' }}>
                    {item}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Section Introduction */}
          <Box id="introduction" bg={bgColor} p={6} rounded="xl" shadow="md" borderWidth="1px" borderColor={borderColor}>
            <Heading as="h2" size="lg" mb={4} color={useColorModeValue('brand.600', 'brand.400')}>
              Introduction
            </Heading>
            <Text mb={4}>
              Bienvenue dans Askara Audio IA, votre solution de création de documents médicaux assistée par IA. Cette documentation vous guidera à travers les fonctionnalités clés de l'application.
            </Text>
          </Box>

          {/* Section Gestion des patients */}
          <Box id="gestion-des-patients" bg={bgColor} p={6} rounded="xl" shadow="md" borderWidth="1px" borderColor={borderColor}>
            <Heading as="h2" size="lg" mb={4} color={useColorModeValue('brand.600', 'brand.400')}>
              Gestion des patients
            </Heading>
            <Text mb={4}>Ajoutez et gérez facilement vos patients :</Text>
            <List spacing={2} mb={4}>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Accédez à la liste des patients via le menu principal
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Ajoutez de nouveaux patients avec leurs informations médicales
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <ListIcon as={CheckCircleIcon} color="green.500" />
                Consultez et modifiez les dossiers existants
              </ListItem>
            </List>
          </Box>

          {/* Section Création de documents */}
          <Box id="creation-de-documents" bg={bgColor} p={6} rounded="xl" shadow="md" borderWidth="1px" borderColor={borderColor}>
            <Heading as="h2" size="lg" mb={4} color={useColorModeValue('brand.600', 'brand.400')}>
              Création de documents
            </Heading>
            <Text mb={4}>Créez des documents médicaux en quelques étapes :</Text>
            <List spacing={2} mb={4}>
              <ListItem>1. Sélectionnez un modèle de document</ListItem>
              <ListItem>2. Remplissez les champs requis</ListItem>
              <ListItem>3. Utilisez la reconnaissance vocale pour gagner du temps</ListItem>
              <ListItem>4. Enregistrez ou exportez le document</ListItem>
            </List>
          </Box>

          {/* Section Reconnaissance vocale */}
          <Box id="reconnaissance-vocale" bg={bgColor} p={6} rounded="xl" shadow="md" borderWidth="1px" borderColor={borderColor}>
            <Heading as="h2" size="lg" mb={4} color={useColorModeValue('brand.600', 'brand.400')}>
              Reconnaissance vocale
            </Heading>
            <Text mb={4}>Utilisez votre voix pour créer des documents :</Text>
            <List spacing={2} mb={4}>
              <ListItem>• Cliquez sur l'icône du micro dans un champ de texte</ListItem>
              <ListItem>• Parlez clairement et distinctement</ListItem>
              <ListItem>• Le texte apparaît automatiquement</ListItem>
              <ListItem>• Corrigez si nécessaire avec le clavier</ListItem>
            </List>
          </Box>

          {/* Section FAQ */}
          <Box id="faq" bg={bgColor} p={6} rounded="xl" shadow="md" borderWidth="1px" borderColor={borderColor}>
            <Heading as="h2" size="lg" mb={4} color={useColorModeValue('brand.600', 'brand.400')}>
              Foire aux questions
            </Heading>
            <Accordion allowToggle>
              <AccordionItem border="none" mb={2}>
                <AccordionButton _expanded={{ bg: 'gray.100' }} p={3} rounded="md">
                  <Box flex="1" textAlign="left">Comment modifier un document existant ?</Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  Allez dans la section "Documents", trouvez le document et cliquez sur l'icône de modification.
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem border="none" mb={2}>
                <AccordionButton _expanded={{ bg: 'gray.100' }} p={3} rounded="md">
                  <Box flex="1" textAlign="left">Comment partager un document ?</Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  Dans la vue du document, cliquez sur "Partager" et entrez l'email du destinataire.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>

          {/* Pied de page */}
          <Box textAlign="center" mt={8} color={useColorModeValue('gray.600', 'gray.400')}>
            <Text>Besoin d'aide supplémentaire ? Contactez notre support à <Link href="mailto:support@askara-audio.com" color="blue.500">support@askara-audio.com</Link></Text>
            <Text mt={2}>© {new Date().getFullYear()} Askara Audio IA. Tous droits réservés.</Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default DocumentationPage;

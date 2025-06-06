import React from 'react';
import { VStack, Heading, Text, Box, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, List, ListItem, ListIcon, Link as ChakraLink, Alert, AlertIcon } from '@chakra-ui/react';
import { FaTools, FaVolumeUp, FaSync, FaExclamationTriangle, FaHeadphones } from 'react-icons/fa';
import HelpCategoryLayout from '../../components/help/HelpCategoryLayout';

const DepannagePage: React.FC = () => {
  return (
    <HelpCategoryLayout
      title="Dépannage"
      description="Résolvez rapidement les problèmes techniques courants"
      icon={<FaTools />}
      colorScheme="red"
    >
      <VStack spacing={6} align="stretch">
        <Alert status="info" borderRadius="md" variant="left-accent">
          <AlertIcon />
          Avant de contacter le support, consultez ces solutions aux problèmes les plus courants.
        </Alert>

        <Box>
          <Heading size="lg" mb={4}>Problèmes courants</Heading>
          <Text mb={4}>
            Sélectionnez un problème ci-dessous pour afficher les étapes de résolution.
          </Text>
        </Box>

        <Accordion allowToggle>
          <AccordionItem border="1px" borderColor="gray.200" borderRadius="md" mb={3} overflow="hidden">
            <h2>
              <AccordionButton _expanded={{ bg: 'red.50' }}>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  <ListIcon as={FaVolumeUp} color="red.500" mr={2} display="inline-block" />
                  Pas de son ou son déformé
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} bg="white">
              <List spacing={3}>
                <ListItem>
                  <Text fontWeight="medium">1. Vérifiez les branchements</Text>
                  <Text>Assurez-vous que vos haut-parleurs ou écouteurs sont correctement branchés.</Text>
                </ListItem>
                <ListItem>
                  <Text fontWeight="medium">2. Vérifiez le volume</Text>
                  <Text>Assurez-vous que le volume n'est pas coupé ou trop bas sur votre appareil.</Text>
                </ListItem>
                <ListItem>
                  <Text fontWeight="medium">3. Mettez à jour les pilotes audio</Text>
                  <Text>Les pilotes obsolètes peuvent causer des problèmes de son.</Text>
                </ListItem>
              </List>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem border="1px" borderColor="gray.200" borderRadius="md" mb={3} overflow="hidden">
            <h2>
              <AccordionButton _expanded={{ bg: 'red.50' }}>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  <ListIcon as={FaSync} color="red.500" mr={2} display="inline-block" />
                  L'application se fige ou plante
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} bg="white">
              <List spacing={3}>
                <ListItem>
                  <Text fontWeight="medium">1. Redémarrez l'application</Text>
                  <Text>Fermez complètement l'application et rouvrez-la.</Text>
                </ListItem>
                <ListItem>
                  <Text fontWeight="medium">2. Vérifiez les mises à jour</Text>
                  <Text>Assurez-vous d'avoir la dernière version de l'application.</Text>
                </ListItem>
                <ListItem>
                  <Text fontWeight="medium">3. Vérifiez les ressources système</Text>
                  <Text>Fermez les applications inutiles pour libérer de la mémoire.</Text>
                </ListItem>
              </List>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem border="1px" borderColor="gray.200" borderRadius="md" mb={3} overflow="hidden">
            <h2>
              <AccordionButton _expanded={{ bg: 'red.50' }}>
                <Box flex="1" textAlign="left" fontWeight="medium">
                  <ListIcon as={FaExclamationTriangle} color="red.500" mr={2} display="inline-block" />
                  Erreurs de connexion
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4} bg="white">
              <List spacing={3}>
                <ListItem>
                  <Text fontWeight="medium">1. Vérifiez votre connexion Internet</Text>
                  <Text>Assurez-vous que vous êtes connecté à Internet.</Text>
                </ListItem>
                <ListItem>
                  <Text fontWeight="medium">2. Vérifiez vos identifiants</Text>
                  <Text>Assurez-vous d'utiliser les bonnes informations de connexion.</Text>
                </ListItem>
                <ListItem>
                  <Text fontWeight="medium">3. Réinitialisez votre mot de passe</Text>
                  <Text>Si nécessaire, utilisez la fonction de réinitialisation de mot de passe.</Text>
                </ListItem>
              </List>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Box bg="red.50" p={4} borderRadius="md" borderLeft="4px solid" borderColor="red.500">
          <Heading size="sm" mb={2} color="red.800">Solution rapide</Heading>
          <Text color="red.700" mb={3}>
            Essayez ces étapes rapides pour résoudre les problèmes courants :
          </Text>
          <List spacing={2}>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={FaSync} color="red.500" />
              Redémarrez l'application
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={FaHeadphones} color="red.500" />
              Vérifiez les connexions audio
            </ListItem>
            <ListItem display="flex" alignItems="center">
              <ListIcon as={FaExclamationTriangle} color="red.500" />
              Mettez à jour vers la dernière version
            </ListItem>
          </List>
        </Box>
      </VStack>
    </HelpCategoryLayout>
  );
};

export default DepannagePage;

import { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  VStack, 
  HStack, 
  Text, 
  Button, 
  useToast,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useBreakpointValue,
  IconButton,
  Tooltip,
  Container
} from '@chakra-ui/react';

// Import des icônes depuis le fichier centralisé
import {
  // Icônes de base
  ArrowLeftIcon,
  ArrowRightIcon,
  ChatIcon,
  AtSignIcon,
  AttachmentIcon,
  CopyIcon,
  NotAllowedIcon,
  LockIcon,
  UnlockIcon,
  ViewOffIcon,
  InfoOutlineIcon,
  // Alias pour compatibilité
  FiSave,
  FiRotateCw,
  FiEye,
  FiMaximize2,
  FiMinimize2,
  FiSettings,
  FiFileText,
  FiCheck,
  FiX,
  ViewIcon
} from '../components/ui/icons';

// Alias pour compatibilité avec le code existant
const DocumentIcon = FiFileText; // Alias pour DocumentIcon
const FiSaveIcon = FiSave; // Alias pour FiSaveIcon
const SaveIcon = FiSave; // Alias pour SaveIcon
const MinusIcon = FiMinimize2; // Alias pour MinusIcon
const RepeatIcon = FiRotateCw; // Alias pour RepeatIcon
const SettingsIcon = FiSettings; // Alias pour SettingsIcon
const ExternalLinkIcon = FiMaximize2; // Alias pour ExternalLinkIcon

// Alias pour les icônes utilisées dans le composant
const FiArrowLeft = ArrowLeftIcon;
const FiArrowRight = ArrowRightIcon;
const FiMessageSquare = ChatIcon;
const FiAtSign = AtSignIcon;
const FiPaperclip = AttachmentIcon;
const FiCopy = CopyIcon;
const FiNotAllowed = NotAllowedIcon;
const FiLock = LockIcon;
const FiUnlock = UnlockIcon;
const FiEyeOff = ViewOffIcon;
const FiInfoOutline = InfoOutlineIcon;

import { defaultCustomization, type DocumentCustomization } from '../types/documentCustomization';
import HeaderForm from '../components/document/HeaderForm';
import FooterForm from '../components/document/FooterForm';
import AppearanceForm from '../components/document/AppearanceForm';
import DocumentPreview from '../components/document/DocumentPreview';

const STORAGE_KEY = 'askara_document_customization';

// Composant principal de personnalisation des documents
const DocumentCustomization = () => {
  const [customization, setCustomization] = useState<DocumentCustomization>(defaultCustomization);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const toast = useToast();
  const { isOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Charger la personnalisation depuis le stockage local
  useEffect(() => {
    try {
      const savedCustomization = localStorage.getItem(STORAGE_KEY);
      if (savedCustomization) {
        setCustomization(JSON.parse(savedCustomization));
      }
      
      // Restaurer l'onglet actif
      const savedTab = localStorage.getItem(`${STORAGE_KEY}_active_tab`);
      if (savedTab) {
        setActiveTab(parseInt(savedTab, 10));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les préférences enregistrées.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  // Mettre à jour l'état des modifications non sauvegardées
  useEffect(() => {
    const savedCustomization = localStorage.getItem(STORAGE_KEY);
    const savedData = savedCustomization ? JSON.parse(savedCustomization) : null;
    setHasChanges(JSON.stringify(savedData) !== JSON.stringify(customization));
  }, [customization]);

  // Gérer le changement d'onglet
  const handleTabChange = (index: number) => {
    setActiveTab(index);
    localStorage.setItem(`${STORAGE_KEY}_active_tab`, index.toString());
  };

  // Mettre à jour une section de la personnalisation
  const updateCustomization = <K extends keyof DocumentCustomization>(
    section: K,
    updates: Partial<DocumentCustomization[K]>
  ) => {
    setCustomization(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates
      }
    }));
  };

  // Sauvegarder les modifications
  const handleSave = useCallback(() => {
    setIsLoading(true);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customization));
      setHasChanges(false);
      
      toast({
        title: 'Paramètres enregistrés',
        description: 'Vos préférences de document ont été enregistrées avec succès.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde des paramètres.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    } finally {
      setIsLoading(false);
    }
  }, [customization, toast]);

  // Réinitialiser aux valeurs par défaut
  const handleReset = useCallback(() => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ? Cette action est irréversible.')) {
      setCustomization(defaultCustomization);
      localStorage.removeItem(STORAGE_KEY);
      setHasChanges(true);
      
      toast({
        title: 'Paramètres réinitialisés',
        description: 'Tous les paramètres ont été réinitialisés aux valeurs par défaut.',
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
    }
  }, [toast]);

  // Toggle du mode plein écran pour l'aperçu
  const toggleFullscreenPreview = () => {
    setIsPreviewFullscreen(!isPreviewFullscreen);
  };

  // Contenu de l'aperçu
  const previewContent = (
    <DocumentPreview 
      header={customization.header} 
      footer={customization.footer} 
      styles={customization.styles} 
    />
  );

  // Si en mode plein écran, afficher uniquement l'aperçu
  if (isPreviewFullscreen) {
    return (
      <Box position="fixed" top={0} left={0} right={0} bottom={0} bg="white" zIndex={1000} overflow="auto">
        <Box position="fixed" top={4} right={4} zIndex={1001}>
          <HStack spacing={2}>
            <Tooltip label="Quitter le mode plein écran">
              <IconButton
                aria-label="Quitter le mode plein écran"
                icon={<MinusIcon />}
                onClick={toggleFullscreenPreview}
                colorScheme="blue"
                size="sm"
              />
            </Tooltip>
          </HStack>
        </Box>
        <Box p={8} pt={16}>
          {previewContent}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
        {/* En-tête de la page */}
        <Box 
          bg="white" 
          p={6} 
          borderRadius="lg" 
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.200"
        >
          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <VStack align="flex-start" spacing={1}>
              <Heading as="h1" size="lg">Personnalisation des documents</Heading>
              <Text color="gray.500">
                Personnalisez l'apparence des en-têtes et pieds de page de vos documents
              </Text>
            </VStack>
            <HStack spacing={3} flexWrap="wrap" justify={{ base: 'flex-start', md: 'flex-end' }}>
              <Button
                leftIcon={<RepeatIcon />}
                variant="outline"
                onClick={handleReset}
                isDisabled={isLoading}
                size={{ base: 'sm', md: 'md' }}
              >
                {isMobile ? 'Réinit.' : 'Réinitialiser'}
              </Button>
              <Button
                leftIcon={<SaveIcon />}
                colorScheme="blue"
                onClick={handleSave}
                isLoading={isLoading}
                loadingText="Enregistrement..."
                size={{ base: 'sm', md: 'md' }}
              >
                {isMobile ? 'Enreg.' : 'Enregistrer'}
              </Button>
              {hasChanges && (
                <Text fontSize="sm" color="orange.500" ml={2}>
                  Modifications non enregistrées
                </Text>
              )}
            </HStack>
          </HStack>
        </Box>

        {/* Contenu principal avec onglets */}
        <Box 
          bg="white" 
          borderRadius="lg" 
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.200"
          overflow="hidden"
        >
          <Tabs 
            variant="enclosed" 
            colorScheme="blue" 
            isLazy 
            index={activeTab}
            onChange={handleTabChange}
          >
            <TabList borderBottomWidth="1px" borderColor="gray.200">
              <Tab 
                fontWeight="medium" 
                _selected={{ color: 'blue.500', borderBottomColor: 'blue.500' }}
                fontSize={{ base: 'sm', md: 'md' }}
              >
                <HStack spacing={2}>
                  <DocumentIcon />
                  <Text display={{ base: 'none', sm: 'block' }}>En-tête</Text>
                </HStack>
              </Tab>
              <Tab 
                fontWeight="medium"
                _selected={{ color: 'blue.500', borderBottomColor: 'blue.500' }}
                fontSize={{ base: 'sm', md: 'md' }}
              >
                <HStack spacing={2}>
                  <DocumentIcon />
                  <Text display={{ base: 'none', sm: 'block' }}>Pied de page</Text>
                </HStack>
              </Tab>
              <Tab 
                fontWeight="medium"
                _selected={{ color: 'blue.500', borderBottomColor: 'blue.500' }}
                fontSize={{ base: 'sm', md: 'md' }}
              >
                <HStack spacing={2}>
                  <SettingsIcon />
                  <Text display={{ base: 'none', sm: 'block' }}>Apparence</Text>
                </HStack>
              </Tab>
              <Tab 
                fontWeight="medium"
                _selected={{ color: 'blue.500', borderBottomColor: 'blue.500' }}
                fontSize={{ base: 'sm', md: 'md' }}
              >
                <HStack spacing={2}>
                  <ViewIcon />
                  <Text display={{ base: 'none', sm: 'block' }}>Aperçu</Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels p={{ base: 4, md: 6 }}>
              <TabPanel px={0}>
                <HeaderForm 
                  header={customization.header} 
                  onChange={(updates: Partial<DocumentCustomization['header']>) => updateCustomization('header', updates)} 
                />
              </TabPanel>
              <TabPanel px={0}>
                <FooterForm 
                  footer={customization.footer} 
                  onChange={(updates: Partial<DocumentCustomization['footer']>) => updateCustomization('footer', updates)} 
                />
              </TabPanel>
              <TabPanel px={0}>
                <AppearanceForm 
                  styles={customization.styles} 
                  onChange={(updates: Partial<DocumentCustomization['styles']>) => updateCustomization('styles', updates)} 
                />
              </TabPanel>
              <TabPanel px={0}>
                <Box position="relative">
                  <Tooltip label="Plein écran">
                    <IconButton
                      aria-label="Afficher en plein écran"
                      icon={<ExternalLinkIcon />}
                      onClick={toggleFullscreenPreview}
                      position="absolute"
                      top={2}
                      right={2}
                      zIndex={10}
                      size="sm"
                      variant="ghost"
                    />
                  </Tooltip>
                  {previewContent}
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
      </Container>

      {/* Boutons flottants pour mobile */}
      <Box 
        display={{ base: 'block', md: 'none' }} 
        position="fixed"
        bottom={4}
        left={4}
        right={4}
        zIndex={10}
      >
        <HStack 
          bg="white" 
          p={3} 
          borderRadius="lg" 
          boxShadow="lg" 
          justify="space-between"
          border="1px solid"
          borderColor="gray.200"
        >
          <Button
            leftIcon={<FiRotateCw />}
            variant="outline"
            onClick={handleReset}
            isDisabled={isLoading}
            size="sm"
            flex={1}
          >
            Réinit.
          </Button>
          <Button
            leftIcon={<FiSave />}
            colorScheme="blue"
            onClick={handleSave}
            isLoading={isLoading}
            loadingText="..."
            size="sm"
            flex={1}
          >
            Enregistrer
          </Button>
        </HStack>
      </Box>

      {/* Modal de confirmation de sortie si modifications non enregistrées */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modifications non enregistrées</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Vous avez des modifications non enregistrées. Voulez-vous les enregistrer avant de quitter ?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Annuler
            </Button>
            <Button variant="outline" colorScheme="red" mr={3} onClick={() => {
              handleReset();
              onClose();
            }}>
              Ignorer
            </Button>
            <Button colorScheme="blue" onClick={() => {
              handleSave();
              onClose();
            }}>
              Enregistrer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DocumentCustomization;

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  useColorModeValue,
  Image,
  Container,
  Skeleton,
  useToast,
  IconButton,
  Tooltip,
  Spinner,
  UnorderedList,
  ListItem
} from '@chakra-ui/react';
import { RepeatIcon, WarningIcon } from '@chakra-ui/icons';
import type { DocumentCustomization } from '../../types/documentCustomization';

interface DocumentPreviewProps {
  header: DocumentCustomization['header'];
  footer: DocumentCustomization['footer'];
  styles: DocumentCustomization['styles'];
}

const getAlignmentStyle = (alignment: 'left' | 'center' | 'right') => {
  switch (alignment) {
    case 'left':
      return { alignItems: 'flex-start', textAlign: 'left' as const };
    case 'center':
      return { alignItems: 'center', textAlign: 'center' as const };
    case 'right':
      return { alignItems: 'flex-end', textAlign: 'right' as const };
    default:
      return { alignItems: 'flex-start', textAlign: 'left' as const };
  }
};

const PreviewHeader: React.FC<{ header: DocumentCustomization['header'] }> = ({ header }) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const toast = useToast();

  if (!header.showLogo && !header.showTitle && !header.showContact) {
    return null;
  }

  const alignment = getAlignmentStyle(header.alignment);
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.300');

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
    toast({
      title: "Erreur de chargement de l'image",
      description: "Impossible de charger l'image du logo",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageError(false);
    setIsImageLoading(true);
  };

  return (
    <Box 
      borderBottom="1px solid" 
      borderColor={borderColor}
      pb={4} 
      mb={6}
    >
      <VStack spacing={3} align={alignment.alignItems} w="100%">
        {header.showLogo && header.logo && (
          <Box 
            mb={3} 
            position="relative" 
            minH="60px" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
          >
            {isImageLoading && !imageError && (
              <Skeleton height="60px" width="200px" />
            )}
            {!imageError ? (
              <Image 
                src={header.logo} 
                alt="Logo" 
                maxH="60px" 
                maxW="100%"
                objectFit="contain"
                onError={handleImageError}
                onLoad={handleImageLoad}
                display={isImageLoading ? 'none' : 'block'}
              />
            ) : (
              <Box 
                border="1px dashed" 
                borderColor="red.300" 
                p={4} 
                borderRadius="md"
                textAlign="center"
              >
                <VStack spacing={2}>
                  <WarningIcon boxSize={6} color="red.500" />
                  <Text color="red.500" fontSize="sm">
                    Échec du chargement du logo
                  </Text>
                  <Tooltip label="Réessayer">
                    <IconButton
                      aria-label="Réessayer"
                      icon={<RepeatIcon />}
                      size="sm"
                      onClick={handleRetry}
                      colorScheme="red"
                      variant="ghost"
                    />
                  </Tooltip>
                </VStack>
              </Box>
            )}
          </Box>
        )}
        
        {header.showTitle && (
          <Box textAlign={alignment.textAlign}>
            <Text 
              fontSize={{ base: 'xl', md: '2xl' }} 
              fontWeight="bold"
              color={textColor}
            >
              {header.title}
            </Text>
            {header.subtitle && (
              <Text 
                fontSize={{ base: 'sm', md: 'md' }} 
                color="gray.500"
                mt={1}
              >
                {header.subtitle}
              </Text>
            )}
          </Box>
        )}
        
        {header.showContact && header.contactInfo && (
          <Text 
            fontSize="sm" 
            color="gray.500" 
            whiteSpace="pre-line"
            textAlign={alignment.textAlign}
            w="100%"
          >
            {header.contactInfo}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

const PreviewFooter: React.FC<{ 
  footer: DocumentCustomization['footer'],
  styles: DocumentCustomization['styles'] 
}> = ({ footer, styles }) => {
  if (!footer.showSignature && !footer.showContact && !footer.showLogo) {
    return null;
  }

  const alignment = getAlignmentStyle(footer.alignment);
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box 
      mt={8} 
      pt={4} 
      borderTop="1px solid" 
      borderColor={borderColor}
    >
      <VStack spacing={3} align={alignment.alignItems} w="100%">
        {(footer.showSignature && footer.signature) && (
          <Box mb={2}>
            <Image 
              src={footer.signature} 
              alt="Signature" 
              maxH="40px" 
              objectFit="contain"
            />
          </Box>
        )}
        
        {(footer.showLogo && footer.logo) && (
          <Box mb={3}>
            <Image 
              src={footer.logo} 
              alt="Logo" 
              maxH="30px" 
              objectFit="contain"
              opacity={0.8}
            />
          </Box>
        )}
        
        <Box textAlign={alignment.textAlign}>
          {footer.showContact && (
            <>
              <Text fontWeight="medium">{footer.name}</Text>
              {footer.title && (
                <Text fontSize="sm" color={textColor} fontStyle="italic">
                  {footer.title}
                </Text>
              )}
              
              <VStack spacing={0} mt={2} align={alignment.alignItems}>
                {footer.contact.phone && (
                  <Text fontSize="sm" color={textColor}>
                    {footer.contact.phone}
                  </Text>
                )}
                {footer.contact.email && (
                  <Text fontSize="sm" color={textColor}>
                    {footer.contact.email}
                  </Text>
                )}
                {footer.contact.address && (
                  <Text fontSize="sm" color={textColor} whiteSpace="pre-line">
                    {footer.contact.address}
                  </Text>
                )}
              </VStack>
            </>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ 
  header, 
  footer, 
  styles 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const toast = useToast();

  useEffect(() => {
    // Simuler un chargement pour l'exemple
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [header, footer, styles]);

  if (isLoading) {
    return (
      <Box 
        bg={bgColor} 
        borderRadius="md" 
        border="1px solid" 
        borderColor={borderColor}
        p={6}
        w="100%"
        maxW="210mm"
        minH="297mm"
        mx="auto"
        boxShadow="md"
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4} align="center">
          <Spinner size="xl" color="blue.500" />
          <Text color={textColor} fontWeight="medium">
            Chargement de l'aperçu...
          </Text>
        </VStack>
      </Box>
    );
  }
  
  return (
    <Box 
      bg={bgColor} 
      borderRadius="md" 
      border="1px solid" 
      borderColor={borderColor}
      p={{ base: 4, md: 6 }}
      w="100%"
      maxW="210mm"
      minH="297mm"
      mx="auto"
      boxShadow="md"
      position="relative"
      overflow="hidden"
    >
      <Container 
        maxW="container.md" 
        px={{ base: 2, md: 8 }}
        py={4}
        height="100%"
        display="flex"
        flexDirection="column"
      >
        <PreviewHeader header={header} />
        
        {/* Contenu du document de démonstration */}
        <Box 
          my={8} 
          flex="1"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <VStack spacing={6} align="stretch">
            <Box>
              <Text 
                fontSize={{ base: 'xl', md: '2xl' }} 
                fontWeight="bold" 
                mb={4}
                color={textColor}
              >
                Document de démonstration
              </Text>
              <Text mb={4} color={textColor} lineHeight="tall">
                Ceci est un aperçu de la mise en page de votre document. Le contenu ici est à titre d'exemple pour vous montrer comment apparaîtront vos en-têtes et pieds de page personnalisés.
              </Text>
              <Text color={textColor} lineHeight="tall">
                Vous pouvez modifier l'apparence de ce document en utilisant les onglets ci-dessus pour personnaliser l'en-tête, le pied de page et les styles globaux.
              </Text>
            </Box>

            {/* Exemple de section de document */}
            <Box mt={8}>
              <Text 
                fontSize="lg" 
                fontWeight="semibold" 
                mb={3}
                color={textColor}
                borderBottom="1px solid"
                borderColor={borderColor}
                pb={2}
              >
                Section exemple
              </Text>
              <Text color={textColor} mb={2}>
                Voici un exemple de section de document pour vous donner une meilleure idée de la mise en page.
              </Text>
              <UnorderedList color={textColor} spacing={2}>
                <ListItem>Point important 1</ListItem>
                <ListItem>Point important 2</ListItem>
                <ListItem>Point important 3</ListItem>
              </UnorderedList>
            </Box>
          </VStack>
        </Box>
        
        <Box mt="auto">
          <PreviewFooter footer={footer} styles={styles} />
        </Box>
      </Container>
    </Box>
  );
};

export default DocumentPreview;

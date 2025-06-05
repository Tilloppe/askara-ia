import React from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Divider, 
  useColorModeValue,
  Image,
  Flex,
  Spacer,
  Container
} from '@chakra-ui/react';
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
  if (!header.showLogo && !header.showTitle && !header.showContact) {
    return null;
  }

  const alignment = getAlignmentStyle(header.alignment);

  return (
    <Box 
      borderBottom="1px solid" 
      borderColor="gray.200" 
      pb={4} 
      mb={6}
    >
      <VStack spacing={2} align={alignment.alignItems} w="100%">
        {header.showLogo && header.logo && (
          <Box mb={3}>
            <Image 
              src={header.logo} 
              alt="Logo" 
              maxH="60px" 
              objectFit="contain"
            />
          </Box>
        )}
        
        {header.showTitle && (
          <Box>
            <Text fontSize="xl" fontWeight="bold">{header.title}</Text>
            {header.subtitle && (
              <Text fontSize="md" color="gray.600">{header.subtitle}</Text>
            )}
          </Box>
        )}
        
        {header.showContact && header.contactInfo && (
          <Text fontSize="sm" color="gray.600" whiteSpace="pre-line">
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
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box 
      bg={bgColor} 
      borderRadius="md" 
      border="1px solid" 
      borderColor={borderColor}
      p={6}
      w="100%"
      maxW="210mm" // Taille A4
      minH="297mm"
      mx="auto"
      boxShadow="md"
      position="relative"
    >
      <Container maxW="container.md" px={8}>
        <PreviewHeader header={header} />
        
        {/* Contenu du document de démonstration */}
        <Box my={8}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Document de démonstration
          </Text>
          <Text mb={4}>
            Ceci est un aperçu de la mise en page de votre document. Le contenu ici est à titre d'exemple pour vous montrer comment apparaîtront vos en-têtes et pieds de page personnalisés.
          </Text>
          <Text>
            Vous pouvez modifier l'apparence de ce document en utilisant les onglets ci-dessus pour personnaliser l'en-tête, le pied de page et les styles globaux.
          </Text>
        </Box>
        
        <Spacer />
        
        <PreviewFooter footer={footer} styles={styles} />
      </Container>
    </Box>
  );
};

export default DocumentPreview;

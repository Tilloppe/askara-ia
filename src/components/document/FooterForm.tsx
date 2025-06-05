import React from 'react';
import { 
  VStack, 
  HStack, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea, 
  Switch,
  IconButton,
  Divider,
  Text,
  Box,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { HamburgerIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import ImageUploader from './ImageUploader';
import type { DocumentCustomization } from '../../types/documentCustomization';

interface FooterFormProps {
  footer: DocumentCustomization['footer'];
  onChange: (updates: Partial<DocumentCustomization['footer']>) => void;
}

const FooterForm: React.FC<FooterFormProps> = ({ footer, onChange }) => {
  const handleSignatureUpload = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ signature: reader.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      const { signature, ...rest } = footer;
      onChange(rest);
    }
  };

  const handleLogoUpload = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      const { logo, ...rest } = footer;
      onChange(rest);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in footer.contact) {
      onChange({
        contact: {
          ...footer.contact,
          [name]: value
        }
      });
    } else {
      onChange({ [name]: value });
    }
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onChange({ [name]: checked });
  };


  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Signature et logo
        </Text>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
          <GridItem>
            <ImageUploader
              label="Signature"
              value={footer.signature}
              onChange={handleSignatureUpload}
              recommendedDimensions="200x80px (format paysage)"
              aspectRatio={2.5}
              maxSizeMB={1}
            />
          </GridItem>
          <GridItem>
            <ImageUploader
              label="Logo du pied de page"
              value={footer.logo}
              onChange={handleLogoUpload}
              recommendedDimensions="150x50px (format paysage)"
              aspectRatio={3}
              maxSizeMB={1}
            />
          </GridItem>
        </Grid>
      </Box>

      <Divider />

      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Contenu du pied de page
        </Text>
        
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Affichage</FormLabel>
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text>Afficher la signature</Text>
                <Switch
                  name="showSignature"
                  isChecked={footer.showSignature}
                  onChange={handleToggle}
                  colorScheme="blue"
                />
              </HStack>
              <HStack justify="space-between">
                <Text>Afficher les coordonnées</Text>
                <Switch
                  name="showContact"
                  isChecked={footer.showContact}
                  onChange={handleToggle}
                  colorScheme="blue"
                />
              </HStack>
              <HStack justify="space-between">
                <Text>Afficher le logo</Text>
                <Switch
                  name="showLogo"
                  isChecked={footer.showLogo}
                  onChange={handleToggle}
                  colorScheme="blue"
                />
              </HStack>
            </VStack>
          </FormControl>

          <FormControl>
            <FormLabel>Alignement</FormLabel>
            <HStack spacing={2}>
              <IconButton
                aria-label="Aligner à gauche"
                icon={<ChevronLeftIcon />}
                onClick={() => onChange({ alignment: 'left' })}
                colorScheme={footer.alignment === 'left' ? 'blue' : 'gray'}
                size="sm"
                variant="ghost"
              />
              <IconButton
                aria-label="Centrer"
                icon={<HamburgerIcon />}
                onClick={() => onChange({ alignment: 'center' })}
                colorScheme={footer.alignment === 'center' ? 'blue' : 'gray'}
                size="sm"
                variant="ghost"
              />
              <IconButton
                aria-label="Aligner à droite"
                icon={<ChevronRightIcon />}
                onClick={() => onChange({ alignment: 'right' })}
                colorScheme={footer.alignment === 'right' ? 'blue' : 'gray'}
                size="sm"
                variant="ghost"
              />
            </HStack>

          </FormControl>

          <FormControl>
            <FormLabel>Nom complet</FormLabel>
            <Input
              name="name"
              value={footer.name}
              onChange={handleTextChange}
              placeholder="Votre nom complet"
            />
          </FormControl>


          <FormControl>
            <FormLabel>Poste / Titre</FormLabel>
            <Input
              name="title"
              value={footer.title}
              onChange={handleTextChange}
              placeholder="Votre poste ou titre"
            />
          </FormControl>

          <Text fontSize="md" fontWeight="medium" mt={4} mb={2}>
            Coordonnées
          </Text>
          
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
            <GridItem>
              <FormControl>
                <FormLabel>Téléphone</FormLabel>
                <Input
                  name="phone"
                  value={footer.contact.phone}
                  onChange={handleTextChange}
                  placeholder="+33 1 23 45 67 89"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={footer.contact.email}
                  onChange={handleTextChange}
                  placeholder="contact@example.com"
                />
              </FormControl>
            </GridItem>
          </Grid>

          <FormControl>
            <FormLabel>Adresse</FormLabel>
            <Textarea
              name="address"
              value={footer.contact.address}
              onChange={handleTextChange}
              placeholder="Adresse complète"
              rows={3}
            />
          </FormControl>
        </VStack>
      </Box>
    </VStack>
  );
};

export default FooterForm;

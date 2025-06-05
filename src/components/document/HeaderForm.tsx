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
  Box
} from '@chakra-ui/react';
import { HamburgerIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import ImageUploader from './ImageUploader';
import type { DocumentCustomization } from '../../types/documentCustomization';

interface HeaderFormProps {
  header: DocumentCustomization['header'];
  onChange: (updates: Partial<DocumentCustomization['header']>) => void;
}

const HeaderForm: React.FC<HeaderFormProps> = ({ header, onChange }) => {
  const handleImageUpload = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      const { logo, ...rest } = header;
      onChange(rest);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onChange({ [name]: checked });
  };


  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Logo de l'en-tête
        </Text>
        <ImageUploader
          label="Logo"
          value={header.logo}
          onChange={handleImageUpload}
          recommendedDimensions="300x100px (format paysage)"
          aspectRatio={3}
          maxSizeMB={1}
        />
      </Box>

      <Divider />

      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Contenu de l'en-tête
        </Text>
        
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Affichage</FormLabel>
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text>Afficher le logo</Text>
                <Switch
                  name="showLogo"
                  isChecked={header.showLogo}
                  onChange={handleToggle}
                  colorScheme="blue"
                />
              </HStack>
              <HStack justify="space-between">
                <Text>Afficher le titre</Text>
                <Switch
                  name="showTitle"
                  isChecked={header.showTitle}
                  onChange={handleToggle}
                  colorScheme="blue"
                />
              </HStack>
              <HStack justify="space-between">
                <Text>Afficher les coordonnées</Text>
                <Switch
                  name="showContact"
                  isChecked={header.showContact}
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
                  colorScheme={header.alignment === 'left' ? 'blue' : 'gray'}
                  size="sm"
                  variant="ghost"
                />
                <IconButton
                  aria-label="Centrer"
                  icon={<HamburgerIcon />}
                  onClick={() => onChange({ alignment: 'center' })}
                  colorScheme={header.alignment === 'center' ? 'blue' : 'gray'}
                  size="sm"
                  variant="ghost"
                />
                <IconButton
                  aria-label="Aligner à droite"
                  icon={<ChevronRightIcon />}
                  onClick={() => onChange({ alignment: 'right' })}
                  colorScheme={header.alignment === 'right' ? 'blue' : 'gray'}
                  size="sm"
                  variant="ghost"
                />
            </HStack>
          </FormControl>

          <FormControl>
            <FormLabel>Titre</FormLabel>
            <Input
              name="title"
              value={header.title}
              onChange={handleTextChange}
              placeholder="Nom de votre entreprise"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Sous-titre</FormLabel>
            <Input
              name="subtitle"
              value={header.subtitle}
              onChange={handleTextChange}
              placeholder="Votre slogan ou description"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Coordonnées</FormLabel>
            <Textarea
              name="contactInfo"
              value={header.contactInfo}
              onChange={handleTextChange}
              placeholder="Adresse, téléphone, email..."
              rows={4}
            />
          </FormControl>
        </VStack>
      </Box>
    </VStack>
  );
};

export default HeaderForm;

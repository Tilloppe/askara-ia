import React from 'react';
import { VStack, FormControl, FormLabel, Select, Input, HStack, Text, useColorModeValue } from '@chakra-ui/react';

interface AppearanceFormProps {
  styles: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    fontSize: string;
    lineHeight: number;
  };
  onChange: (updates: Partial<{
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    fontSize: string;
    lineHeight: number;
  }>) => void;
}

const fontOptions = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Courier New, monospace', label: 'Courier New' },
];

const fontSizeOptions = [
  { value: '12px', label: 'Petit (12px)' },
  { value: '14px', label: 'Moyen (14px)' },
  { value: '16px', label: 'Grand (16px)' },
  { value: '18px', label: 'Très grand (18px)' },
];

const AppearanceForm: React.FC<AppearanceFormProps> = ({ styles, onChange }) => {
  const handleChange = (field: keyof typeof styles, value: string | number) => {
    onChange({ [field]: value });
  };

  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');

  return (
    <VStack spacing={6} align="stretch">
      <FormControl>
        <FormLabel>Police de caractère</FormLabel>
        <Select
          value={styles.fontFamily}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
          borderColor={borderColor}
        >
          {fontOptions.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Taille de police</FormLabel>
        <Select
          value={styles.fontSize}
          onChange={(e) => handleChange('fontSize', e.target.value)}
          borderColor={borderColor}
        >
          {fontSizeOptions.map((size) => (
            <option key={size.value} value={size.value}>
              {size.label}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Hauteur de ligne</FormLabel>
        <Input
          type="number"
          min={1}
          max={3}
          step={0.1}
          value={styles.lineHeight}
          onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value))}
          borderColor={borderColor}
        />
        <Text fontSize="sm" color="gray.500" mt={1}>
          Recommandé: entre 1.2 et 1.8 pour une meilleure lisibilité
        </Text>
      </FormControl>

      <HStack spacing={4}>
        <FormControl>
          <FormLabel>Couleur principale</FormLabel>
          <HStack>
            <Input
              type="color"
              value={styles.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              p={0}
              border="none"
              w="50px"
              h="40px"
            />
            <Input
              value={styles.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              borderColor={borderColor}
              maxLength={7}
            />
          </HStack>
        </FormControl>

        <FormControl>
          <FormLabel>Couleur secondaire</FormLabel>
          <HStack>
            <Input
              type="color"
              value={styles.secondaryColor}
              onChange={(e) => handleChange('secondaryColor', e.target.value)}
              p={0}
              border="none"
              w="50px"
              h="40px"
            />
            <Input
              value={styles.secondaryColor}
              onChange={(e) => handleChange('secondaryColor', e.target.value)}
              borderColor={borderColor}
              maxLength={7}
            />
          </HStack>
        </FormControl>
      </HStack>
    </VStack>
  );
};

export default AppearanceForm;

import React, { useRef, useState } from 'react';
import { 
  Box, 
  Button, 
  Image, 
  IconButton, 
  Text, 
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, ExternalLinkIcon } from '@chakra-ui/icons';

interface ImageUploaderProps {
  label: string;
  value?: string;
  onChange: (file: File | null) => void;
  maxSizeMB?: number;
  recommendedDimensions?: string;
  aspectRatio?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  maxSizeMB = 2,
  recommendedDimensions,
  aspectRatio
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);
  const [error, setError] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      setError('Aucun fichier sélectionné');
      return;
    }

    // Vérification de la taille du fichier
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`La taille du fichier ne doit pas dépasser ${maxSizeMB} Mo`);
      return;
    }

    // Vérification du type de fichier
    if (!file.type.match('image/(png|jpeg|jpg|svg)')) {
      setError('Format de fichier non pris en charge. Utilisez PNG, JPG ou SVG.');
      return;
    }

    // Vérification des dimensions si nécessaire
    if (aspectRatio) {
      const img = new window.Image();
      img.onload = function() {
        const imgAspectRatio = img.width / img.height;
        if (Math.abs(imgAspectRatio - aspectRatio) > 0.1) {
          setError(`Les dimensions de l'image ne correspondent pas au format attendu.`);
          return;
        }
        processFile(file);
      };
      img.onerror = function() {
        // En cas d'erreur de chargement de l'image, on la traite quand même
        processFile(file);
      };
      img.src = URL.createObjectURL(file);
    } else {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      setError('');
      onChange(file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(undefined);
    setError('');
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <VStack spacing={3} align="stretch">
      <Text fontWeight="medium">{label}</Text>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg, image/svg+xml"
        style={{ display: 'none' }}
      />

      {preview ? (
        <Box position="relative" borderWidth="1px" borderRadius="md" p={2}>
          <Box position="relative" width="100%" height="150px" overflow="hidden" display="flex" alignItems="center" justifyContent="center">
            <Image 
              src={preview} 
              alt="Preview" 
              maxH="100%" 
              maxW="100%" 
              objectFit="contain"
            />
            <Box
              position="absolute"
              top={1}
              right={1}
              bg="rgba(0,0,0,0.5)"
              borderRadius="full"
              p={1}
              display="flex"
              gap={1}
            >
              <IconButton
                aria-label="Zoom"
                icon={<ExternalLinkIcon />}
                size="sm"
                colorScheme="whiteAlpha"
                variant="ghost"
                color="white"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
              />
              <IconButton
                aria-label="Supprimer"
                icon={<CloseIcon />}
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <Button
          leftIcon={<AddIcon />}
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          width="100%"
          py={8}
        >
          Télécharger une image
        </Button>
      )}

      {recommendedDimensions && (
        <Text fontSize="sm" color="gray.500">
          Dimensions recommandées : {recommendedDimensions}
        </Text>
      )}

      {error && (
        <Text color="red.500" fontSize="sm">{error}</Text>
      )}

      {/* Modal pour l'aperçu en grand */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Aperçu de l'image</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" justifyContent="center" alignItems="center" p={8}>
            {preview && (
              <Image 
                src={preview} 
                alt="Aperçu agrandi" 
                maxH="70vh"
                maxW="100%"
                objectFit="contain"
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default ImageUploader;

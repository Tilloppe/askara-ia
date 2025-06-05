import { Box, Text, Divider, Badge, HStack, IconButton, Tooltip } from '@chakra-ui/react';
import { FiMail, FiEdit2 } from 'react-icons/fi';
import type { DocumentTemplate } from '../../types';
import React from 'react';

type DocumentTemplateViewerProps = {
  template: DocumentTemplate | null;
  onEdit?: () => void;
  onSend?: () => void;
};

const DocumentTemplateViewer = ({
  template,
  onEdit,
  onSend,
}: DocumentTemplateViewerProps) => {
  if (!template) {
    return (
      <Box
        borderWidth="1px"
        borderRadius="md"
        p={4}
        bg="gray.50"
        minH="200px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="gray.500">Sélectionnez un modèle de document</Text>
      </Box>
    );
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      bg="white"
      boxShadow="sm"
    >
      <Box
        bg="blue.50"
        px={4}
        py={2}
        borderBottomWidth="1px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack>
          <Text fontWeight="bold" fontSize="lg">{template.name}</Text>
          <Badge colorScheme="blue">{template.tags?.[0] || 'Général'}</Badge>
        </HStack>
        <HStack>
          {onEdit && (
            <Tooltip label="Modifier le modèle">
              <IconButton
                aria-label="Modifier"
                icon={React.createElement(FiEdit2 as React.ElementType)}
                size="sm"
                variant="ghost"
                onClick={onEdit}
              />
            </Tooltip>
          )}
          {onSend && (
            <Tooltip label="Envoyer ce modèle">
              <IconButton
                aria-label="Envoyer"
                icon={React.createElement(FiMail as React.ElementType)}
                colorScheme="blue"
                size="sm"
                onClick={onSend}
              />
            </Tooltip>
          )}
        </HStack>
      </Box>
      <Box p={4}>
        {template.description && (
          <Text color="gray.600" mb={4}>{template.description}</Text>
        )}
        <Divider my={4} />
        <Box
          borderWidth="1px"
          borderRadius="md"
          p={4}
          bg="gray.50"
          fontFamily="mono"
          whiteSpace="pre-wrap"
          minH="200px"
          maxH="400px"
          overflowY="auto"
        >
          {template.content || 'Aucun contenu disponible pour ce modèle.'}
        </Box>
        {template.tags && template.tags.length > 0 && (
          <HStack mt={4} flexWrap="wrap">
            {template.tags.map((tag) => (
              <Badge key={tag} colorScheme="gray" variant="subtle">
                {tag}
              </Badge>
            ))}
          </HStack>
        )}
      </Box>
    </Box>
  );
};

export default DocumentTemplateViewer;

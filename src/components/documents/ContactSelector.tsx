import { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  VStack,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { FiUser, FiMail, FiPlus, FiX } from 'react-icons/fi';

type Contact = {
  id: string;
  name: string;
  email: string;
};

type ContactSelectorProps = {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelect: (contact: Contact | null) => void;
  onAddContact?: (contact: Omit<Contact, 'id'>) => Promise<Contact>;
};

export const ContactSelector = ({
  contacts,
  selectedContact,
  onSelect,
  onAddContact,
}: ContactSelectorProps) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({ name: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleAddContact = useCallback(async () => {
    if (!onAddContact) return;
    
    if (!newContact.name || !newContact.email) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const addedContact = await onAddContact(newContact);
      onSelect(addedContact);
      setNewContact({ name: '', email: '' });
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du contact:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter le contact',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [newContact, onAddContact, onClose, onSelect, toast]);

  return (
    <Box>
      {selectedContact ? (
        <HStack
          p={2}
          borderWidth="1px"
          borderRadius="md"
          justifyContent="space-between"
          bg="white"
        >
          <HStack>
            <Avatar size="sm" name={selectedContact.name} icon={<FiUser />} />
            <Box>
              <Text fontWeight="medium">{selectedContact.name}</Text>
              <Text fontSize="sm" color="gray.600">{selectedContact.email}</Text>
            </Box>
          </HStack>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(null);
            }}
          >
            <FiX />
          </Button>
        </HStack>
      ) : (
        <Menu>
          <MenuButton as={Button} leftIcon={<FiUser />} variant="outline" w="100%">
            Sélectionner un contact
          </MenuButton>
          <MenuList maxH="300px" overflowY="auto">
            {contacts.map((contact) => (
              <MenuItem
                key={contact.id}
                onClick={() => onSelect(contact)}
              >
                <HStack>
                  <Avatar size="sm" name={contact.name} />
                  <VStack align="start" spacing={0}>
                    <Text>{contact.name}</Text>
                    <Text fontSize="xs" color="gray.500">{contact.email}</Text>
                  </VStack>
                </HStack>
              </MenuItem>
            ))}
            {onAddContact && (
              <MenuItem onClick={onOpen}>
                <HStack>
                  <Box p={2} rounded="full" bg="blue.50">
                    <FiPlus color="blue.500" />
                  </Box>
                  <Text>Ajouter un contact</Text>
                </HStack>
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      )}

      {/* Modal pour ajouter un nouveau contact */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ajouter un contact</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nom</FormLabel>
                <Input
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                  placeholder="Nom du contact"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={newContact.email}
                  onChange={(e) =>
                    setNewContact({ ...newContact, email: e.target.value })
                  }
                  placeholder="email@exemple.com"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Annuler
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleAddContact}
              isLoading={isLoading}
              leftIcon={<FiPlus />}
            >
              Ajouter
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ContactSelector;

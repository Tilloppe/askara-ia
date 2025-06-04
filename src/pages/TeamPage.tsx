import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box,
  Button,
  VStack,
  HStack,
  Heading,
  Text,
  useDisclosure,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormHelperText,
  Select,
  Textarea,
  useBreakpointValue,
  Icon
} from '@chakra-ui/react';
// Composants d'icônes personnalisés utilisant l'icône générique de Chakra UI
const UserPlusIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </Icon>
);

const SearchIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </Icon>
);

const CloseIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </Icon>
);

const MoreVerticalIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </Icon>
);

const SendIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </Icon>
);

const EditIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </Icon>
);

const TrashIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </Icon>
);

const UserXIcon = (props: any) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    <path fill="currentColor" d="M14 18h8v2h-8z" transform="rotate(-45 18 19)" />
    <path fill="currentColor" d="M22 18h-8v2h8v-2z" transform="rotate(45 18 19)" />
  </Icon>
);

// Types
type TeamMemberStatus = 'active' | 'pending' | 'inactive';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'audiologist' | 'assistant';
  status: TeamMemberStatus;
  avatar?: string;
  lastActive?: string;
  joinDate: string;
}

// Données de démonstration
const initialTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie.dubois@example.com',
    role: 'admin',
    status: 'active',
    joinDate: '15/01/2023',
    lastActive: 'Aujourd\'hui, 10:30'
  },
  {
    id: '2',
    name: 'Thomas Martin',
    email: 'thomas.martin@example.com',
    role: 'audiologist',
    status: 'active',
    joinDate: '20/02/2023',
    lastActive: 'Hier, 16:45'
  },
  {
    id: '3',
    name: 'Sophie Lambert',
    email: 'sophie.lambert@example.com',
    role: 'assistant',
    status: 'pending',
    joinDate: 'En attente',
    lastActive: 'Invitation envoyée'
  },
  {
    id: '4',
    name: 'Julien Bernard',
    email: 'julien.bernard@example.com',
    role: 'audiologist',
    status: 'inactive',
    joinDate: '10/03/2023',
    lastActive: 'Il y a 2 semaines'
  },
];

const TeamPage = () => {
  const toast = useToast();
  // useNavigate est disponible pour la navigation si nécessaire
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [newMember, setNewMember] = useState({
    email: '',
    role: 'audiologist' as const,
    message: 'Je vous invite à rejoindre notre équipe sur Askara Audio IA. Rejoignez-nous pour gérer ensemble les patients et les documents de notre cabinet.'
  });

  // Styles
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Filtrer les membres d'équipe en fonction de la recherche
  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gérer l'envoi d'invitation
  const handleSendInvitation = async () => {
    if (!newMember.email) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer une adresse email valide',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSending(true);

    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Ajouter le nouveau membre avec un statut "en attente"
      const newTeamMember: TeamMember = {
        id: Date.now().toString(),
        name: newMember.email.split('@')[0], // Utiliser la partie avant @ comme nom temporaire
        email: newMember.email,
        role: newMember.role,
        status: 'pending',
        joinDate: 'En attente',
        lastActive: 'Invitation envoyée'
      };

      setTeamMembers([...teamMembers, newTeamMember]);
      
      toast({
        title: 'Invitation envoyée',
        description: `Une invitation a été envoyée à ${newMember.email}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Réinitialiser le formulaire
      setNewMember({
        email: '',
        role: 'audiologist',
        message: 'Je vous invite à rejoindre notre équipe sur Askara Audio IA. Rejoignez-nous pour gérer ensemble les patients et les documents de notre cabinet.'
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'envoi de l\'invitation',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  // Gérer la suppression d'un membre
  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    
    toast({
      title: 'Membre supprimé',
      description: 'Le membre a été retiré de l\'équipe',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  // Gérer le changement de rôle
  const handleRoleChange = (memberId: string, newRole: 'admin' | 'audiologist' | 'assistant') => {
    setTeamMembers(teamMembers.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    ));
    
    toast({
      title: 'Rôle mis à jour',
      description: 'Le rôle du membre a été mis à jour',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Obtenir la couleur du badge en fonction du statut
  const getStatusColor = (status: TeamMemberStatus) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'pending':
        return 'orange';
      case 'inactive':
        return 'gray';
      default:
        return 'blue';
    }
  };

  // Obtenir le libellé du statut
  const getStatusLabel = (status: TeamMemberStatus) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'pending':
        return 'En attente';
      case 'inactive':
        return 'Inactif';
      default:
        return status;
    }
  };

  // Obtenir le libellé du rôle
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'audiologist':
        return 'Audioprothésiste';
      case 'assistant':
        return 'Assistant(e)';
      default:
        return role;
    }
  };

  return (
    <Box maxW="6xl" mx="auto" p={{ base: 4, md: 6 }}>
      <VStack spacing={6} align="stretch">
        {/* En-tête */}
        <Box>
          <HStack justify="space-between" align="center" mb={2}>
            <Heading size="lg">Équipe du cabinet</Heading>
            <Button
              leftIcon={<UserPlusIcon />}
              colorScheme="brand"
              onClick={onOpen}
            >
              Inviter un membre
            </Button>
          </HStack>
          <Text color="gray.500">
            Gérez les membres de votre équipe et leurs autorisations
          </Text>
        </Box>

        {/* Barre de recherche */}
        <Box maxW="md">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Rechercher un membre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={cardBg}
            />
            {searchTerm && (
              <InputRightElement>
                <IconButton
                  aria-label="Effacer la recherche"
                  icon={<CloseIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={() => setSearchTerm('')}
                />
              </InputRightElement>
            )}
          </InputGroup>
        </Box>

        {/* Liste des membres */}
        <Box
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          overflow="hidden"
          bg={cardBg}
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Membre</Th>
                <Th display={{ base: 'none', md: 'table-cell' }}>Rôle</Th>
                <Th display={{ base: 'none', md: 'table-cell' }}>Statut</Th>
                <Th display={{ base: 'none', lg: 'table-cell' }}>Dernière activité</Th>
                <Th display={{ base: 'none', lg: 'table-cell' }}>Date d'ajout</Th>
                <Th textAlign="right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <Tr key={member.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                    <Td>
                      <HStack spacing={3}>
                        <Avatar
                          name={member.name}
                          src={member.avatar}
                          size="sm"
                        />
                        <Box>
                          <Text fontWeight="medium">{member.name}</Text>
                          <Text fontSize="sm" color="gray.500">{member.email}</Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td display={{ base: 'none', md: 'table-cell' }}>
                      {isMobile ? (
                        <Text fontSize="sm">{getRoleLabel(member.role)}</Text>
                      ) : (
                        <Select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value as any)}
                          size="sm"
                          w="auto"
                          variant="filled"
                          isDisabled={member.status !== 'active'}
                        >
                          <option value="admin">Administrateur</option>
                          <option value="audiologist">Audioprothésiste</option>
                          <option value="assistant">Assistant(e)</option>
                        </Select>
                      )}
                    </Td>
                    <Td display={{ base: 'none', md: 'table-cell' }}>
                      <Badge colorScheme={getStatusColor(member.status)}>
                        {getStatusLabel(member.status)}
                      </Badge>
                    </Td>
                    <Td display={{ base: 'none', lg: 'table-cell' }}>
                      <Text fontSize="sm" color="gray.500">
                        {member.lastActive}
                      </Text>
                    </Td>
                    <Td display={{ base: 'none', lg: 'table-cell' }}>
                      <Text fontSize="sm" color="gray.500">
                        {member.joinDate}
                      </Text>
                    </Td>
                    <Td textAlign="right">
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<MoreVerticalIcon />}
                          variant="ghost"
                          size="sm"
                          aria-label="Actions"
                        />
                        <MenuList>
                          {member.status === 'pending' && (
                            <MenuItem icon={<SendIcon />}>
                              Renvoyer l'invitation
                            </MenuItem>
                          )}
                          {member.status === 'active' && (
                            <MenuItem icon={<EditIcon />}>
                              Modifier
                            </MenuItem>
                          )}
                          <MenuItem 
                            icon={<TrashIcon />}
                            color="red.500"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            Supprimer
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={6} textAlign="center" py={10}>
                    <VStack spacing={2}>
                      <UserXIcon size={32} color="#718096" />
                      <Text>Aucun membre trouvé</Text>
                      <Text color="gray.500" fontSize="sm">
                        Essayez de modifier vos critères de recherche
                      </Text>
                    </VStack>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>

        {/* Légende des statuts */}
        <HStack spacing={4} fontSize="sm" color="gray.500" justify="flex-end">
          <HStack>
            <Box w={2} h={2} bg="green.500" borderRadius="full" />
            <Text>Actif</Text>
          </HStack>
          <HStack>
            <Box w={2} h={2} bg="orange.500" borderRadius="full" />
            <Text>En attente</Text>
          </HStack>
          <HStack>
            <Box w={2} h={2} bg="gray.500" borderRadius="full" />
            <Text>Inactif</Text>
          </HStack>
        </HStack>
      </VStack>

      {/* Modal d'invitation */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Inviter un membre d'équipe</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Adresse email</FormLabel>
                <Input
                  placeholder="email@exemple.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Rôle</FormLabel>
                <Select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
                >
                  <option value="admin">Administrateur</option>
                  <option value="audiologist">Audioprothésiste</option>
                  <option value="assistant">Assistant(e)</option>
                </Select>
                <FormHelperText>
                  Les administrateurs ont un accès complet. Les audioprothésistes peuvent gérer les patients et les documents. Les assistants ont un accès limité.
                </FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel>Message personnalisé (optionnel)</FormLabel>
                <Textarea
                  value={newMember.message}
                  onChange={(e) => setNewMember({ ...newMember, message: e.target.value })}
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose} isDisabled={isSending}>
              Annuler
            </Button>
            <Button
              colorScheme="brand"
              leftIcon={<SendIcon />}
              onClick={handleSendInvitation}
              isLoading={isSending}
              loadingText="Envoi..."
            >
              Envoyer l'invitation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TeamPage;

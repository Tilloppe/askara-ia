import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  useToast,
  HStack,
  IconButton,
  Divider,
  Textarea,
  InputGroup,
  InputRightElement,
  Icon,
  Flex
} from '@chakra-ui/react';
import { ArrowBackIcon, CheckIcon, AddIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';

// Types de contacts par défaut
const DEFAULT_CONTACT_TYPES = ['Médecin', 'Patient', 'Infirmier(ère)', 'Secrétaire', 'Autre'];

const NewContact = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const customTypeInputRef = useRef<HTMLInputElement>(null);
  
  const [contactTypes, setContactTypes] = useState<string[]>(DEFAULT_CONTACT_TYPES);
  const [isAddingCustomType, setIsAddingCustomType] = useState(false);
  const [customType, setCustomType] = useState('');
  
  const [formData, setFormData] = useState({
    type: 'Médecin',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialty: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCustomType = () => {
    if (customType.trim() && !contactTypes.includes(customType.trim())) {
      const newType = customType.trim();
      setContactTypes(prev => [...prev, newType]);
      setFormData(prev => ({
        ...prev,
        type: newType
      }));
      setCustomType('');
      setIsAddingCustomType(false);
    }
  };

  const handleCancelCustomType = () => {
    setCustomType('');
    setIsAddingCustomType(false);
  };

  const handleCustomTypeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomType();
    } else if (e.key === 'Escape') {
      handleCancelCustomType();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ici, vous ajouterez la logique pour sauvegarder le contact
    console.log('Nouveau contact :', formData);
    
    // Simulation de succès
    toast({
      title: 'Contact créé',
      description: 'Le contact a été enregistré avec succès.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    // Redirection vers la liste des contacts après 1,5 secondes
    setTimeout(() => {
      navigate('/contacts');
    }, 1500);
  };

  return (
    <Box p={4} maxW="800px" mx="auto">
      <HStack mb={6} spacing={4} align="center">
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label="Retour"
          variant="ghost"
          onClick={() => navigate(-1)}
        />
        <Heading size="lg">Nouveau contact</Heading>
      </HStack>
      
      <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Type de contact</FormLabel>
              {!isAddingCustomType ? (
                <Flex gap={2}>
                  <Select 
                    name="type" 
                    value={formData.type}
                    onChange={handleChange}
                    flex="1"
                  >
                    {contactTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                  <IconButton
                    aria-label="Ajouter un type personnalisé"
                    icon={<AddIcon />}
                    onClick={() => {
                      setIsAddingCustomType(true);
                      // Focus sur l'input après le rendu
                      setTimeout(() => customTypeInputRef.current?.focus(), 0);
                    }}
                    variant="outline"
                  />
                </Flex>
              ) : (
                <InputGroup>
                  <Input
                    ref={customTypeInputRef}
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    onKeyDown={handleCustomTypeKeyDown}
                    placeholder="Saisir un nouveau type de contact"
                  />
                  <InputRightElement width="4.5rem">
                    <HStack spacing={1} pr={2}>
                      <IconButton
                        aria-label="Valider"
                        icon={<CheckIcon />}
                        onClick={handleAddCustomType}
                        size="sm"
                        colorScheme="green"
                        variant="ghost"
                        isDisabled={!customType.trim()}
                      />
                      <IconButton
                        aria-label="Annuler"
                        icon={<CloseIcon />}
                        onClick={handleCancelCustomType}
                        size="sm"
                        variant="ghost"
                      />
                    </HStack>
                  </InputRightElement>
                </InputGroup>
              )}
            </FormControl>
            
            <HStack w="100%" spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nom</FormLabel>
                <Input 
                  name="lastName" 
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Dupont"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Prénom</FormLabel>
                <Input 
                  name="firstName" 
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jean"
                />
              </FormControl>
            </HStack>
            
            <HStack w="100%" spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jean.dupont@example.com"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Téléphone</FormLabel>
                <Input 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="06 12 34 56 78"
                />
              </FormControl>
            </HStack>
            
            {formData.type === 'Médecin' && (
              <FormControl>
                <FormLabel>Spécialité</FormLabel>
                <Input 
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  placeholder="Spécialité médicale"
                />
              </FormControl>
            )}
            
            <FormControl>
              <FormLabel>Notes</FormLabel>
              <Textarea 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Informations complémentaires..."
                rows={4}
              />
            </FormControl>
            
            <Divider my={4} />
            
            <HStack w="100%" justifyContent="flex-end" spacing={4}>
              <Button 
                variant="outline" 
                onClick={() => navigate('/contacts')}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                colorScheme="blue"
                leftIcon={<CheckIcon />}
              >
                Enregistrer le contact
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default NewContact;

import { useState, useRef } from 'react';
import { 
  Box, 
  Heading, 
  VStack, 
  HStack, 
  Button, 
  Text, 
  FormControl, 
  FormLabel, 
  Input, 
  Select, 
  Textarea, 
  useToast,
  Icon,
  Divider,
  FormHelperText,
  FormErrorMessage,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Switch,
  Badge,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { 
  FiArrowLeft, 
  FiSave, 
  FiTrash2, 
  FiUser, 
  FiPhone, 
  FiMail, 
  FiHome, 
  FiCalendar, 
  FiMapPin,
  FiPlus,
  FiX,
} from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';

// Mock data - in a real app, this would come from an API
const mockPatient = {
  id: '1',
  civility: 'M.',
  lastName: 'Dupont',
  firstName: 'Jean',
  birthDate: '1985-05-15',
  birthPlace: 'Paris, France',
  socialSecurityNumber: '1 85 05 15 123 456 78',
  email: 'jean.dupont@example.com',
  phone: '0123456789',
  mobile: '0612345678',
  address: '123 Rue de l\'Exemple',
  postalCode: '75001',
  city: 'Paris',
  country: 'France',
  referringDoctor: 'Dr. Martin',
  referringDoctorPhone: '0198765432',
  referringDoctorEmail: 'dr.martin@example.com',
  notes: 'Patient suivi pour acouphènes chroniques. Porte des appareils auditifs depuis 2020.',
  tags: ['acouphènes', 'appareillage'],
  isActive: true,
};

// Available civility options
const civilityOptions = [
  { value: 'M.', label: 'M.' },
  { value: 'Mme', label: 'Mme' },
  { value: 'Mlle', label: 'Mlle' },
  { value: 'Dr', label: 'Dr' },
  { value: 'Pr', label: 'Pr' },
];

// Available countries
const countryOptions = [
  'France',
  'Belgique',
  'Suisse',
  'Luxembourg',
  'Canada',
  'Autre',
];

const EditPatient = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  
  // Form state
  const [formData, setFormData] = useState(mockPatient);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newTag, setNewTag] = useState('');
  
  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle switch toggle
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle tag addition
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };
  
  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'La date de naissance est requise';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Erreur de validation',
        description: 'Veuillez corriger les erreurs dans le formulaire.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    
    // In a real app, this would call an API to update the patient
    console.log('Updating patient:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Patient mis à jour',
        description: 'Les informations du patient ont été mises à jour avec succès.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Redirect to patient detail
      navigate(`/patients/${id}`);
    }, 1000);
  };
  
  // Handle patient deletion
  const handleDelete = () => {
    setIsDeleting(true);
    
    // In a real app, this would call an API to delete the patient
    console.log('Deleting patient:', id);
    
    // Simulate API call
    setTimeout(() => {
      setIsDeleting(false);
      onClose();
      
      toast({
        title: 'Patient supprimé',
        description: 'Le patient a été supprimé avec succès.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Redirect to patients list
      navigate('/patients');
    }, 1000);
  };
  
  // Handle cancel
  const handleCancel = () => {
    // Check if form has been modified
    const isModified = JSON.stringify(formData) !== JSON.stringify(mockPatient);
    
    if (isModified) {
      if (window.confirm('Voulez-vous vraiment annuler les modifications ? Toutes les modifications non enregistrées seront perdues.')) {
        navigate(`/patients/${id}`);
      }
    } else {
      navigate(`/patients/${id}`);
    }
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6} align="center">
        <HStack>
          <Button 
            leftIcon={<FiArrowLeft />} 
            variant="ghost" 
            onClick={handleCancel}
          >
            Retour
          </Button>
          <Heading size="lg">Modifier le patient</Heading>
          <Badge 
            colorScheme={formData.isActive ? 'green' : 'gray'}
            variant="subtle"
            ml={2}
          >
            {formData.isActive ? 'Actif' : 'Inactif'}
          </Badge>
        </HStack>
        
        <HStack spacing={2}>
          <Button 
            leftIcon={<FiTrash2 />} 
            variant="outline" 
            colorScheme="red"
            onClick={onOpen}
          >
            Supprimer
          </Button>
          <Button 
            leftIcon={<FiSave />} 
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Enregistrement..."
          >
            Enregistrer
          </Button>
        </HStack>
      </HStack>
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          {/* Personal Information Card */}
          <Card variant="outline">
            <CardHeader>
              <HStack>
                <Icon as={FiUser} color="blue.500" />
                <Heading size="md">Informations personnelles</Heading>
              </HStack>
            </CardHeader>
            <Divider />
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                <FormControl isRequired isInvalid={!!errors.civility}>
                  <FormLabel>Civilité</FormLabel>
                  <Select 
                    name="civility"
                    value={formData.civility}
                    onChange={handleChange}
                    placeholder="Sélectionner..."
                  >
                    {civilityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.civility}</FormErrorMessage>
                </FormControl>
                
                <FormControl isRequired isInvalid={!!errors.lastName}>
                  <FormLabel>Nom</FormLabel>
                  <Input 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Dupont"
                  />
                  <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                </FormControl>
                
                <FormControl isRequired isInvalid={!!errors.firstName}>
                  <FormLabel>Prénom</FormLabel>
                  <Input 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Jean"
                  />
                  <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                </FormControl>
                
                <FormControl isRequired isInvalid={!!errors.birthDate}>
                  <FormLabel>Date de naissance</FormLabel>
                  <Input 
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <FormErrorMessage>{errors.birthDate}</FormErrorMessage>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Lieu de naissance</FormLabel>
                  <Input 
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleChange}
                    placeholder="Paris, France"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>N° de sécurité sociale</FormLabel>
                  <Input 
                    name="socialSecurityNumber"
                    value={formData.socialSecurityNumber}
                    onChange={handleChange}
                    placeholder="1 85 05 15 123 456 78"
                  />
                </FormControl>
                
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jean.dupont@example.com"
                    leftElement={<Icon as={FiMail} color="gray.400" ml={3} />}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Téléphone</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiPhone} color="gray.400" />
                    </InputLeftElement>
                    <Input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01 23 45 67 89"
                    />
                  </InputGroup>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Mobile</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiPhone} color="gray.400" />
                    </InputLeftElement>
                    <Input 
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="06 12 34 56 78"
                    />
                  </InputGroup>
                </FormControl>
              </SimpleGrid>
            </CardBody>
          </Card>
          
          {/* Address Card */}
          <Card variant="outline">
            <CardHeader>
              <HStack>
                <Icon as={FiHome} color="blue.500" />
                <Heading size="md">Adresse</Heading>
              </HStack>
            </CardHeader>
            <Divider />
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                <FormControl>
                  <FormLabel>Adresse</FormLabel>
                  <Input 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Rue de l'Exemple"
                    leftElement={<Icon as={FiMapPin} color="gray.400" ml={3} />}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Code postal</FormLabel>
                  <Input 
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="75001"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Ville</FormLabel>
                  <Input 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Paris"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Pays</FormLabel>
                  <Select 
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Sélectionner un pays..."
                  >
                    {countryOptions.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>
            </CardBody>
          </Card>
          
          {/* Doctor Information Card */}
          <Card variant="outline">
            <CardHeader>
              <HStack>
                <Icon as={FiUser} color="blue.500" />
                <Heading size="md">Médecin traitant</Heading>
              </HStack>
            </CardHeader>
            <Divider />
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                <FormControl>
                  <FormLabel>Nom du médecin</FormLabel>
                  <Input 
                    name="referringDoctor"
                    value={formData.referringDoctor}
                    onChange={handleChange}
                    placeholder="Dr. Martin"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Téléphone</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiPhone} color="gray.400" />
                    </InputLeftElement>
                    <Input 
                      type="tel"
                      name="referringDoctorPhone"
                      value={formData.referringDoctorPhone}
                      onChange={handleChange}
                      placeholder="01 23 45 67 89"
                    />
                  </InputGroup>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    type="email"
                    name="referringDoctorEmail"
                    value={formData.referringDoctorEmail}
                    onChange={handleChange}
                    placeholder="medecin@example.com"
                    leftElement={<Icon as={FiMail} color="gray.400" ml={3} />}
                  />
                </FormControl>
              </SimpleGrid>
            </CardBody>
          </Card>
          
          {/* Tags and Notes Card */}
          <Card variant="outline">
            <CardHeader>
              <HStack>
                <Icon as={FiFileText} color="blue.500" />
                <Heading size="md">Étiquettes et notes</Heading>
              </HStack>
            </CardHeader>
            <Divider />
            <CardBody>
              <VStack spacing={6} align="stretch">
                <FormControl>
                  <FormLabel>Étiquettes</FormLabel>
                  <HStack spacing={2} mb={2} flexWrap="wrap">
                    {formData.tags.map(tag => (
                      <Tag key={tag} size="md" variant="subtle" colorScheme="blue" borderRadius="full">
                        <TagLabel>{tag}</TagLabel>
                        <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                      </Tag>
                    ))}
                  </HStack>
                  <HStack>
                    <Input 
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Ajouter une étiquette"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <Button 
                      leftIcon={<FiPlus />} 
                      onClick={handleAddTag}
                      isDisabled={!newTag.trim()}
                    >
                      Ajouter
                    </Button>
                  </HStack>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Notes</FormLabel>
                  <Textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Ajoutez des notes sur le patient..."
                    rows={6}
                  />
                  <FormHelperText>
                    Ces notes sont privées et ne seront pas partagées avec le patient.
                  </FormHelperText>
                </FormControl>
                
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="isActive" mb="0">
                    Patient actif
                  </FormLabel>
                  <Switch 
                    id="isActive" 
                    name="isActive"
                    isChecked={formData.isActive}
                    onChange={handleSwitchChange}
                    colorScheme="blue"
                  />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
          
          {/* Form Actions */}
          <HStack justify="flex-end" spacing={4} mt={4}>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              isDisabled={isLoading}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              colorScheme="blue"
              leftIcon={<FiSave />}
              isLoading={isLoading}
              loadingText="Enregistrement..."
            >
              Enregistrer les modifications
            </Button>
          </HStack>
        </VStack>
      </form>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Supprimer le patient
            </AlertDialogHeader>

            <AlertDialogBody>
              Êtes-vous sûr de vouloir supprimer définitivement ce patient ?
              Cette action est irréversible et supprimera toutes les données associées.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} isDisabled={isDeleting}>
                Annuler
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleDelete} 
                ml={3}
                isLoading={isDeleting}
                loadingText="Suppression..."
              >
                Supprimer définitivement
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default EditPatient;

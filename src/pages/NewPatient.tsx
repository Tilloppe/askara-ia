import { useState } from 'react';
import { 
  Box, 
  Button, 
  VStack, 
  HStack, 
  Heading,
  Input,

  FormControl,
  FormLabel,
  useToast,
  Select,
  Textarea,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Text,
  Grid,
  FormHelperText,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
// Icônes temporairement désactivées pour résoudre les erreurs de compilation
// import { 
//   EmailIcon, 
//   PhoneIcon, 
//   InfoIcon, 
//   InfoOutlineIcon,
//   EditIcon
// } from '@chakra-ui/icons';

interface FormData {
  civility: string;
  lastName: string;
  firstName: string;
  birthDate: string;
  birthPlace: string;
  socialSecurityNumber: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  referringDoctor: string;
  referringDoctorPhone: string;
  referringDoctorEmail: string;
  notes: string;
}

const NewPatient = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    civility: 'M.',
    lastName: '',
    firstName: '',
    birthDate: '',
    birthPlace: '',
    socialSecurityNumber: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    country: 'France',
    referringDoctor: '',
    referringDoctorPhone: '',
    referringDoctorEmail: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler un appel API
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Patient enregistré",
        description: "Les informations du patient ont été enregistrées avec succès.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate('/patients');
    }, 1500);
  };

  const handleCancel = () => {
    navigate('/patients');
  };

  return (
    <Box p={4}>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Nouveau patient</Heading>
        <HStack>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            isDisabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Enregistrement..."
          >
            Enregistrer
          </Button>
        </HStack>
      </HStack>
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          {/* Informations personnelles */}
          <Card variant="outline">
            <CardHeader pb={2}>
              <HStack>
                <Text fontWeight="bold">Informations personnelles</Text>
              </HStack>
            </CardHeader>
            <Divider />
            <CardBody>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
                <FormControl>
                  <FormLabel>Civilité</FormLabel>
                  <Select 
                    name="civility"
                    value={formData.civility}
                    onChange={handleChange}
                  >
                    <option value="M.">M.</option>
                    <option value="Mme">Mme</option>
                    <option value="Dr">Dr</option>
                  </Select>
                </FormControl>
                
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
                
                <FormControl>
                  <FormLabel>Date de naissance</FormLabel>
                  <Input 
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Lieu de naissance</FormLabel>
                  <Input 
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleChange}
                    placeholder="Ville, Pays"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>N° de sécurité sociale</FormLabel>
                  <Input 
                    name="socialSecurityNumber"
                    value={formData.socialSecurityNumber}
                    onChange={handleChange}
                    placeholder="1 85 08 17 518 518 29"
                  />
                  <FormHelperText>Format : 1 85 08 17 518 518 29</FormHelperText>
                </FormControl>
              </Grid>
            </CardBody>
          </Card>
          
          {/* Coordonnées */}
          <Card variant="outline">
            <CardHeader pb={2}>
              <HStack>
                <Text fontWeight="bold">Coordonnées</Text>
              </HStack>
            </CardHeader>
            <Divider />
            <CardBody>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                <FormControl>
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
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="06 12 34 56 78"
                  />
                </FormControl>
                
                <FormControl gridColumn={{ base: '1 / -1' }}>
                  <FormLabel>Adresse</FormLabel>
                  <Input 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 rue de l'exemple"
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
                  <Input 
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="France"
                  />
                </FormControl>
              </Grid>
            </CardBody>
          </Card>
          
          {/* Médecin traitant */}
          <Card variant="outline">
            <CardHeader pb={2}>
              <HStack>
                <Text fontWeight="bold">Médecin traitant</Text>
              </HStack>
            </CardHeader>
            <Divider />
            <CardBody>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
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
                  <Input 
                    type="tel"
                    name="referringDoctorPhone"
                    value={formData.referringDoctorPhone}
                    onChange={handleChange}
                    placeholder="01 23 45 67 89"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    type="email"
                    name="referringDoctorEmail"
                    value={formData.referringDoctorEmail}
                    onChange={handleChange}
                    placeholder="medecin@example.com"
                  />
                </FormControl>
              </Grid>
            </CardBody>
          </Card>
          
          {/* Notes */}
          <Card variant="outline">
            <CardHeader pb={2}>
              <HStack>
                <Text fontWeight="bold">Notes</Text>
              </HStack>
            </CardHeader>
            <Divider />
            <CardBody>
              <FormControl>
                <FormLabel>Informations complémentaires</FormLabel>
                <Textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Ajoutez des notes ou des informations complémentaires sur le patient..."
                  rows={4}
                />
                <FormHelperText>
                  Ces informations ne sont visibles que par vous et votre équipe.
                </FormHelperText>
              </FormControl>
            </CardBody>
          </Card>
          
          <HStack justify="flex-end" mt={4} spacing={4}>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              isDisabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              colorScheme="blue" 
              type="submit"
              isLoading={isSubmitting}
              loadingText="Enregistrement..."
            >
              Enregistrer le patient
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};

export default NewPatient;

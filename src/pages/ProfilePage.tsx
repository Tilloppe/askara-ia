import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useColorModeValue,
  Text,
  HStack,
  Avatar,
  IconButton,
  useToast,
  Divider,
  Textarea,
  Select,
  FormHelperText,
} from '@chakra-ui/react';
import { FiEdit2, FiSave, FiUpload, FiUser, FiPhone, FiMail, FiMapPin, FiHome, FiGlobe } from 'react-icons/fi';

interface AudiologistProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cabinet: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    website: string;
    siret: string;
  };
  specializations: string[];
  bio: string;
}

const ProfilePage = () => {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Données de l'audioprothésiste (à remplacer par les données réelles de l'utilisateur connecté)
  const [profile, setProfile] = useState<AudiologistProfile>({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    cabinet: {
      name: 'Audition Plus',
      address: '123 Avenue des Champs-Élysées',
      city: 'Paris',
      postalCode: '75008',
      country: 'France',
      phone: '+33 1 23 45 67 89',
      website: 'www.auditionplus.fr',
      siret: '123 456 789 00012',
    },
    specializations: ['Appareillage auditif', 'Audiométrie', 'Bilan auditif'],
    bio: 'Audioprothésiste diplômé avec plus de 10 ans d\'expérience dans le domaine de l\'audition. Spécialisé dans les solutions auditives sur mesure pour adultes et seniors.'
  });

  const [formData, setFormData] = useState<AudiologistProfile>({ ...profile });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof AudiologistProfile],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simuler un appel API pour sauvegarder les modifications
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(formData);
      setIsEditing(false);
      
      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été mises à jour avec succès.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la mise à jour de votre profil.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.750');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box maxW="6xl" mx="auto" p={6}>
      <VStack spacing={8} align="stretch">
        {/* En-tête */}
        <Box>
          <Heading size="xl" mb={2}>Mon Profil</Heading>
          <Text color="gray.500">Gérez vos informations personnelles et professionnelles</Text>
        </Box>

        <Box
          bg={cardBg}
          borderRadius="lg"
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
          p={6}
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
              {/* Photo de profil et informations de base */}
              <HStack spacing={6} align="start">
                <Box position="relative">
                  <Avatar
                    size="2xl"
                    name={`${profile.firstName} ${profile.lastName}`}
                    bg="brand.500"
                    color="white"
                    mb={4}
                  />
                  {isEditing && (
                    <IconButton
                      aria-label="Modifier la photo"
                      icon={<FiUpload />}
                      size="sm"
                      position="absolute"
                      bottom={6}
                      right={2}
                      borderRadius="full"
                      colorScheme="brand"
                    />
                  )}
                </Box>
                
                <VStack align="stretch" spacing={4} flex={1}>
                  <HStack justify="space-between" align="center">
                    <Heading size="md">Informations personnelles</Heading>
                    {!isEditing ? (
                      <Button
                        leftIcon={<FiEdit2 />}
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        size="sm"
                      >
                        Modifier
                      </Button>
                    ) : (
                      <HStack>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setFormData(profile);
                            setIsEditing(false);
                          }}
                          size="sm"
                        >
                          Annuler
                        </Button>
                        <Button
                          type="submit"
                          leftIcon={<FiSave />}
                          colorScheme="brand"
                          size="sm"
                          isLoading={isLoading}
                          loadingText="Enregistrement..."
                        >
                          Enregistrer
                        </Button>
                      </HStack>
                    )}
                  </HStack>
                  
                  <HStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Prénom</FormLabel>
                      {isEditing ? (
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Votre prénom"
                        />
                      ) : (
                        <Text>{profile.firstName}</Text>
                      )}
                    </FormControl>
                    
                    <FormControl isRequired>
                      <FormLabel>Nom</FormLabel>
                      {isEditing ? (
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Votre nom"
                        />
                      ) : (
                        <Text>{profile.lastName}</Text>
                      )}
                    </FormControl>
                  </HStack>
                  
                  <HStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      {isEditing ? (
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="votre@email.com"
                        />
                      ) : (
                        <HStack>
                          <FiMail />
                          <Text>{profile.email}</Text>
                        </HStack>
                      )}
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Téléphone</FormLabel>
                      {isEditing ? (
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+33 6 12 34 56 78"
                        />
                      ) : (
                        <HStack>
                          <FiPhone />
                          <Text>{profile.phone}</Text>
                        </HStack>
                      )}
                    </FormControl>
                  </HStack>
                </VStack>
              </HStack>
              
              <Divider my={4} />
              
              {/* Informations du cabinet */}
              <Box>
                <HStack justify="space-between" align="center" mb={4}>
                  <Heading size="md">Informations du cabinet</Heading>
                </HStack>
                
                <VStack spacing={4} align="stretch">
                  <HStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Nom du cabinet</FormLabel>
                      {isEditing ? (
                        <Input
                          name="cabinet.name"
                          value={formData.cabinet.name}
                          onChange={handleInputChange}
                          placeholder="Nom du cabinet"
                        />
                      ) : (
                        <HStack>
                          <FiHome />
                          <Text>{profile.cabinet.name}</Text>
                        </HStack>
                      )}
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Téléphone du cabinet</FormLabel>
                      {isEditing ? (
                        <Input
                          type="tel"
                          name="cabinet.phone"
                          value={formData.cabinet.phone}
                          onChange={handleInputChange}
                          placeholder="+33 1 23 45 67 89"
                        />
                      ) : (
                        <HStack>
                          <FiPhone />
                          <Text>{profile.cabinet.phone}</Text>
                        </HStack>
                      )}
                    </FormControl>
                  </HStack>
                  
                  <FormControl isRequired>
                    <FormLabel>Adresse</FormLabel>
                    {isEditing ? (
                      <Input
                        name="cabinet.address"
                        value={formData.cabinet.address}
                        onChange={handleInputChange}
                        placeholder="Adresse du cabinet"
                      />
                    ) : (
                      <HStack>
                        <FiMapPin />
                        <Text>{profile.cabinet.address}</Text>
                      </HStack>
                    )}
                  </FormControl>
                  
                  <HStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Code postal</FormLabel>
                      {isEditing ? (
                        <Input
                          name="cabinet.postalCode"
                          value={formData.cabinet.postalCode}
                          onChange={handleInputChange}
                          placeholder="75000"
                        />
                      ) : (
                        <Text>{profile.cabinet.postalCode}</Text>
                      )}
                    </FormControl>
                    
                    <FormControl isRequired>
                      <FormLabel>Ville</FormLabel>
                      {isEditing ? (
                        <Input
                          name="cabinet.city"
                          value={formData.cabinet.city}
                          onChange={handleInputChange}
                          placeholder="Ville"
                        />
                      ) : (
                        <Text>{profile.cabinet.city}</Text>
                      )}
                    </FormControl>
                    
                    <FormControl isRequired>
                      <FormLabel>Pays</FormLabel>
                      {isEditing ? (
                        <Input
                          name="cabinet.country"
                          value={formData.cabinet.country}
                          onChange={handleInputChange}
                          placeholder="Pays"
                        />
                      ) : (
                        <Text>{profile.cabinet.country}</Text>
                      )}
                    </FormControl>
                  </HStack>
                  
                  <HStack spacing={4}>
                    <FormControl>
                      <FormLabel>Site web</FormLabel>
                      {isEditing ? (
                        <Input
                          type="url"
                          name="cabinet.website"
                          value={formData.cabinet.website}
                          onChange={handleInputChange}
                          placeholder="www.votrecabinet.fr"
                        />
                      ) : (
                        <HStack>
                          <FiGlobe />
                          <Text as="a" href={`https://${profile.cabinet.website}`} target="_blank" color="blue.500">
                            {profile.cabinet.website}
                          </Text>
                        </HStack>
                      )}
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>N° SIRET</FormLabel>
                      {isEditing ? (
                        <Input
                          name="cabinet.siret"
                          value={formData.cabinet.siret}
                          onChange={handleInputChange}
                          placeholder="123 456 789 00012"
                        />
                      ) : (
                        <Text>{profile.cabinet.siret}</Text>
                      )}
                    </FormControl>
                  </HStack>
                </VStack>
              </Box>
              
              <Divider my={4} />
              
              {/* Spécialisations et bio */}
              <Box>
                <HStack justify="space-between" align="center" mb={4}>
                  <Heading size="md">À propos</Heading>
                </HStack>
                
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Spécialisations</FormLabel>
                    {isEditing ? (
                      <Select
                        placeholder="Sélectionnez vos spécialisations"
                        isMulti
                        value={formData.specializations.map(spec => ({
                          label: spec,
                          value: spec
                        }))}
                        onChange={(selectedOptions) => {
                          setFormData(prev => ({
                            ...prev,
                            specializations: selectedOptions.map((opt: any) => opt.value)
                          }));
                        }}
                        options={[
                          { value: 'Appareillage auditif', label: 'Appareillage auditif' },
                          { value: 'Audiométrie', label: 'Audiométrie' },
                          { value: 'Bilan auditif', label: 'Bilan auditif' },
                          { value: 'Empreinte auriculaire', label: 'Empreinte auriculaire' },
                          { value: 'Contrôle auditif', label: 'Contrôle auditif' },
                          { value: 'Aides auditives', label: 'Aides auditives' },
                        ]}
                      />
                    ) : (
                      <HStack spacing={2} flexWrap="wrap">
                        {profile.specializations.map((spec, index) => (
                          <Box
                            key={index}
                            bg="brand.50"
                            color="brand.600"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="sm"
                          >
                            {spec}
                          </Box>
                        ))}
                      </HStack>
                    )}
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Biographie</FormLabel>
                    {isEditing ? (
                      <Textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Décrivez votre parcours et votre expérience..."
                        rows={4}
                      />
                    ) : (
                      <Text whiteSpace="pre-line">{profile.bio}</Text>
                    )}
                    <FormHelperText>Présentez-vous à vos patients</FormHelperText>
                  </FormControl>
                </VStack>
              </Box>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Box>
  );
};

export default ProfilePage;

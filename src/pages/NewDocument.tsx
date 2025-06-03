import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  VStack, 
  HStack, 
  Button, 
  Text, 
  Select, 
  Textarea, 
  useToast,
  IconButton,
  Badge,
  Card,
  CardBody,
  Divider,
  Spinner,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { FiMic, FiMicOff, FiSave, FiX, FiPlay, FiPause, FiTrash2, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Mock data for document types and patients
const documentTypes = [
  { id: 'consultation', label: 'Compte-rendu de consultation' },
  { id: 'prescription', label: 'Ordonnance' },
  { id: 'certificate', label: 'Certificat médical' },
  { id: 'report', label: 'Compte-rendu opératoire' },
  { id: 'letter', label: 'Courrier confrère/consœur' },
];

const patients = [
  { id: '1', name: 'Jean Dupont', birthDate: '15/03/1975' },
  { id: '2', name: 'Marie Martin', birthDate: '22/08/1982' },
  { id: '3', name: 'Pierre Bernard', birthDate: '03/11/1965' },
];

const NewDocument = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [documentType, setDocumentType] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordings, setRecordings] = useState<{id: string, text: string, timestamp: string}[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  
  // Mock Web Speech API for demo purposes
  const recognitionRef = useRef<any>(null);
  const speechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  useEffect(() => {
    if (speechRecognition) {
      recognitionRef.current = new speechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript(prev => prev + ' ' + transcript);
          } else {
            interimTranscript += transcript;
          }
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de la reconnaissance vocale.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        stopRecording();
      };
    } else {
      toast({
        title: 'Non supporté',
        description: 'La reconnaissance vocale n\'est pas supportée par votre navigateur.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  const startRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setIsPaused(false);
        setTranscript('');
      } catch (error) {
        console.error('Error starting recording:', error);
      }
    }
  };
  
  const pauseRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsPaused(true);
    }
  };
  
  const resumeRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsPaused(false);
    }
  };
  
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (transcript.trim()) {
        const newRecording = {
          id: Date.now().toString(),
          text: transcript,
          timestamp: new Date().toLocaleTimeString(),
        };
        setRecordings(prev => [...prev, newRecording]);
        setSelectedRecording(newRecording.id);
      }
    }
  };
  
  const deleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(rec => rec.id !== id));
    if (selectedRecording === id) {
      setSelectedRecording(recordings.length > 1 ? recordings[0].id : null);
    }
  };
  
  const generateDocument = async () => {
    if (!documentType) {
      toast({
        title: 'Type de document requis',
        description: 'Veuillez sélectionner un type de document.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    if (!selectedRecording) {
      toast({
        title: 'Aucun enregistrement',
        description: 'Veuillez effectuer un enregistrement vocal avant de générer le document.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real app, this would call your backend API to process the audio/text with AI
      // For now, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful document generation
      toast({
        title: 'Document généré',
        description: 'Votre document a été généré avec succès !',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Navigate to document preview/editor
      navigate('/documents/123');
    } catch (error) {
      console.error('Error generating document:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la génération du document.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSaveDraft = () => {
    // In a real app, this would save the current state as a draft
    toast({
      title: 'Brouillon enregistré',
      description: 'Votre brouillon a été enregistré avec succès.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const handleCancel = () => {
    if (transcript.trim() || recordings.length > 0) {
      onOpen();
    } else {
      navigate('/documents');
    }
  };
  
  const confirmCancel = () => {
    onClose();
    navigate('/documents');
  };

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Nouveau document</Heading>
        <HStack>
          <Button 
            variant="outline" 
            leftIcon={<FiX />} 
            onClick={handleCancel}
            isDisabled={isProcessing}
          >
            Annuler
          </Button>
          <Button 
            colorScheme="blue" 
            leftIcon={<FiSave />} 
            onClick={handleSaveDraft}
            isDisabled={isProcessing}
          >
            Enregistrer le brouillon
          </Button>
        </HStack>
      </HStack>
      
      <Card mb={6}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <Box flex={1}>
                <Text mb={2} fontWeight="medium">Type de document</Text>
                <Select 
                  placeholder="Sélectionner un type"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  isDisabled={isProcessing}
                >
                  {documentTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </Box>
              
              <Box flex={1}>
                <Text mb={2} fontWeight="medium">Patient (optionnel)</Text>
                <Select 
                  placeholder="Sélectionner un patient"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  isDisabled={isProcessing}
                >
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </Select>
              </Box>
            </HStack>
            
            <Box mt={4}>
              <Text mb={2} fontWeight="medium">Dictée vocale</Text>
              <HStack spacing={4} mb={4}>
                {!isRecording ? (
                  <Button 
                    leftIcon={<FiMic />} 
                    colorScheme="red" 
                    onClick={startRecording}
                    isDisabled={isProcessing}
                  >
                    Démarrer la dictée
                  </Button>
                ) : (
                  <>
                    <Button 
                      leftIcon={<FiMicOff />} 
                      colorScheme="red" 
                      variant="outline"
                      onClick={stopRecording}
                    >
                      Arrêter
                    </Button>
                    
                    {isPaused ? (
                      <Button 
                        leftIcon={<FiPlay />} 
                        onClick={resumeRecording}
                      >
                        Reprendre
                      </Button>
                    ) : (
                      <Button 
                        leftIcon={<FiPause />} 
                        variant="outline"
                        onClick={pauseRecording}
                      >
                        Pause
                      </Button>
                    )}
                  </>
                )}
                
                <Text color="gray.500" fontSize="sm">
                  {isRecording && !isPaused && (
                    <HStack>
                      <Box w="2" h="2" bg="red.500" borderRadius="full" />
                      <span>Enregistrement en cours...</span>
                    </HStack>
                  )}
                  {isPaused && 'Enregistrement en pause'}
                </Text>
              </HStack>
              
              <Textarea
                placeholder="Votre transcription apparaîtra ici..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={6}
                isReadOnly={isRecording || isProcessing}
              />
            </Box>
          </VStack>
        </CardBody>
      </Card>
      
      {recordings.length > 0 && (
        <Card mb={6}>
          <CardBody>
            <Text fontWeight="medium" mb={4}>Enregistrements précédents</Text>
            <VStack align="stretch" spacing={4}>
              {recordings.map(recording => (
                <Box 
                  key={recording.id}
                  borderWidth="1px" 
                  borderRadius="md" 
                  p={4}
                  bg={selectedRecording === recording.id ? 'blue.50' : 'white'}
                  borderColor={selectedRecording === recording.id ? 'blue.200' : 'gray.200'}
                  cursor="pointer"
                  onClick={() => setSelectedRecording(recording.id)}
                >
                  <HStack justify="space-between" mb={2}>
                    <HStack>
                      <Badge colorScheme="blue">{recording.timestamp}</Badge>
                      {selectedRecording === recording.id && (
                        <Badge colorScheme="green">Sélectionné</Badge>
                      )}
                    </HStack>
                    <IconButton
                      icon={<FiTrash2 />}
                      aria-label="Supprimer"
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRecording(recording.id);
                      }}
                    />
                  </HStack>
                  <Text 
                    noOfLines={2} 
                    fontSize="sm" 
                    color="gray.600"
                  >
                    {recording.text || 'Aucun texte transcrit'}
                  </Text>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      )}
      
      <Box textAlign="right">
        <Button 
          colorScheme="blue" 
          size="lg" 
          onClick={generateDocument}
          isDisabled={!documentType || !selectedRecording || isProcessing}
          leftIcon={isProcessing ? <Spinner size="sm" /> : undefined}
        >
          {isProcessing ? 'Génération en cours...' : 'Générer le document'}
        </Button>
      </Box>
      
      {/* Cancel Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Annuler la création
            </AlertDialogHeader>

            <AlertDialogBody>
              Êtes-vous sûr de vouloir annuler ? Toutes les modifications non enregistrées seront perdues.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Continuer l'édition
              </Button>
              <Button colorScheme="red" onClick={confirmCancel} ml={3}>
                Annuler
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default NewDocument;

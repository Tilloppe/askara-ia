import { Button, Icon, Tooltip, useToast } from '@chakra-ui/react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';

// Déclaration du type pour la reconnaissance vocale
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
  const SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  start: () => void;
  stop: () => void;
}

interface VoiceToTextButtonProps {
  onTranscription: (text: string) => void;
  isDisabled?: boolean;
  lang?: string;
  templateContent?: string; // Contenu du modèle avec les variables {{...}}
  fieldName?: string; // Nom du champ en cours de modification
}

const VoiceToTextButton: React.FC<VoiceToTextButtonProps> = ({
  onTranscription,
  isDisabled = false,
  lang = 'fr-FR',
  templateContent = '',
  fieldName = 'content',
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognition = useRef<SpeechRecognition | null>(null);
  const isMounted = useRef(true);
  const toast = useToast();
  const transcriptRef = useRef('');

  useEffect(() => {
    isMounted.current = true;
    
    // Vérifier si l'API de reconnaissance vocale est disponible
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({
        title: 'Navigateur non supporté',
        description: 'La reconnaissance vocale n\'est pas supportée par votre navigateur.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Initialiser la reconnaissance vocale
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;
    recognition.current.lang = lang;

    // Gérer les résultats de la reconnaissance
    recognition.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Mettre à jour le texte transcrit
      const newTranscript = transcriptRef.current + finalTranscript;
      transcriptRef.current = newTranscript;
      
      // Si on a un template, on remplace uniquement la variable en cours
      if (templateContent && fieldName) {
        // Trouver la variable actuelle à remplacer
        const regex = new RegExp(`{{${fieldName}}}`, 'g');
        const updatedContent = templateContent.replace(regex, newTranscript + interimTranscript);
        onTranscription(updatedContent);
      } else {
        // Comportement par défaut si pas de template
        onTranscription(newTranscript + interimTranscript);
      }
    };

    // Gérer les erreurs
    recognition.current.onerror = (event: any) => {
      console.error('Erreur de reconnaissance vocale:', event.error);
      setIsListening(false);
      toast({
        title: 'Erreur de reconnaissance vocale',
        description: event.error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    };

    // Nettoyer à la suppression du composant
    return () => {
      isMounted.current = false;
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, [lang, onTranscription, toast]);

  const toggleListening = () => {
    if (!recognition.current) {
      toast({
        title: 'Erreur',
        description: 'La reconnaissance vocale n\'est pas disponible.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      transcriptRef.current = '';
      recognition.current.start();
      setIsListening(true);
      
      toast({
        title: 'Écoute...',
        description: 'Parlez maintenant',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Tooltip label={isListening ? 'Arrêter la dictée' : 'Démarrer la dictée'}>
      <Button
        onClick={toggleListening}
        colorScheme={isListening ? 'red' : 'gray'}
        variant="outline"
        isDisabled={isDisabled}
        leftIcon={isListening ? <Icon as={FaMicrophoneSlash as any} /> : <Icon as={FaMicrophone as any} />}
        size="sm"
      >
        {isListening ? 'Arrêter' : 'Dictée'}
      </Button>
    </Tooltip>
  );
};

export default VoiceToTextButton;

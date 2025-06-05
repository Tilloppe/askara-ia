import { Button, IconButton, Tooltip, useToast } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
// Utilisation d'émojis au lieu d'icônes pour éviter les problèmes d'importation

interface VoiceInputProps {
  onResult: (text: string) => void;
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  buttonText?: string;
}

export const VoiceInput = ({
  onResult,
  isListening,
  onStart,
  onStop,
  buttonText = 'Parler',
}: VoiceInputProps) => {
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const toast = useToast();

  useEffect(() => {
    // Vérifier la compatibilité du navigateur
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        const results = event.results as SpeechRecognitionResultList;
        const transcript = Array.from(results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        
        onResult(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Erreur de reconnaissance vocale:', event.error);
        toast({
          title: 'Erreur',
          description: 'Une erreur est survenue avec la reconnaissance vocale',
          status: 'error',
          duration: 3000,
        });
        onStop();
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onResult, onStop, toast]);

  const toggleListening = () => {
    if (!isListening) {
      onStart();
      recognitionRef.current?.start();
    } else {
      recognitionRef.current?.stop();
      onStop();
    }
  };

  if (!isSupported) {
    return (
      <Tooltip label="La reconnaissance vocale n'est pas supportée sur ce navigateur">
        <Button isDisabled leftIcon={<span>🎤</span>}>
          {buttonText}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Tooltip label={isListening ? "Arrêter la dictée" : "Démarrer la dictée"}>
      <IconButton
        icon={<span>{isListening ? '🛑' : '🎤'}</span>}
        onClick={toggleListening}
        colorScheme={isListening ? 'red' : 'blue'}
        aria-label={isListening ? 'Arrêter la dictée' : 'Démarrer la dictée'}
        isLoading={isListening}
        variant={isListening ? 'solid' : 'outline'}
      />
    </Tooltip>
  );
};

// Exportation par défaut du composant
export default VoiceInput;

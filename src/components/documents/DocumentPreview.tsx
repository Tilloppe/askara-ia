import React, { useRef, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Button,
  HStack,
  useToast,
  ModalFooter,
  VStack,
  useDisclosure,
  Input,
  ModalBody,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { DownloadIcon, EmailIcon } from '@chakra-ui/icons';
import type { Document } from '../../types/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface DocumentPreviewProps {
  document: Document & { content?: string };
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => Promise<boolean>;
  isSaving?: boolean;
  onSendEmail?: (document: Document, email: string) => Promise<void>;
  contacts?: Array<{ id: string; name: string; email: string }>;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  isOpen,
  onClose,
  document,
  isSaving = false,
  onSendEmail
}) => {
  const toast = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const { isOpen: isEmailFormOpen, onOpen: openEmailForm, onClose: closeEmailForm } = useDisclosure();
  const [email, setEmail] = useState('');

  const toggleEmailForm = () => {
    if (isEmailFormOpen) {
      closeEmailForm();
    } else {
      openEmailForm();
    }
  };

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    
    const element = printRef.current;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    try {
      // Créer un conteneur pour le clonage
      const container = window.document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.width = '210mm';
      container.style.padding = '20mm';
      
      const elementCopy = element.cloneNode(true) as HTMLElement;
      container.appendChild(elementCopy);
      window.document.body.appendChild(container);
      
      const sections = elementCopy.querySelectorAll('.document-section');
      const hasSections = sections.length > 0;
      
      if (hasSections) {
        // Si des sections sont définies, les traiter une par une
        for (let i = 0; i < sections.length; i++) {
          const canvas = await html2canvas(sections[i] as HTMLElement, { 
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
          });
          
          const imgData = canvas.toDataURL('image/png');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          
          if (i > 0) pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
        }
      } else {
        // Sinon, capturer tout le contenu en une seule fois
        const canvas = await html2canvas(elementCopy, { 
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
      }
      
      // Nettoyer
      window.document.body.removeChild(container);
      
      // Télécharger le PDF
      pdf.save(`document-${document.title || 'sans-titre'}.pdf`);
      
      toast({
        title: 'Export réussi',
        description: 'Le document a été exporté en PDF avec succès',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'export du document',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSendEmail = async () => {
    if (!email || !onSendEmail) return;
    
    try {
      await onSendEmail(document, email);
      toast({
        title: 'Email envoyé',
        description: 'Le document a été envoyé avec succès',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setEmail('');
      closeEmailForm();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'envoi de l\'email',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const printStyles = `
    @media print {
      body * {
        visibility: hidden;
      }
      .print-content, .print-content * {
        visibility: visible;
      }
      .print-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 20px;
      }
      .no-print {
        display: none !important;
      }
      .document-section {
        page-break-inside: avoid;
        break-inside: avoid;
        margin-bottom: 20px;
      }
      img {
        max-width: 100%;
        height: auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 10px 0;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
      }
    }`;

  // Gestionnaire d'événements pour la modale
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  // Gestionnaire de fermeture de la modale
  const handleCloseModal = () => {
    onClose();
  };

  return (
    <div onClick={handleModalClick}>
      <Modal 
        isOpen={isOpen} 
        onClose={handleCloseModal} 
        size="6xl" 
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Prévisualisation du document</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <style>{printStyles}</style>
            <div 
              ref={printRef} 
              className="document-content print-content" 
              style={{ 
                padding: '20px',
                fontFamily: 'Arial, sans-serif',
                lineHeight: 1.6,
                color: '#333',
                maxWidth: '210mm',
                margin: '0 auto',
                backgroundColor: 'white',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)'
              }}
            >
              {document.content ? (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: document.content 
                      .replace(/<p>/g, '<p style="margin: 0 0 1em 0;">')
                      .replace(/<h1>/g, '<h1 style="font-size: 2em; margin: 1em 0 0.5em 0; font-weight: bold;">')
                      .replace(/<h2>/g, '<h2 style="font-size: 1.5em; margin: 1em 0 0.5em 0; font-weight: bold;">')
                      .replace(/<h3>/g, '<h3 style="font-size: 1.2em; margin: 1em 0 0.5em 0; font-weight: bold;">')
                      .replace(/<ul>/g, '<ul style="margin: 0.5em 0 0.5em 1.5em; padding: 0;">')
                      .replace(/<ol>/g, '<ol style="margin: 0.5em 0 0.5em 1.5em; padding: 0 0 0 1.5em;">')
                  }} 
                />
              ) : (
                <p style={{ color: '#666', fontStyle: 'italic' }}>
                  Aucun contenu à afficher
                </p>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4}>
              <Button
                leftIcon={<DownloadIcon />}
                colorScheme="blue"
                onClick={handleExportPDF}
                isLoading={isSaving}
                loadingText="Génération..."
              >
                Exporter en PDF
              </Button>
              {onSendEmail && (
                <Button
                  leftIcon={<EmailIcon />}
                  colorScheme="teal"
                  onClick={toggleEmailForm}
                  isDisabled={isSaving}
                >
                  Envoyer par email
                </Button>
              )}
              <Button 
                onClick={handleCloseModal} 
                variant="ghost"
                isDisabled={isSaving}
              >
                Fermer
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal d'envoi d'email */}
      <Modal isOpen={isEmailFormOpen} onClose={closeEmailForm} onCloseComplete={() => {}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Envoyer par email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Adresse email du destinataire</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemple.com"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4}>
              <Button onClick={closeEmailForm} variant="ghost">
                Annuler
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={handleSendEmail}
                isDisabled={!email}
                isLoading={isSaving}
              >
                Envoyer
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DocumentPreview;

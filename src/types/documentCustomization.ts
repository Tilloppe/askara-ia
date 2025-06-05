export interface DocumentCustomization {
  header: {
    logo?: string;
    title: string;
    subtitle: string;
    contactInfo: string;
    showLogo: boolean;
    showTitle: boolean;
    showContact: boolean;
    alignment: 'left' | 'center' | 'right';
  };
  footer: {
    signature?: string;
    name: string;
    title: string;
    contact: {
      phone: string;
      email: string;
      address: string;
    };
    showSignature: boolean;
    showContact: boolean;
    showLogo: boolean;
    logo?: string;
    alignment: 'left' | 'center' | 'right';
  };
  styles: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    fontSize: string;
    lineHeight: number;
  };
}

export const defaultCustomization: DocumentCustomization = {
  header: {
    title: 'Cabinet d\'Audiologie',
    subtitle: 'Spécialiste de l\'audition',
    contactInfo: '123 Rue de l\'Audition, 75000 Paris\nTél: 01 23 45 67 89',
    showLogo: true,
    showTitle: true,
    showContact: true,
    alignment: 'center',
  },
  footer: {
    name: 'Dr. Jean Dupont',
    title: 'Audioprothésiste Diplômé',
    contact: {
      phone: '01 23 45 67 89',
      email: 'contact@cabinet-audition.fr',
      address: '123 Rue de l\'Audition, 75000 Paris',
    },
    showSignature: true,
    showContact: true,
    showLogo: false,
    alignment: 'center',
  },
  styles: {
    fontFamily: 'Arial, sans-serif',
    primaryColor: '#3182ce',
    secondaryColor: '#2c5282',
    fontSize: '14px',
    lineHeight: 1.6,
  },
};

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  fields: string[];
  tags: string[];
  showPrintButton?: boolean;
  showEmailButton?: boolean;
  showContactSelector?: boolean;
}

export const documentTemplates: DocumentTemplate[] = [
  {
    id: 'courrier-medecin',
    name: 'Courrier au médecin ORL / Médecin traitant',
    description: 'Modèle de courrier pour le médecin ORL ou traitant',
    content: `À l'attention de : Dr {{doctorName}}
Spécialité : {{specialty}}
Objet : Information sur l'appareillage auditif de M./Mme {{patientName}}

Cher confrère / chère consœur,

Je vous informe que j'ai pris en charge l'adaptation prothétique de votre patient(e). Vous trouverez ci-dessous un résumé de la prise en charge :

1. Résultats audiométriques :
{{audiometricResults}}

2. Appareillage proposé :
{{proposedDevice}}

3. Premiers retours du patient :
{{patientFeedback}}

Je reste à votre disposition pour toute information complémentaire.

Bien cordialement,

{{audiologistName}}
{{clinicAddress}}
{{contactInfo}}`,
    fields: [
      'doctorName',
      'specialty',
      'patientName',
      'audiometricResults',
      'proposedDevice',
      'patientFeedback',
      'audiologistName',
      'clinicAddress',
      'contactInfo'
    ],
    tags: ['courrier', 'médecin', 'ORL', 'traitant'],
    showPrintButton: true,
    showEmailButton: true,
    showContactSelector: true
  },
  {
    id: 'bilan-audioprothetique',
    name: 'Bilan audioprothétique initial',
    description: 'Modèle pour le bilan audioprothétique initial',
    content: `Bilan audioprothétique initial

Nom du patient : {{patientName}}
Date de naissance : {{patientBirthDate}}
Date du bilan : {{evaluationDate}}

1. Anamnèse :
- Gêne auditive : {{hearingDiscomfort}}
- Antécédents ORL : {{entHistory}}
- Contexte professionnel et social : {{context}}

2. Tests auditifs :
- Audiométrie tonale : {{tonalAudiometry}}
- Audiométrie vocale : {{vocalAudiometry}}
- Impédancemétrie : {{tympanometry}}

3. Résultats :
- Seuils d'audition : {{hearingThresholds}}
- Interprétation des résultats : {{resultsInterpretation}}

4. Projet d'appareillage :
- Type d'appareillage envisagé : {{proposedDeviceType}}
- Recommandations : {{recommendations}}`,
    fields: [
      'patientName',
      'patientBirthDate',
      'evaluationDate',
      'hearingDiscomfort',
      'entHistory',
      'context',
      'tonalAudiometry',
      'vocalAudiometry',
      'tympanometry',
      'hearingThresholds',
      'resultsInterpretation',
      'proposedDeviceType',
      'recommendations'
    ],
    tags: ['bilan', 'audioprothèse', 'initial'],
    showPrintButton: true,
    showEmailButton: false,
    showContactSelector: false
  },
  {
    id: 'compte-rendu-adaptation',
    name: 'Compte-rendu d\'adaptation prothétique',
    description: 'Modèle pour le compte-rendu d\'adaptation prothétique',
    content: `Compte-rendu d'adaptation prothétique

Nom du patient : {{patientName}}
Date de naissance : {{patientBirthDate}}
Date du bilan : {{evaluationDate}}

1. Anamnèse :
- Antécédents médicaux : {{medicalHistory}}
- Gêne auditive ressentie : {{hearingDiscomfort}}

2. Bilan audiométrique :
- Audiométrie tonale : {{tonalAudiometry}}
- Audiométrie vocale : {{vocalAudiometry}}

3. Description de la solution prothétique :
- Type d'appareil : {{deviceType}}
- Réglages initiaux : {{initialSettings}}

4. Résultats subjectifs :
- Satisfaction du patient : {{patientSatisfaction}}
- Difficultés éventuelles : {{difficulties}}

5. Recommandations :
- Suivi proposé : {{followUp}}`,
    fields: [
      'patientName',
      'patientBirthDate',
      'evaluationDate',
      'medicalHistory',
      'hearingDiscomfort',
      'tonalAudiometry',
      'vocalAudiometry',
      'deviceType',
      'initialSettings',
      'patientSatisfaction',
      'difficulties',
      'followUp'
    ],
    tags: ['compte-rendu', 'adaptation', 'prothèse'],
    showPrintButton: true,
    showEmailButton: false,
    showContactSelector: false
  }
];

export function getTemplateById(id: string): DocumentTemplate | undefined {
  return documentTemplates.find(template => template.id === id);
}

export function getTemplatesByTag(tag: string): DocumentTemplate[] {
  return documentTemplates.filter(template => 
    template.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

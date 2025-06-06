/// <reference types="vite/client" />

// Déclarations de types pour les modules tiers
declare module 'react-icons/fa' {
  import { ComponentType, SVGProps } from 'react';
  
  export const FaRocket: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaBug: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaTools: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaBullhorn: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaInfoCircle: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaExternalLinkAlt: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaCalendarAlt: ComponentType<SVGProps<SVGSVGElement>>;
  export const FaTag: ComponentType<SVGProps<SVGSVGElement>>;
  
  // Alias pour les icônes avec des noms différents
  export { FaTag as FaTagIcon };
}

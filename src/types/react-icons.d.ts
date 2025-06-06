import { IconType } from 'react-icons';

declare module 'react-icons/fa' {
  import { ComponentType, SVGAttributes } from 'react';
  
  export const FaRocket: ComponentType<SVGAttributes<SVGElement>>;
  export const FaBug: ComponentType<SVGAttributes<SVGElement>>;
  export const FaTools: ComponentType<SVGAttributes<SVGElement>>;
  export const FaBullhorn: ComponentType<SVGAttributes<SVGElement>>;
  export const FaInfoCircle: ComponentType<SVGAttributes<SVGElement>>;
  export const FaExternalLinkAlt: ComponentType<SVGAttributes<SVGElement>>;
  export const FaCalendarAlt: ComponentType<SVGAttributes<SVGElement>>;
  export const FaTag: ComponentType<SVGAttributes<SVGElement>>;
  
  // Alias pour FaTagIcon
  export { FaTag as FaTagIcon };
}

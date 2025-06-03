import { Icon } from '@chakra-ui/react';
import type { IconProps } from '@chakra-ui/react';

interface ChakraIconProps extends Omit<IconProps, 'as'> {
  icon: React.ElementType;
}

export const ChakraIcon = ({ icon, ...props }: ChakraIconProps) => {
  return <Icon as={icon} {...props} />;
};

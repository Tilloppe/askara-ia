import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#e6f7f7',
      100: '#b5e5e5',
      200: '#93d8d8',
      300: '#62c6c6',
      400: '#45bbbb',
      500: '#16a9a9',
      600: '#149a9a',
      700: '#0f7878',
      800: '#0c5d5d',
      900: '#094747',
    },
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  styles: {
    global: {
      'html, body': {
        bg: 'gray.50',
        color: 'gray.800',
        minHeight: '100vh',
        scrollBehavior: 'smooth',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      '*, *::before, *::after': {
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
      },
      a: {
        color: 'brand.500',
        _hover: {
          textDecoration: 'none',
          color: 'brand.600',
        },
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
        _focus: {
          boxShadow: '0 0 0 3px rgba(22, 169, 169, 0.4)',
        },
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
            _disabled: {
              bg: 'brand.500',
            },
          },
          _active: {
            bg: 'brand.700',
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
      defaultProps: {
        focusBorderColor: 'brand.500',
      },
    },
    FormLabel: {
      baseStyle: {
        mb: 1,
        fontWeight: 'medium',
        color: 'gray.700',
      },
    },
    Alert: {
      baseStyle: {
        container: {
          bg: 'blue.50',
        },
      },
    },
  },
});

export default theme;

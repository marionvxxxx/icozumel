import { extendTheme } from 'native-base';

export const theme = extendTheme({
  colors: {
    primary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
    secondary: {
      50: '#fef7ee',
      100: '#fdedd6',
      200: '#fbd7ac',
      300: '#f8ba77',
      400: '#f59440',
      500: '#f2751a',
      600: '#e35a10',
      700: '#bc4210',
      800: '#963516',
      900: '#792d15',
    },
  },
  config: {
    initialColorMode: 'light',
  },
  fontConfig: {
    Inter: {
      100: {
        normal: 'Inter-Light',
      },
      200: {
        normal: 'Inter-Light',
      },
      300: {
        normal: 'Inter-Light',
      },
      400: {
        normal: 'Inter-Regular',
      },
      500: {
        normal: 'Inter-Medium',
      },
      600: {
        normal: 'Inter-SemiBold',
      },
      700: {
        normal: 'Inter-Bold',
      },
      800: {
        normal: 'Inter-Bold',
      },
      900: {
        normal: 'Inter-Black',
      },
    },
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
    mono: 'Inter',
  },
});
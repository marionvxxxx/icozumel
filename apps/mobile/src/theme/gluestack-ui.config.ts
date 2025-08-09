import { config as defaultConfig } from '@gluestack-ui/config';

// Cozumel theme configuration for Gluestack UI
export const config = {
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    colors: {
      ...defaultConfig.tokens.colors,
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
  },
};
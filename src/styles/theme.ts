export const theme = {
    colors: {
      primary: '#1a73e8',
      background: '#ffffff',
      text: '#202124',
      border: '#dadce0',
      hover: '#f8f9fa',
      error: '#d93025',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    borderRadius: '4px',
    transitions: {
      default: '0.2s ease-in-out',
    },
  };
  
  export type Theme = typeof theme;
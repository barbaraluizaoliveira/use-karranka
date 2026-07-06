export const theme = {
  colors: {
    black: '#000000',
    white: '#FFFFFF',
    lightGray: '#CCCCCC',
    gray: '#F5F5F5',
    darkGray: '#4D4D4D',
    border: '#CCCCCC',
    background: '#F5F5F5',
    primary: '#000000',
    text: '#4D4D4D',
    buttonText: '#FFFFFF'
  },

  fonts: {
    titles: "'Oswald', sans-serif",
    subtitles: "'Montserrat', sans-serif",
    body: "'Inter', sans-serif"
  },

  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
};

export type ThemeType = typeof theme;
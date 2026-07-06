import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    font-family: ${props => props.theme.fonts.body};
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.fonts.titles};
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;
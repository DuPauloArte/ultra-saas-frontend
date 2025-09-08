// src/styles/GlobalStyles.js

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Urbanist', sans-serif; /* <-- AQUI ESTÁ A FONTE */
    
    /* Cores base para o seu tema 'clean' */
    background-color: #f8f9faff; /* Fundo cinza bem claro */
    color: #212529; /* Texto escuro padrão */
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }
`;
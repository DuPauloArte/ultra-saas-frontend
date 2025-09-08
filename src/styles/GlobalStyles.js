// src/styles/GlobalStyles.js

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Urbanist', sans-serif; /* <-- AQUI ESTÁ A FONTE */
    
    /* Cores base para o seu tema 'clean' */
    background-color: #181818ff; /* Fundo cinza bem claro */
    color: #eaeef3ff; /* Texto escuro padrão */
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }
`;
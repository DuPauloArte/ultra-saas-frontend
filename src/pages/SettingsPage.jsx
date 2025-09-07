// src/pages/SettingsPage.jsx

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- ESTILOS (sem alterações) ---
const SettingsWrapper = styled.div`
  padding: 2rem 4rem;
  font-family: 'Poppins', sans-serif;
  color: #333;
`;

const Header = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Subheader = styled.p`
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2.5rem;
`;

const InstructionBox = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const InstructionStep = styled.p`
  margin: 0 0 1rem 0;
  line-height: 1.6;
`;

const CodeBlock = styled.pre`
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 1.5rem;
  border-radius: 6px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
`;

const CopyButton = styled.button`
  display: block;
  width: 150px;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: none;
  background-color: #9f20c5;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: #7c199a;
  }
  
  &:active {
      transform: scale(0.98);
  }
`;

const LoadingMessage = styled.div` font-size: 1.5rem; color: #888; text-align: center; margin-top: 5rem; `;

// --- COMPONENTE ---
export const SettingsPage = () => {
    const [userData, setUserData] = useState(null);
    const [scriptText, setScriptText] = useState('');
    const [copySuccess, setCopySuccess] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get('http://localhost:3001/api/users/me', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setUserData(response.data);
                } catch (error) {
                    console.error("Erro ao buscar dados do usuário:", error);
                }
            };
            fetchUserData();
        }
    }, [token]);
    
    useEffect(() => {
        if (userData) {
            // MELHORIA: O script agora está no formato completo para facilitar a leitura
            const fullScript = `<script>
(function() {
    const config = {
        // Seu ID de site exclusivo
        siteId: '${userData.siteId}',

        // O endereço da nossa API para receber os leads
        apiEndpoint: 'http://localhost:3001/api/capture',

        // O seletor CSS do formulário que você quer monitorar no seu site
        // Ex: '#formulario-contato', '.form-principal', 'form[name="contact"]'
        formSelector: '#form-contato'
    };

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.querySelector(config.formSelector);
        if (!form) {
            console.warn(\`[Ultra Digital] Formulário com seletor "\${config.formSelector}" não encontrado.\`);
            return;
        }
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            try {
                const response = await fetch(\`\${config.apiEndpoint}/\${config.siteId}\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (response.ok) {
                    console.log('[Ultra Digital] Lead enviado com sucesso!');
                    alert('Obrigado! Seus dados foram enviados.');
                    form.reset();
                } else {
                    console.error('[Ultra Digital] Erro ao enviar o lead.');
                }
            } catch (error) {
                console.error('[Ultra Digital] Erro de rede:', error);
            }
        });
    });
})();
${'</' + 'script>'} 
`;
            setScriptText(fullScript);
        }
    }, [userData]);

    const handleCopy = () => {
        navigator.clipboard.writeText(scriptText).then(() => {
            setCopySuccess('Copiado!');
            setTimeout(() => setCopySuccess(''), 2500);
        }, () => {
            setCopySuccess('Falha ao copiar!');
            setTimeout(() => setCopySuccess(''), 2500);
        });
    };

    if (!userData) {
        return <LoadingMessage>Carregando configurações...</LoadingMessage>;
    }

    return (
        <SettingsWrapper>
            <Header>Instalação do Script</Header>
            <Subheader>Siga os passos abaixo para começar a capturar leads do seu site.</Subheader>

            <InstructionBox>
                <InstructionStep>
                    <strong>Passo 1:</strong> Copie o bloco de código abaixo. Ele já está configurado com o seu ID de site exclusivo: <strong>{userData.siteId}</strong>.
                </InstructionStep>
                <CodeBlock>
                    <code>
                        {scriptText}
                    </code>
                </CodeBlock>
                <CopyButton onClick={handleCopy}>
                    {copySuccess || 'Copiar Script'}
                </CopyButton>
            </InstructionBox>

            <InstructionBox>
                <InstructionStep><strong>Passo 2:</strong> Cole o script no código HTML do seu site. O melhor lugar é logo antes do fechamento da tag {'<body>'}.</InstructionStep>
                <InstructionStep><strong>Passo 3:</strong> Certifique-se de que o formulário que você deseja monitorar no seu site tem o seletor CSS correto. Por padrão, o script procura por `id="form-contato"`. Se o seu formulário for diferente, altere a linha "formSelector" no script.
                </InstructionStep>
            </InstructionBox>
        </SettingsWrapper>
    );
};
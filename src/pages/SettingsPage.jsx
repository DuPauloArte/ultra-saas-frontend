import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

// --- ESTILOS ---
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

const Box = styled.div`
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

const LoadingMessage = styled.div`
    font-size: 1.5rem;
    color: #888;
    text-align: center;
    margin-top: 5rem;
`;

const ProjectSelector = styled.select`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 1.5rem;
  background-color: white;
`;

// --- COMPONENTE COMPLETO ---
export const SettingsPage = () => {
    const { token, projects, setProjects } = useAuth(); 
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [scriptText, setScriptText] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    useEffect(() => {
        if (token && projects.length === 0) {
            setIsLoading(true);
            const fetchProjects = async () => {
                try {
                    const response = await axios.get(`${apiUrl}/api/projects`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setProjects(response.data);
                } catch (error) {
                    console.error("Erro ao buscar projetos:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProjects();
        } else {
            setIsLoading(false);
        }
    }, [token, projects.length, setProjects]);

    useEffect(() => {
        if (projects.length > 0 && !selectedProjectId) {
            setSelectedProjectId(projects[0]._id);
        }
    }, [projects, selectedProjectId]);
    
    useEffect(() => {
        if (selectedProjectId) {
            const fullScript = `<script>
(function() {
    const config = {
        projectId: '${selectedProjectId}',
        apiEndpoint: 'https://ultra-saas-api.onrender.com/api/capture',
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
            const data = {};
            const mappingConfig = {
                nome: ['nome', 'name', 'fullname', 'your-name'],
                email: ['email', 'mail', 'e-mail'],
                telefone: ['tel', 'phone', 'celular', 'whatsapp', 'fone'],
                cidade: ['city', 'cidade', 'localidade']
            };

            function getFieldType(element) {
                const name = element.name.toLowerCase();
                for (const type in mappingConfig) {
                    if (mappingConfig[type].includes(name)) {
                        return type;
                    }
                }
                return name;
            }

            for (let [key, value] of formData.entries()) {
                const fieldType = getFieldType({ name: key });
                data[fieldType] = value;
            }

            try {
                const response = await fetch(\`\${config.apiEndpoint}/\${config.projectId}\`, {
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
    }, [selectedProjectId]);

    const handleCopy = () => {
        navigator.clipboard.writeText(scriptText).then(() => {
            setCopySuccess('Copiado!');
            setTimeout(() => setCopySuccess(''), 2500);
        }, () => {
            setCopySuccess('Falha ao copiar!');
            setTimeout(() => setCopySuccess(''), 2500);
        });
    };

    if (isLoading) {
        return <LoadingMessage>Carregando configurações...</LoadingMessage>;
    }

    return (
        <SettingsWrapper>
            <Header>Instalação do Script</Header>
            <Subheader>Siga os passos abaixo para começar a capturar leads do seu site.</Subheader>

            {projects.length > 0 ? (
                <Box>
                    <InstructionStep>
                        <strong>Passo 1:</strong> Selecione o projeto para o qual deseja gerar o script.
                    </InstructionStep>
                    <ProjectSelector 
                        value={selectedProjectId} 
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                    >
                        {projects.map(project => (
                            <option key={project._id} value={project._id}>
                                {project.name}
                            </option>
                        ))}
                    </ProjectSelector>

                    <InstructionStep>
                        <strong>Passo 2:</strong> Copie o bloco de código abaixo. Ele já está configurado com o ID do seu projeto.
                    </InstructionStep>
                    <CodeBlock>
                        <code>{scriptText}</code>
                    </CodeBlock>
                    <CopyButton onClick={handleCopy}>
                        {copySuccess || 'Copiar Script'}
                    </CopyButton>
                </Box>
            ) : (
                <Box>
                    <InstructionStep>
                        Você ainda não tem nenhum projeto. Crie um projeto primeiro para poder gerar o script de captura.
                    </InstructionStep>
                    <Link to="/projects">
                        <CopyButton as="span">Ir para Projetos</CopyButton>
                    </Link>
                </Box>
            )}

            <Box>
                <InstructionStep><strong>Passo 3:</strong> Cole o script no código HTML do seu site. O melhor lugar é logo antes do fechamento da tag {'<body>'}.</InstructionStep>
                <InstructionStep><strong>Passo 4:</strong> Certifique-se de que o formulário no seu site tem o seletor `id="form-contato"`. Se for diferente, altere a linha `formSelector` no script.</InstructionStep>
            </Box>
        </SettingsWrapper>
    );
};
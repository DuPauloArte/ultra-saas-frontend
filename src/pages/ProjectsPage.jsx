// src/pages/ProjectsPage.jsx

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ProjectEditModal } from '../components/ProjectEditModal'; // Assumindo que você tem este componente

const apiUrl = import.meta.env.VITE_API_URL;

// --- ESTILOS ---
const ProjectsWrapper = styled.div`
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

const Section = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
`;

const ProjectsList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
`;

const ProjectCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const ProjectName = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  color: #9f20c5;
`;

const ActionButton = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
`;

const CopyButton = styled(ActionButton)`
  background-color: #34d399;
  color: white;
  &:hover { background-color: #10b981; }
`;

const RenameButton = styled(ActionButton)`
  background-color: #6c757d;
  color: white;
  &:hover { background-color: #5a6268; }
`;

const CodeBlock = styled.pre`
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  border: none;
  background-color: #9f20c5;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  &:hover { background-color: #7c199a; }
`;

// --- COMPONENTE FINAL E UNIFICADO ---
export const ProjectsPage = () => {
    const { token, projects, setProjects } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [newProjectName, setNewProjectName] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState(null);
    const [copySuccessId, setCopySuccessId] = useState(null);

    useEffect(() => {
        if (token && projects.length === 0) {
            setIsLoading(true);
            const fetchProjects = async () => {
                try {
                    const response = await axios.get(`${apiUrl}/api/projects`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setProjects(response.data);
                } catch (error) { console.error("Erro ao buscar projetos:", error); } 
                finally { setIsLoading(false); }
            };
            fetchProjects();
        } else {
            setIsLoading(false);
        }
    }, [token, projects.length, setProjects]);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;
        try {
            const response = await axios.post(`${apiUrl}/api/projects`, 
                { name: newProjectName }, { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setProjects(currentProjects => [...currentProjects, response.data]);
            setNewProjectName('');
        } catch (error) { console.error("Erro ao criar projeto:", error); }
    };

    // SUBSTITUA A FUNÇÃO ANTIGA POR ESTA VERSÃO FINAL E MAIS INTELIGENTE
const generateScriptForProject = (projectId) => {
    const fullScript = `<script>
(function() {
    const config = {
        projectId: '${projectId}',
        apiEndpoint: 'https://ultra-saas-api.onrender.com/api/capture',
        formSelector: '#form-contato'
    };

    const mappingConfig = {
        nome: [
    'name', 'nome', 'full name', 'full_name', 'nome completo', 
    'nome_completo', 'your name', 'seu nome'
],

telefone: [
    'phone', 'telefone', 'telefone celular', 'celular', 'mobile', 
    'mobile phone', 'cell phone', 'telefone fixo', 'contact', 
    'contact number', 'número de telefone', 'numero de telefone', 
    'telefone_contato', 'telefone de contato', 'fone', 'tel', 'telefone1',
    'phone_number', 'your phone', 'seu telefone','numeric_field'
],

email: [
    'email', 'e-mail', 'e_mail', 'mail', 'email address', 
    'endereço de email', 'endereco de email', 'seu email', 'your email'
],

cidade: [
    'city', 'cidade', 'town', 'localidade', 'sua cidade', 'your city', 
    'city_name', 'nome da cidade', 'cidade_residencia'
]
    };

    function getFieldType(elementName) {
        const lowerName = elementName.toLowerCase();
        for (const type in mappingConfig) {
            for (const keyword of mappingConfig[type]) {
                if (lowerName.includes(keyword)) {
                    return type;
                }
            }
        }
        return null; // Retorna nulo se não for um campo mapeado
    }

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.querySelector(config.formSelector);
        if (!form) { return; }

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const mappedData = {};
            const unmappedFields = [];

            for (let [key, value] of formData.entries()) {
                if (!value || key.startsWith('_')) { // Ignora campos vazios ou internos
                    continue;
                }

                const fieldType = getFieldType(key);

                if (fieldType) { // Se o campo for mapeado (nome, email, etc.)
                    if (!mappedData[fieldType]) {
                        mappedData[fieldType] = value;
                    }
                } else { // Se não for mapeado, adiciona aos comentários
                    unmappedFields.push(\`\${key}: \${value}\`);
                }
            }
            
            // Junta os campos não mapeados em um único texto para os comentários
            if (unmappedFields.length > 0) {
                mappedData.comentarios = unmappedFields.join('\\n');
            }
            
            if (!mappedData.email) {
                console.error('[Ultra Digital] O campo de email obrigatório não foi capturado.');
                return;
            }

            try {
                const response = await fetch(\`\${config.apiEndpoint}/\${config.projectId}\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(mappedData),
                });
                if (response.ok) {
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
    return fullScript;
};
    
    const handleCopy = (scriptText, projectId) => {
        navigator.clipboard.writeText(scriptText).then(() => {
            setCopySuccessId(projectId);
            setTimeout(() => setCopySuccessId(null), 2500);
        });
    };

    const handleOpenEditModal = (project) => {
        setProjectToEdit(project);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setProjectToEdit(null);
    };

    const handleRenameSuccess = (updatedProject) => {
        setProjects(currentProjects => 
            currentProjects.map(p => (p._id === updatedProject._id ? updatedProject : p))
        );
    };

    return (
        <ProjectsWrapper>
            <Header>Meus Projetos</Header>
            <Subheader>Crie projetos para seus sites e obtenha o script de instalação.</Subheader>

            <Section>
                <SectionTitle>Criar Novo Projeto</SectionTitle>
                <Form onSubmit={handleCreateProject}>
                    <Input 
                        type="text" 
                        value={newProjectName} 
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="Nome do novo site ou projeto"
                    />
                    <Button type="submit">Criar Projeto</Button>
                </Form>
            </Section>

            <Section>
                <SectionTitle>Projetos e Scripts</SectionTitle>
                {isLoading ? (
                    <p>Carregando projetos...</p>
                ) : (
                    <ProjectsList>
                        {projects.length > 0 ? projects.map(project => {
                            const scriptToCopy = generateScriptForProject(project._id);
                            return (
                                <ProjectCard key={project._id}>
                                    <ProjectHeader>
                                        <ProjectName>{project.name}</ProjectName>
                                        <RenameButton onClick={() => handleOpenEditModal(project)}>Renomear</RenameButton>
                                    </ProjectHeader>
                                    <p>Copie e cole o código abaixo no HTML do seu site, antes do fechamento da tag &lt;/body&gt;.</p>
                                    <CodeBlock>
                                        <code>{scriptToCopy}</code>
                                    </CodeBlock>
                                    <CopyButton onClick={() => handleCopy(scriptToCopy, project._id)}>
                                        {copySuccessId === project._id ? 'Copiado!' : 'Copiar Script'}
                                    </CopyButton>
                                </ProjectCard>
                            )
                        }) : (
                            <p>Você ainda não criou nenhum projeto. Crie um acima para gerar seu script de instalação.</p>
                        )}
                    </ProjectsList>
                )}
            </Section>
            
            {isEditModalOpen && (
                <ProjectEditModal
                    project={projectToEdit}
                    onClose={handleCloseEditModal}
                    onSaveSuccess={handleRenameSuccess}
                />
            )}
        </ProjectsWrapper>
    );
};
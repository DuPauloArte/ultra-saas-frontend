// src/pages/ProjectsPage.jsx

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ProjectEditModal } from '../components/ProjectEditModal';

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

// --- COMPONENTE ---
export const ProjectsPage = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState(null);
    const { token, projects, setProjects } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [newProjectName, setNewProjectName] = useState('');
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

    const generateScriptForProject = (projectId) => {
        const apiEndpointForScript = apiUrl || 'http://localhost:3001';
        const scriptLogic = `(function(){const config={siteId:'${projectId}',apiEndpoint:'${apiEndpointForScript}/api/capture',formSelector:'#form-contato'},mappingConfig={nome:['nome','name','fullname','your-name'],email:['email','mail','e-mail'],telefone:['tel','phone','celular','whatsapp','fone'],mensagem:['msg','message','mensagem','comments','comentarios']};function getFieldType(e){if("email"===e.type)return"email";if("tel"===e.type)return"telefone";const t=[e.name,e.id,e.placeholder].filter(Boolean).join(" ").toLowerCase();if(!t)return e.name||"campo_desconhecido";for(const o in mappingConfig)for(const a of mappingConfig[o])if(t.includes(a))return o;return e.name||"campo_desconhecido"}document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector(config.formSelector);e?e.addEventListener("submit",async t=>{t.preventDefault();const o={};Array.from(e.elements).forEach(e=>{if("submit"===e.type||"button"===e.type||!e.value)return;const t=getFieldType(e);t&&!o[t]&&(o[t]=e.value)});try{const a=await fetch(config.apiEndpoint+"/"+config.siteId,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});a.ok?(alert("Obrigado! Seus dados foram enviados."),e.reset()):alert("[Ultra Digital] Erro ao enviar o lead. Verifique o console (F12).")}catch(n){alert("[Ultra Digital] Erro de rede. Verifique o console (F12).")}}):console.warn('[Ultra Digital] Formulário com seletor "'+config.formSelector+'" não encontrado.')})})();`;
        
        return `\n<script>${scriptLogic}</script>\n`;
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
            // CORREÇÃO: Comparando com _id para garantir consistência
            currentProjects.map(p => (p._id === updatedProject._id ? updatedProject : p))
        );
    };

    return (
        <ProjectsWrapper>
            <Header>Gerenciamento de Projetos</Header>
            <Subheader>Crie e gerencie os projetos para vincular aos seus sites.</Subheader>

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
                <SectionTitle>Scripts de Instalação</SectionTitle>
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
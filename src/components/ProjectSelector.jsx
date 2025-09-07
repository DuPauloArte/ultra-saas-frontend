// src/components/ProjectSelector.jsx

import { useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SelectorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #555;
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: white;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  min-width: 200px;
`;

export const ProjectSelector = () => {
    const { token, projects, setProjects, activeProject, setActiveProject } = useAuth();

    // Efeito #1: Responsável apenas por buscar os projetos da API
    useEffect(() => {
        if (token && projects.length === 0) {
            const fetchProjects = async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/projects`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setProjects(response.data);
                } catch (error) { 
                    console.error("Erro ao buscar projetos:", error);
                }
            };
            fetchProjects();
        }
    }, [token, projects.length, setProjects]);

    // Efeito #2: Responsável por definir um projeto ativo padrão
    useEffect(() => {
        if (!activeProject) {
            if (projects.length > 0) {
                setActiveProject(projects[0]);
            } 
            else {
                // CORREÇÃO: Usando _id para consistência
                setActiveProject({ _id: 'all', name: 'Todos os Projetos' });
            }
        }
    }, [activeProject, projects, setActiveProject]);

    const handleProjectChange = (e) => {
        const selectedProjectId = e.target.value;
        if (selectedProjectId === 'all') {
            // CORREÇÃO: Usando _id para consistência
            setActiveProject({ _id: 'all', name: 'Todos os Projetos' });
        } else {
            // CORREÇÃO: Comparando com p._id
            const selectedProject = projects.find(p => p._id === selectedProjectId);
            if (selectedProject) {
                setActiveProject(selectedProject);
            }
        }
    };

    return (
        <SelectorWrapper>
            <Label htmlFor="project-selector">Visualizando:</Label>
            <Select 
                id="project-selector"
                // CORREÇÃO: Usando activeProject?._id
                value={activeProject ? activeProject._id : 'all'}
                onChange={handleProjectChange}
            >
                <option value="all">Todos os Projetos</option>
                {projects.map(project => (
                    // CORREÇÃO: Usando project._id para key e value
                    <option key={project._id} value={project._id}>
                        {project.name}
                    </option>
                ))}
            </Select>
        </SelectorWrapper>
    );
};
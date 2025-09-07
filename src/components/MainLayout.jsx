// src/components/MainLayout.jsx

import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './Sidebar';
import { ProjectSelector } from './ProjectSelector';
import { DashboardPage } from '../pages/DashboardPage';
import { LeadsPage } from '../pages/LeadsPage';
import { ProjectsPage } from '../pages/ProjectsPage';

// --- ESTILOS ---
const AppLayout = styled.div`
  display: flex;
`;

const ContentWrapper = styled.main`
  flex-grow: 1;
  margin-left: 250px;
  width: calc(100% - 250px);
  display: flex;
  flex-direction: column;
  height: 100vh; /* Ocupa a altura total da tela */
`;

const MainHeader = styled.header`
  padding: 1rem 4rem;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Greeting = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
`;

const PageContent = styled.div`
  flex-grow: 1;
  overflow-y: auto; /* Permite scroll apenas no conteúdo da página */
`;

// --- COMPONENTE ---
export const MainLayout = () => {
    const { user } = useAuth();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Bom dia";
        if (hour < 18) return "Boa tarde";
        return "Boa noite";
    };

    return (
        <AppLayout>
            <Sidebar />
            <ContentWrapper>
                <MainHeader>
                    <Greeting>
                        {user && `${getGreeting()}, ${user.name}!`}
                    </Greeting>
                    <ProjectSelector />
                </MainHeader>
                <PageContent>
                    {/* As rotas internas do dashboard agora vivem aqui */}
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/leads" element={<LeadsPage />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                    </Routes>
                </PageContent>
            </ContentWrapper>
        </AppLayout>
    );
}
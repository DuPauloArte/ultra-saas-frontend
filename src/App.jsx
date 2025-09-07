// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles'; // 1. IMPORTE AQUI
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProjectSelector } from './components/ProjectSelector';
import { DashboardPage } from './pages/DashboardPage';
import { LeadsPage } from './pages/LeadsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProjectsPage } from './pages/ProjectsPage';

// 1. IMPORTE O COMPONENTE TOOLTIP
import { Tooltip } from 'react-tooltip';

const AppLayout = styled.div`
  display: flex;
`;

const ContentWrapper = styled.main`
  flex-grow: 1;
  margin-left: 250px;
  width: calc(100% - 250px);
  display: flex;
  flex-direction: column;
`;

const MainHeader = styled.header`
  padding: 1rem 4rem;
  border-bottom: 1px solid #e0e0e0;
  background-color: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GreetingGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Greeting = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
`;

// Novo componente de Badge para o plano
const PlanBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px; /* Formato de pílula */
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  color: white;
  
  /* Lógica para definir a cor com base no plano */
  background-color: ${({ plan }) => {
    switch (plan) {
      case 'Power': return '#1d20ddff'; // Azul
      case 'Turbo': return '#16a34a'; // Verde
      case 'Ultra': return '#e433eaff'; // Roxo
      case 'Enterprise': return '#1f2937'; // Cinza escuro
      case 'Staff': return 'rgba(11, 229, 245, 1)'; // Ambar
      default: return '#6b7280'; // Cinza padrão
    }
  }};
`;

// 2. NOVO: COMPONENTE PARA O CÍRCULO VERMELHO DE AVISO
const PlanWarningBadge = styled.span`
  width: 12px;
  height: 12px;
  background-color: #ef4444; /* Vermelho */
  border-radius: 50%;
  cursor: pointer;
  animation: pulse 2s infinite;
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
    70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }
`;

const PageContent = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

// Componente interno para renderizar o layout principal
const MainLayout = () => {
    const { user } = useAuth();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Bom dia";
        if (hour < 18) return "Boa tarde";
        return "Boa noite";
    };

    return (
        <AppLayout>
          <GlobalStyles />
            <Sidebar />
            <ContentWrapper>
                <MainHeader>
                    <GreetingGroup>
                        <Greeting>
                            {user && `${getGreeting()}, ${user.name}!`}
                        </Greeting>
                        {/* 3. LÓGICA ATUALIZADA PARA MOSTRAR BADGE OU AVISO */}
                        {user && user.subscriptionStatus === 'active' && (
                            <PlanBadge plan={user.plan}>{user.plan}</PlanBadge>
                        )}
                        {user && (user.subscriptionStatus === 'inactive' || user.subscriptionStatus === 'canceled') && (
                            <PlanWarningBadge 
                                data-tooltip-id="plan-status-tooltip"
                                data-tooltip-content={`O plano "${user.plan}" expirou. Você retornou ao plano Free.`}
                            />
                        )}
                    </GreetingGroup>
                    <ProjectSelector />
                </MainHeader>
                <PageContent>
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/leads" element={<LeadsPage />} />
                        <Route path="/projects" element={<ProjectsPage />} />
                    </Routes>
                </PageContent>
                <Tooltip id="plan-status-tooltip" place="bottom" effect="solid" />
            </ContentWrapper>
        </AppLayout>
    );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
// src/components/ProtectedRoute.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

// Podemos adicionar uma mensagem de carregamento estilizada
const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #888;
  font-family: 'Poppins', sans-serif;
`;

export const ProtectedRoute = ({ children }) => {
    // 1. Pegar o estado de 'authLoading' do contexto, além do token
    const { token, authLoading } = useAuth();
    const location = useLocation();

    // 2. Exibir uma mensagem enquanto a autenticação inicial está em andamento
    if (authLoading) {
        return <LoadingWrapper>Verificando autenticação...</LoadingWrapper>;
    }

    // 3. Após o carregamento, se não houver token, redireciona
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 4. Se houver token e o carregamento terminou, renderiza a página
    return children;
};
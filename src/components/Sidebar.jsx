// src/components/Sidebar.jsx

import styled from 'styled-components';
import {NavLink} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {LayoutDashboard, FileText, FolderKanban, LogOut, CreditCard} from 'lucide-react';

const SidebarContainer = styled.div `
  width: 250px;
  background-color: #f0f0f0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem 0;
  position: fixed;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
`;

const LogoContainer = styled.div `
  padding-left: 2rem;
  margin-bottom: 1rem;
`;

const LogoImage = styled.img `
  max-width: 150px;
  height: auto;
`;

const Nav = styled.nav `
  display: flex;
  flex-direction: column;
  padding-left: 2rem;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: #888;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  font-weight: 300;
  padding: 0.5rem 0;
  transition: color 0.2s ease, font-weight 0.2s ease, border-right 0.2s ease;
  
  &:hover {
    color: #555;
  }

  &.active {
    color: #333;
    font-weight: 500;
    border-right: 3px solid #9f20c5;
  }

  display: flex; // Adicionado para alinhar ícone e texto
  align-items: center; // Adicionado para alinhar ícone e texto
  gap: 12px; // Adicionado para espaçar ícone e texto
`;

const Footer = styled.div `
  padding-left: 2rem;
  font-size: 0.8rem;
  color: #aaa;
`;

const LogoutButton = styled.button `
    background: none;
    border: none;
    color: #c52020;
    cursor: pointer;
    font-size: 1rem;
    padding: 0.5rem 0;
    text-align: left;
    margin-top: 1rem;
    width: 100%; // Garante que o botão ocupe a largura
    display: flex; // Adicionado para alinhar ícone e texto
    align-items: center; // Adicionado para alinhar ícone e texto
    gap: 12px; // Adicionado para espaçar ícone e texto    
    &:hover {
        font-weight: bold;
    }
`;

export const Sidebar = () => {
    const auth = useAuth();

    return (
        <SidebarContainer>
            <div>
                <LogoContainer>
                    {/* CORREÇÃO 1: Caminho da imagem ajustado para a pasta 'public' */}
                    <LogoImage src="/ultra_dash.png" alt="Ultra Digital Logo"/>
                </LogoContainer>
                <Nav>
                    {/* CORREÇÃO 2: Propriedade 'end' ajustada */}
                    <StyledNavLink to="/" end="end"> <LayoutDashboard size={20} />Dados</StyledNavLink>
                    <StyledNavLink to="/leads"> <FileText size={20} />Leads</StyledNavLink>
                    <StyledNavLink to="/projects"> <FolderKanban size={20} />Meus Projetos</StyledNavLink>
                    <StyledNavLink to="/plans"><CreditCard size={20} />Planos e Assinatura</StyledNavLink>
                </Nav>
            </div>
            <Footer>
                <p>Modo De Testes</p>
                <p>Versão: 0.1.1</p>
                <LogoutButton onClick={auth.logout}> <LogOut size={16} />Logout
                </LogoutButton>
            </Footer>
        </SidebarContainer>
    );
};
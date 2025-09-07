// src/pages/LoginPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

// --- ESTILOS ---
const LoginPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f0f0;
  font-family: 'Poppins', sans-serif;
`;

const LoginCard = styled.div`
  background-color: white;
  padding: 3rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 380px;
  max-width: 90%;
`;

const LogoImage = styled.img`
  width: 200px;
  height: auto;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1.25rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #9f20c5;
    box-shadow: 0 0 0 2px rgba(159, 32, 197, 0.2);
    outline: none;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.9rem 1.5rem;
  background-color: #9f20c5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;

  &:hover {
    background-color: #7c199a;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.9rem;
  text-align: center;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const StyledLink = styled(Link)`
  color: #888;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    color: #9f20c5;
  }
`;

const FooterText = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  font-size: 0.8rem;
  color: #aaa;
`;

// --- COMPONENTE PRINCIPAL ---
export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error("Erro na página de login:", err);
      setError(err.response?.data?.message || 'Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <LoginPageWrapper>
      <LoginCard>
        <LogoImage src="/ultra_dash.png" alt="Ultra Dashboard Logo" />
        
        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <InputGroup>
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>

          <SubmitButton type="submit">Entrar</SubmitButton>
        </Form>

        <LinksContainer>
          <StyledLink to="#">Esqueceu sua senha?</StyledLink>
          <StyledLink to="/register">Não tem uma conta? Registre-se</StyledLink>
        </LinksContainer>
      </LoginCard>

      <FooterText>
        Versão atual: Alpha
      </FooterText>
    </LoginPageWrapper>
  );
};
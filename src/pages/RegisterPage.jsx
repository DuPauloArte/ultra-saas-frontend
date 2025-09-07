// src/pages/RegisterPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// --- ESTILOS ---
const RegisterPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f0f0;
  font-family: 'Poppins', sans-serif;
`;

const RegisterCard = styled.div`
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
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #7c199a;
  }
`;

const Message = styled.p`
  font-size: 0.9rem;
  text-align: center;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
`;

const ErrorMessage = styled(Message)`
  color: #e74c3c;
`;

const SuccessMessage = styled(Message)`
  color: #27ae60;
`;

const LinksContainer = styled.div`
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
export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      await axios.post(`${apiUrl}/api/users/register`, {
        name,
        email,
        password,
      });

      setSuccessMessage('Registro bem-sucedido! Redirecionando para o login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error("Erro no registro:", err);
      setError(err.response?.data?.message || 'Ocorreu um erro ao registrar.');
    }
  };

  return (
    <RegisterPageWrapper>
      <RegisterCard>
        <LogoImage src="/ultra_dash.png" alt="Ultra Dashboard Logo" />
        
        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
          
          <InputGroup>
            <Input
              type="text"
              placeholder="Nome Completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </InputGroup>
          
          <InputGroup>
            <Input
              type="email"
              placeholder="Seu melhor e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Input
              type="password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Input
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </InputGroup>

          <SubmitButton type="submit">Criar Conta</SubmitButton>
        </Form>

        <LinksContainer>
          <StyledLink to="/login">Já tem uma conta? Faça login</StyledLink>
        </LinksContainer>
      </RegisterCard>

      <FooterText>
        Versão atual: Alpha
      </FooterText>
    </RegisterPageWrapper>
  );
};
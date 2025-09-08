import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL;

// --- STYLED COMPONENTS ---

const PlansWrapper = styled.div`
  padding: 2rem 4rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center; /* Alinha verticalmente se os cards tiverem alturas diferentes */
  flex-wrap: wrap;
  gap: 2rem;
  min-height: 80vh; /* Garante que o container ocupe a maior parte da tela */
`;

const PopularBadge = styled.span`
  position: absolute;
  top: -15px;
  right: -15px;
  background-color: #28a745; /* Verde */
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 5px;
  font-size: 0.75rem;
  font-weight: bold;
  transform: rotate(20deg);
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
`;

const PlanCard = styled.div`
  border: 1px solid #ddd;
  padding: 2rem;
  margin: 1rem;
  display: inline-block;
  width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
  text-align: left;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    border-color: #9f20c5;
  }

  h2 {
    color: #333;
    margin-top: 0;
    font-size: 1.8rem;
  }

  p {
    color: #555;
    font-size: 1rem;
    line-height: 1.5;
    min-height: 70px; /* Garante que os cards tenham a mesma altura */
  }
`;

const PlanPrice = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #9f20c5;
  margin-bottom: 1rem;

  span {
    font-size: 1rem;
    color: #888;
    font-weight: normal;
  }
`;

const PlanButton = styled.button`
  background-color: #9f20c5;
  color: white;
  border: none;
  padding: 12px 25px;
  cursor: pointer;
  font-size: 1.1rem;
  border-radius: 5px;
  width: 100%;
  margin-top: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #8a1cb0;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.8;
  }
`;

// --- ESTRUTURA DE DADOS DOS PLANOS ---

const plansData = [
    {
        name: 'Free',
        price: 'R$0',
        description: 'O plano essencial para começar, centralize até 100 leads mensais.',
        priceId: null, // Não há checkout para o plano Free
        isPopular: false,
    },

    {
        name: 'Power',
        price: 'R$49',
        description: 'Cresceu um pouco? Esse é o plano para você, centralize até 500 leads mensais.',
        priceId: 'price_1S4otg38EcxtIJ87v7Q5iwyP', // Não há checkout para o plano Free
        isPopular: false,
    },

    {
        name: 'Turbo', // Certifique-se que este nome bate com o do seu DB
        price: 'R$149',
        description: 'Ideal para pequenas e médias empresas. Centralize até 2.000 leads mensais.',
        priceId: 'price_1S4ouD38EcxtIJ87eaRNGMOW', // SUBSTITUA PELO SEU PRICE ID REAL
        isPopular: true,
    },
    {
        name: 'Ultra', // Certifique-se que este nome bate com o do seu DB
        price: 'R$399',
        description: 'Solução completa para grandes equipes. Centralize até 5.000 leads mensais.',
        priceId: 'price_1S4out38EcxtIJ87KG0DUNcf', // SUBSTITUA PELO SEU PRICE ID REAL
        isPopular: false,
    }

];

// --- COMPONENTE PRINCIPAL ---

export const PlansPage = () => {
    const { token, user } = useAuth();

    const handleCheckout = async (priceId) => {
        if (!priceId) return;
        try {
            const response = await axios.post(
                `${apiUrl}/api/stripe/create-checkout-session`,
                { priceId },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            window.location.href = response.data.url;
        } catch (error) {
            console.error('Erro ao iniciar o checkout:', error);
            alert('Não foi possível iniciar o pagamento. Verifique o console para detalhes.');
        }
    };

    // NOVA FUNÇÃO para redirecionar para o portal do cliente
     const handleManageSubscription = async () => {
         try {
             const response = await axios.post(
                 `${apiUrl}/api/stripe/create-portal-session`,
                 {}, // Corpo da requisição vazio
                 { headers: { 'Authorization': `Bearer ${token}` } }
             );
             window.location.href = response.data.url;
         } catch (error) {
             console.error('Erro ao acessar o portal:', error);
             alert('Não foi possível gerenciar sua assinatura.');
         }
     };

    return (
        <PlansWrapper>
    {/* 1. LÓGICA PARA CLIENTES EXISTENTES */}
    {user && user.plan !== 'Free' && (
        <div style={{ 
            width: '100%', 
            marginBottom: '2rem', 
            padding: '2rem', 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            backgroundColor: '#fafafa' 
        }}>
            <h3 style={{ marginTop: 0, fontSize: '1.5rem' }}>
                Você é assinante do plano {user.plan}.
            </h3>
            <p>Para mudar de plano, atualizar seu método de pagamento ou cancelar, acesse seu portal de gerenciamento.</p>
            <PlanButton onClick={handleManageSubscription}>
                Gerenciar Assinatura
            </PlanButton>
        </div>
    )}

    {/* 2. LÓGICA PARA NOVOS CLIENTES (OU DO PLANO FREE) */}
    {/* Usamos um título apenas se o usuário for do plano Free ou novo */}
    {(!user || user.plan === 'Free') && (
        <h1 style={{ width: '100%' }}>Escolha o plano ideal para você</h1>
    )}
    
    {plansData.map((plan) => {
        // Mostramos todos os planos para usuários do plano Free, mas escondemos o 'Free' para quem já tem plano pago.
        if (user && user.plan !== 'Free' && plan.name === 'Free') {
            return null;
        }

        return (
            <PlanCard key={plan.name}>
                {plan.isPopular && <PopularBadge>Mais Popular</PopularBadge>}
                <h2>{plan.name}</h2>
                <PlanPrice>{plan.price}<span>/mês</span></PlanPrice>
                <p>{plan.description}</p>
                
                {user && user.plan === plan.name ? (
                    <PlanButton disabled>Plano Atual</PlanButton>
                ) : (
                    <PlanButton 
                        onClick={() => handleCheckout(plan.priceId)}
                        disabled={!plan.priceId}
                    >
                        Assinar Agora
                    </PlanButton>
                )}
            </PlanCard>
        );
    })}
</PlansWrapper>
    );
};
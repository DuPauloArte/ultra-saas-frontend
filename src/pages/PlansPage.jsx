// src/pages/PlansPage.jsx

import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL;

// --- SEUS STYLED COMPONENTS (com pequenas melhorias) ---

const PlansWrapper = styled.div`
  padding: 2rem 4rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Alinha no topo */
  flex-wrap: wrap;
  gap: 2rem;
`;

const PopularBadge = styled.span`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%); /* Centraliza o badge */
  background: #b205d6;
  color: white;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 2;
`;

const PlanCard = styled.div`
  border: 1px solid #b785c7ff;
  padding: 2rem;
  margin-top: 2rem; /* Adiciona margem para o badge não cortar */
  display: flex;
  flex-direction: column;
  width: 300px;
  min-height: 22em;
  border-radius: 20px;
  transition: transform 250ms ease-in-out, box-shadow 250ms ease-in-out;
  position: relative; /* Necessário para o posicionamento do badge */

  &.popular {
    border: 2px solid #9f20c5;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }

  h2 {
    margin-top: 0;
    font-size: 1.5rem;
  }
  
  h3 { /* Para o preço */
    font-size: 2.2rem;
    color: #333;
    margin: 1rem 0;
  }

  p {
    font-weight: 600;
    flex-grow: 1; /* Faz o parágrafo empurrar o botão para baixo */
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
  margin-top: 15px;
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


// --- COMPONENTE PRINCIPAL COM A LÓGICA CORRETA ---

export const PlansPage = () => {
    const { token, user } = useAuth();

    // Função para novos clientes
    const handleCheckout = async (priceId) => {
        try {
            const response = await axios.post(`${apiUrl}/api/stripe/create-checkout-session`, { priceId }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            window.location.href = response.data.url;
        } catch (error) {
            console.error('Erro ao iniciar o checkout:', error);
            alert('Não foi possível iniciar o pagamento.');
        }
    };

    // Função para clientes existentes
    const handleManageSubscription = async () => {
        try {
            const response = await axios.post(`${apiUrl}/api/stripe/create-portal-session`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            window.location.href = response.data.url;
        } catch (error) {
            console.error('Erro ao acessar o portal:', error);
            alert('Não foi possível gerenciar sua assinatura.');
        }
    };

    return (
        <PlansWrapper>
            {/* SE O USUÁRIO JÁ FOR ASSINANTE, MOSTRE O PAINEL DE GERENCIAMENTO */}
            {user && user.plan !== 'Free' ? (
                <div style={{ width: '100%', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                    <h3 style={{ marginTop: 0, fontSize: '1.5rem' }}>Você é assinante do plano {user.plan}.</h3>
                    <p>Para mudar de plano, atualizar seu método de pagamento ou cancelar, acesse seu portal de gerenciamento seguro.</p>
                    <PlanButton onClick={handleManageSubscription}>
                        Gerenciar Assinatura
                    </PlanButton>
                </div>
            ) : (
                // SE FOR NOVO USUÁRIO OU DO PLANO FREE, MOSTRE AS OPÇÕES DE PLANO
                <>
                    <PlanCard>
                        <h2>Plano Power</h2>
                        <p>Centralize até 500 Leads Mensais</p>
                        <h3>R$ 49,90</h3>
                        <PlanButton onClick={() => handleCheckout('price_1S4otg38EcxtIJ87v7Q5iwyP')}>
                            Assinar Agora
                        </PlanButton>
                    </PlanCard>

                    <PlanCard className="popular">
                        <PopularBadge>Mais Popular</PopularBadge>
                        <h2>Plano Turbo</h2>
                        <p>Centralize até 2.000 Leads Mensais</p>
                        <h3>R$ 149,90</h3>
                        <PlanButton onClick={() => handleCheckout('price_1S4ouD38EcxtIJ87eaRNGMOW')}>
                            Assinar Agora
                        </PlanButton>
                    </PlanCard>

                    <PlanCard>
                        <h2>Plano Ultra</h2>
                        <p>Centralize até 5.000 Leads Mensais</p>
                        <h3>R$ 399,90</h3>
                        <PlanButton onClick={() => handleCheckout('price_1S4out38EcxtIJ87KG0DUNcf')}>
                            Assinar Agora
                        </PlanButton>
                    </PlanCard>
                </>
            )}
        </PlansWrapper>
    );
};
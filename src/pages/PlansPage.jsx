// src/pages/PlansPage.jsx

import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL;

const PlansWrapper = styled.div`
  padding: 2rem 4rem;
  text-align: center;
`;

const PlanCard = styled.div`
  border: 1px solid #ddd;
  padding: 2rem;
  margin: 1rem;
  display: inline-block;
  width: 250px;
`;

const PlanButton = styled.button`
  background-color: #9f20c5;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 5px;

  &:hover {
    opacity: 0.9;
  }
`;

export const PlansPage = () => {
    const { token } = useAuth();

    const handleCheckout = async (priceId) => {
        try {
            const response = await axios.post(
                `${apiUrl}/api/stripe/create-checkout-session`,
                { priceId },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            // Redireciona o usuário para a URL de checkout do Stripe
            window.location.href = response.data.url;
        } catch (error) {
            console.error('Erro ao iniciar o checkout:', error);
            alert('Não foi possível iniciar o pagamento.');
        }
    };

    return (
        <PlansWrapper>
            <h1>Nossos Planos</h1>
            <PlanCard>
                <h2>Plano Power</h2>
                <p>Ideal para começar.</p>
                {/* Substitua pelo ID do Preço que você copiou do Stripe */}
                <PlanButton onClick={() => handleCheckout('price_1S4otg38EcxtIJ87v7Q5iwyP')}>
                    Assinar Agora
                </PlanButton>
            </PlanCard>
            <PlanCard>
                <h2>Plano Turbo</h2>
                <p>Ideal para Campanhas.</p>
                {/* Substitua pelo ID do Preço que você copiou do Stripe */}
                <PlanButton onClick={() => handleCheckout('price_1S4ouD38EcxtIJ87eaRNGMOW')}>
                    Assinar Agora
                </PlanButton>
            </PlanCard>
            <PlanCard>
                <h2>Plano Ultra</h2>
                <p>Ideal para Agencias que Gerenciam Varios Clientes</p>
                {/* Substitua pelo ID do Preço que você copiou do Stripe */}
                <PlanButton onClick={() => handleCheckout('price_1S4out38EcxtIJ87KG0DUNcf')}>
                    Assinar Agora
                </PlanButton>
            </PlanCard>
            <PlanCard>
                <h2>Plano Free</h2>
                <p>Ideal para conhecer.</p>
                {/* Substitua pelo ID do Preço que você copiou do Stripe */}
                <PlanButton onClick={() => handleCheckout('price_1S4ovp38EcxtIJ8776wx3dum')}>
                    Assinar Agora
                </PlanButton>
            </PlanCard>
            {/* Adicione outros PlanCards para os planos Turbo e Ultra */}
        </PlansWrapper>
    );
};
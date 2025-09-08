// src/pages/DashboardPage.jsx

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL;

// --- ESTILOS ---
const DashboardWrapper = styled.div`
  padding: 2rem 4rem; 
  font-family: 'Poppins', sans-serif;
`;

const ChartsGrid = styled.div` 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 2rem; 
  margin-top: 2rem; 
`;

const ChartBox = styled.div` 
  background-color: #252525ff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  h3 { 
    font-weight: 500; 
    color: #333; 
    margin-top: 0;
    margin-bottom: 1.5rem; 
  } 
`;

const LoadingMessage = styled.div` 
  font-size: 1.5rem; 
  color: #888; 
  text-align: center; 
  margin-top: 5rem; 
`;

const PIE_COLORS = ['#9f20c5', '#34d399', '#f97316', '#3b82f6', '#ef4444', '#eab308'];

// --- COMPONENTE PRINCIPAL ---
export const DashboardPage = () => {
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { token, activeProject } = useAuth();

    useEffect(() => {
        if (token && activeProject) {
            const fetchAnalytics = async () => {
                setIsLoading(true);
                const url = `${apiUrl}/api/analytics?projectId=${activeProject._id}`;
                try {
                    const response = await axios.get(url, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setAnalytics(response.data);
                } catch (error) { 
                    console.error("Erro ao buscar dados de analytics:", error);
                    setAnalytics(null);
                } finally { 
                    setIsLoading(false); 
                }
            };
            fetchAnalytics();
        } else { 
            setIsLoading(false); 
        }
    }, [token, activeProject]);

    if (isLoading) return <LoadingMessage>Carregando dados do dashboard...</LoadingMessage>;
    if (!activeProject) return <LoadingMessage>Por favor, crie ou selecione um projeto.</LoadingMessage>;
    if (!analytics) return <LoadingMessage>Não há dados de analytics para exibir neste projeto.</LoadingMessage>;

    // CORREÇÃO: Usando a nova estrutura 'monthlyUsage'
    const monthlyUsageData = [ 
        { name: 'Usado', value: analytics.monthlyUsage.percent }, 
        { name: 'Restante', value: 100 - analytics.monthlyUsage.percent } 
    ];
    // CORREÇÃO: Verificando se o plano é infinito
    const isInfinitePlan = analytics.monthlyUsage.limit === Infinity;

    return (
        <DashboardWrapper>
            <h1>Dashboard de Dados</h1>
            <h2>Análise de performance para: <strong>{activeProject.name}</strong></h2>
            <ChartsGrid>
                <ChartBox>
                    <h3>Total de Leads (Últimos 6 Meses)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={analytics.leadsLast6Months} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <XAxis dataKey="name" stroke="#aaa" fontSize="12px"/>
                            <YAxis stroke="#aaa" fontSize="12px"/>
                            <Tooltip/>
                            <Area type="monotone" dataKey="leads" stroke="#34d399" strokeWidth={3} fillOpacity={0.2} fill="#34d399"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartBox>
                <ChartBox>
                    <h3>Total Leads Capturados Hoje</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={analytics.leadsLast24Hours} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <XAxis dataKey="hour" stroke="#aaa" fontSize="12px"/>
                            <YAxis stroke="#aaa" fontSize="12px"/>
                            <Tooltip/>
                            <Area type="monotone" dataKey="leads" stroke="#c084fc" strokeWidth={3} fillOpacity={0.2} fill="#c084fc"/>
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartBox>
                
                <ChartBox>
                    <h3>Leads por Projeto</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        {analytics.leadsByProject && analytics.leadsByProject.length > 0 ? (
                            <PieChart>
                                <Pie
                                    data={analytics.leadsByProject}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {analytics.leadsByProject.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`${value} leads`, name]}/>
                                <Legend />
                            </PieChart>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#888' }}>
                                Nenhum lead para exibir a distribuição.
                            </div>
                        )}
                    </ResponsiveContainer>
                </ChartBox>
                
                <ChartBox>
                    {/* CORREÇÃO: Título e lógica do gráfico atualizados */}
                    <h3>Uso de Leads Mensal</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={monthlyUsageData} cx="50%" cy="50%" innerRadius={80} outerRadius={100} startAngle={90} endAngle={450} paddingAngle={0} dataKey="value">
                                <Cell key={`cell-0`} fill={'#c084fc'}/>
                                <Cell key={`cell-1`} fill="#f0f0f0"/>
                            </Pie>
                            <Tooltip formatter={() => [`${analytics.monthlyUsage.percent}% do plano utilizado`, null]}/>
                            <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" fontSize="24px" fontWeight="600">
                                {isInfinitePlan ? '∞' : analytics.monthlyUsage.current}
                            </text>
                             <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" fontSize="14px" fill="#6b7280">
                                {isInfinitePlan ? 'Leads' : `de ${analytics.monthlyUsage.limit}`}
                            </text>
                        </PieChart>
                    </ResponsiveContainer>
                </ChartBox>
            </ChartsGrid>
        </DashboardWrapper>
    );
};
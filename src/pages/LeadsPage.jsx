// src/pages/LeadsPage.jsx

import { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LeadModal } from '../components/LeadModal';
import { CSVLink } from 'react-csv';

const apiUrl = import.meta.env.VITE_API_URL;

// --- ESTILOS ---
const LeadsWrapper = styled.div`
  padding: 2rem 4rem;
  font-family: 'Poppins', sans-serif;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TitleGroup = styled.div``;

const ExportActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ExportButton = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  background-color: #166534;
  color: white;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #15803d;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const StyledCSVLink = styled(CSVLink)`
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  background-color: #1e40af;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const LeadsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
    font-weight: 400;
  }
  th {
    color: #888;
    font-weight: 500;
  }
`;

const getStatusStyles = (status) => {
    switch (status) {
        case 'novo': return css` color: #854d0e; background-color: #fef3c7; border: 1px solid #fcd34d; `;
        case 'contatado': return css` color: #9a3412; background-color: #ffedd5; border: 1px solid #fdba74; `;
        case 'negociando': return css` color: #1e40af; background-color: #dbeafe; border: 1px solid #93c5fd; `;
        case 'ganho': return css` color: #166534; background-color: #dcfce7; border: 1px solid #86efac; `;
        case 'perdido': return css` color: #991b1b; background-color: #fee2e2; border: 1px solid #fca5a5; `;
        default: return css` color: #555; background-color: #eee; border: 1px solid #ddd; `;
    }
};

const StatusBadge = styled.span`
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    text-transform: capitalize;
    ${({ status }) => getStatusStyles(status)}
`;

const TableRow = styled.tr`
    cursor: pointer;
    &:hover {
        background-color: #2b2b2bff;
    }
`;

const LoadingMessage = styled.p`
    font-size: 1.2rem;
    color: #888;
    text-align: center;
    margin-top: 5rem;
`;

const PaginationControls = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
`;

const PageInfo = styled.span`
    font-size: 0.9rem;
    color: #555;
`;

const PageButtons = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const PageButton = styled.button`
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 4px;
    cursor: pointer;
    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
    &:hover:not(:disabled) {
        background-color: #f0f0f0;
    }
`;

const PerPageSelector = styled.select`
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
`;


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export const LeadsPage = () => {
    const [leads, setLeads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { token, activeProject, projects } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [leadsPerPage, setLeadsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [allLeadsForExport, setAllLeadsForExport] = useState([]);
    const [isExporting, setIsExporting] = useState(false);
    const csvLinkRef = useRef(null);

    useEffect(() => {
        if (token && activeProject) {
            const fetchLeads = async () => {
                setIsLoading(true);
                // CORREÇÃO: Usando activeProject._id
                const url = `${apiUrl}/api/leads?projectId=${activeProject._id}&page=${currentPage}&limit=${leadsPerPage}`;
                try {
                    const response = await axios.get(url, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setLeads(response.data.leads);
                    setTotalPages(response.data.totalPages);
                    setCurrentPage(response.data.currentPage);
                } catch (error) { 
                    console.error("Erro ao buscar leads:", error); 
                } finally { 
                    setIsLoading(false); 
                }
            };
            fetchLeads();
        } else {
            setIsLoading(false);
            setLeads([]);
        }
    }, [token, activeProject, currentPage, leadsPerPage]);
    
    useEffect(() => {
        if (isExporting && allLeadsForExport.length > 0) {
            csvLinkRef.current.link.click();
            setIsExporting(false);
            setAllLeadsForExport([]);
        }
    }, [allLeadsForExport, isExporting]);

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' };
        if (!dateString || isNaN(new Date(dateString))) return 'Data inválida';
        return new Date(dateString).toLocaleString('pt-BR', options).replace(',', ' às');
    };

    const getProjectNameById = (projectId) => {
        // CORREÇÃO: Comparando com p._id
        const project = projects.find(p => p._id === projectId);
        return project ? project.name : 'Projeto Desconhecido';
    };

    const csvHeaders = [
        { label: "Data de Recebimento", key: "receivedAt" },
        { label: "Status", key: "status" },
        { label: "Nome do Lead", key: "nome" },
        { label: "Email", key: "email" },
        { label: "Telefone", key: "telefone" },
        { label: "Cidade", key: "cidade" },
        { label: "Nome do Projeto", key: "projectName" }
    ];

    const leadsPageForExport = leads.map(lead => ({
        ...lead,
        receivedAt: formatDate(lead.receivedAt),
        projectName: getProjectNameById(lead.projectId)
    }));

    const handleExportAll = async () => {
        if (!token || !activeProject) return;
        setIsExporting(true);
        
        try {
            // CORREÇÃO: Usando activeProject._id
            const url = `${apiUrl}/api/leads?projectId=${activeProject._id}&limit=99999`;
            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const allLeads = response.data.leads.map(lead => ({
                ...lead,
                receivedAt: formatDate(lead.receivedAt),
                projectName: getProjectNameById(lead.projectId)
            }));
            setAllLeadsForExport(allLeads);
        } catch (error) {
            console.error("Erro ao buscar todos os leads para exportação:", error);
            setIsExporting(false);
        }
    };

    const handleRowClick = (lead) => { setSelectedLead(lead); setIsModalOpen(true); };
    const handleCloseModal = () => { setIsModalOpen(false); setSelectedLead(null); };
    
    const handleSaveSuccess = (updatedLead) => {
        setLeads(currentLeads => 
            // CORREÇÃO: Comparando com _id para leads também
            currentLeads.map(lead => (lead._id === updatedLead._id ? updatedLead : lead))
        );
    };

    const handleLeadsPerPageChange = (e) => {
        setLeadsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    return (
        <LeadsWrapper>
            <HeaderContainer>
                <TitleGroup>
                    <h1>Leads Capturados</h1>
                    <h2>{activeProject ? `Exibindo leads para: ${activeProject.name}` : 'Selecione um projeto para começar'}</h2>
                </TitleGroup>
                
                <ExportActions>
                    <StyledCSVLink 
                        data={leadsPageForExport} 
                        headers={csvHeaders}
                        filename={`leads_pagina_${currentPage}_${activeProject?.name?.replace(/\s+/g, '_') || 'todos'}.csv`}
                    >
                        Exportar Página Atual
                    </StyledCSVLink>
                    <ExportButton onClick={handleExportAll} disabled={isExporting}>
                        {isExporting ? 'Preparando...' : 'Exportar Todos os Leads'}
                    </ExportButton>
                </ExportActions>
            </HeaderContainer>
            
            {isLoading ? (
                <LoadingMessage>Carregando leads...</LoadingMessage>
            ) : (
                <>
                    <LeadsTable>
                        <thead>
                            <tr>
                                <th>Data</th><th>Status</th><th>Nome</th><th>Email</th><th>Telefone</th><th>Origem (Projeto)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.length > 0 ? (
                                leads.map(lead => (
                                    // CORREÇÃO: Usando lead._id para a key
                                    <TableRow key={lead._id} onClick={() => handleRowClick(lead)}>
                                        <td>{formatDate(lead.receivedAt)}</td>
                                        <td><StatusBadge status={lead.status}>{lead.status}</StatusBadge></td>
                                        <td>{lead.nome || 'N/A'}</td>
                                        <td>{lead.email}</td>
                                        <td>{lead.telefone || 'N/A'}</td>
                                        <td>{getProjectNameById(lead.projectId)}</td>
                                    </TableRow>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                                        {activeProject ? 'Nenhum lead capturado para este projeto ainda.' : 'Selecione um projeto no menu superior.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </LeadsTable>

                    {totalPages > 0 && (
                        <PaginationControls>
                            <div>
                                <label htmlFor="per-page">Itens por página: </label>
                                <PerPageSelector id="per-page" value={leadsPerPage} onChange={handleLeadsPerPageChange}>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </PerPageSelector>
                            </div>
                            <PageInfo>
                                Página {currentPage} de {totalPages}
                            </PageInfo>
                            <PageButtons>
                                <PageButton onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                                    Anterior
                                </PageButton>
                                <PageButton onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
                                    Próxima
                                </PageButton>
                            </PageButtons>
                        </PaginationControls>
                    )}
                </>
            )}

            {isModalOpen && (
                <LeadModal 
                    lead={selectedLead} 
                    onClose={handleCloseModal} 
                    onSaveSuccess={handleSaveSuccess}
                />
            )}

            <CSVLink
                data={allLeadsForExport}
                headers={csvHeaders}
                filename={`leads_todos_${activeProject?.name?.replace(/\s+/g, '_') || 'geral'}.csv`}
                ref={csvLinkRef}
                style={{ display: 'none' }}
                target="_blank"
            />
        </LeadsWrapper>
    );
};
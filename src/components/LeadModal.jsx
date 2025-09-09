// src/components/LeadModal.jsx

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL;

// --- ESTILOS ---
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 600px; height:850px;/* Aumentei a largura para acomodar os comentários */
  max-width: 90%;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

const Header = styled.h2`
  margin: 0;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  &[readOnly] {
    background-color: #f0f0f0;
    cursor: text;
    border-color: #ddd;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  
  &[readOnly] {
    background-color: #f0f0f0;
    cursor: text;
    border-color: #ddd;
    color: #444; /* Cor para o texto dos comentários existentes */
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  border: none;
  background-color: #9f20c5;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #7c199a;
  }
`;

const CopyButton = styled(Button)`
  background-color: #6c757d;
  &:hover {
    background-color: #5a6268;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

export const LeadModal = ({ lead, onClose, onSaveSuccess }) => {
    const [formData, setFormData] = useState({});
    const [novoComentario, setNovoComentario] = useState('');
    const [copySuccess, setCopySuccess] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        if (lead) {
            setFormData({
                nome: lead.nome,
                cidade: lead.cidade,
                status: lead.status,
            });
            setNovoComentario('');
            setCopySuccess('');
        }
    }, [lead]);

    if (!lead) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepara os dados para envio
            const dataToSend = { ...formData };

            // Se um novo comentário foi digitado, prepara para adicionar
            if (novoComentario.trim() !== '') {
                // Adiciona o novo comentário ao início dos comentários existentes
                const timestamp = new Date().toLocaleString('pt-BR');
                const newCommentEntry = `[${timestamp}] ${novoComentario}`;
                dataToSend.comentarios = lead.comentarios 
                    ? `${newCommentEntry}\n---\n${lead.comentarios}` 
                    : newCommentEntry;
            }

            const response = await axios.put(`${apiUrl}/api/leads/${lead._id}`, dataToSend, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            onSaveSuccess(response.data);
            onClose();
        } catch (error) {
            console.error("Erro ao atualizar o lead:", error);
            alert("Falha ao atualizar o lead.");
        }
    };
    const handleCopyContact = () => {
        const contactInfo = `Email: ${lead.email}\nTelefone: ${lead.telefone}`;
        navigator.clipboard.writeText(contactInfo).then(() => {
            setCopySuccess('Copiado!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, (err) => {
            console.error('Erro ao copiar texto: ', err);
            setCopySuccess('Falhou!');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    return (
        <ModalBackdrop onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <Header>Editar Lead: {lead.nome}</Header>
                <Form onSubmit={handleSubmit}>
                    <Label>Nome:</Label>
                    <Input type="text" name="nome" value={formData.nome || ''} onChange={handleChange} />
                    
                    <Label>Email:</Label>
                    <Input type="email" name="email" value={lead.email || ''} readOnly />
                    
                    <Label>Telefone:</Label>
                    <Input type="text" name="telefone" value={lead.telefone || ''} readOnly />

                    <Label>Cidade:</Label>
                    <Input type="text" name="cidade" value={formData.cidade || ''} onChange={handleChange} />
                    
                    <Label>Status:</Label>
                    <Select name="status" value={formData.status || 'novo'} onChange={handleChange}>
                        <option value="novo">Novo</option>
                        <option value="contatado">Contatado</option>
                        <option value="negociando">Negociando</option>
                        <option value="ganho">Ganho</option>
                        <option value="perdido">Perdido</option>
                    </Select>

                    <Label>Histórico de Comentários:</Label>
                    <TextArea 
                        rows="5" 
                        value={lead.comentarios || 'Nenhum comentário.'} 
                        readOnly 
                    />

                    <Label>Adicionar Novo Comentário:</Label>
                    <TextArea 
                        rows="3" 
                        value={novoComentario} 
                        onChange={(e) => setNovoComentario(e.target.value)} 
                        placeholder="Deixe uma anotação sobre o lead..."
                    />
                    <ButtonGroup>
                        <Button type="submit">Salvar Alterações</Button>
                        <CopyButton type="button" onClick={handleCopyContact}>
                            {copySuccess || 'Copiar Contato'}
                        </CopyButton>
                    </ButtonGroup>
                </Form>
            </ModalContent>
        </ModalBackdrop>
    );
};
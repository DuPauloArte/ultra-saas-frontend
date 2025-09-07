// src/components/ProjectEditModal.jsx

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const apiUrl = import.meta.env.VITE_API_URL;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  width: 400px;
  max-width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  border: none;
  background-color: #9f20c5;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #7c199a;
  }
`;

export const ProjectEditModal = ({ project, onClose, onSaveSuccess }) => {
    const [name, setName] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        if (project) {
            setName(project.name);
        }
    }, [project]);

    if (!project) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // =======================================================
            //     CORREÇÃO: Usando project._id em vez de project.id
            // =======================================================
            const response = await axios.put(`${apiUrl}/api/projects/${project._id}`, 
                { name }, 
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            onSaveSuccess(response.data);
            onClose();
        } catch (error) {
            console.error("Erro ao renomear o projeto:", error);
            alert('Falha ao renomear o projeto.');
        }
    };

    return (
        <ModalBackdrop onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <h2>Renomear Projeto</h2>
                <Form onSubmit={handleSubmit}>
                    <label htmlFor="projectName">Novo nome para "{project.name}":</label>
                    <Input
                        id="projectName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Button type="submit">Salvar Novo Nome</Button>
                </Form>
            </ModalContent>
        </ModalBackdrop>
    );
};
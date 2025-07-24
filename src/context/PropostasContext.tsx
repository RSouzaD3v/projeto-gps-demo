"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Proposta = {
  id: string;
  nomeCliente: string;
  emailCliente: string;
  nomeProjeto: string;
  especialidade: string;
  prazoEntrega: string;
  descricao: string;
  modeloPrecificacao: string;
  valor: string;
  desconto: string;
  modeloVisual: string;
  observacoes: string;
  dataCriacao: string;
};

type PropostasContextType = {
  propostas: Proposta[];
  addProposta: (p: Proposta) => void;
  updateProposta: (p: Proposta) => void;
  deleteProposta: (id: string) => void;
};

const PropostasContext = createContext<PropostasContextType | undefined>(undefined);

export function usePropostas() {
  const ctx = useContext(PropostasContext);
  if (!ctx) throw new Error("usePropostas must be used within PropostasProvider");
  return ctx;
}

export function PropostasProvider({ children }: { children: ReactNode }) {
  const [propostas, setPropostas] = useState<Proposta[]>([]);

  const addProposta = (p: Proposta) => setPropostas((prev) => [...prev, p]);
  const updateProposta = (p: Proposta) =>
    setPropostas((prev) => prev.map(item => item.id === p.id ? p : item));
  const deleteProposta = (id: string) =>
    setPropostas((prev) => prev.filter(item => item.id !== id));

  return (
    <PropostasContext.Provider value={{ propostas, addProposta, updateProposta, deleteProposta }}>
      {children}
    </PropostasContext.Provider>
  );
}

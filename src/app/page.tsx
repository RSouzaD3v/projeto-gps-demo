"use client";
import { useState } from "react";
import PropostaWizard from "@/components/PropostaWizard";
import DashboardCard from "@/components/DashboardCard";
import { usePropostas, Proposta } from "@/context/PropostasContext";

export default function Dashboard() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editProposta, setEditProposta] = useState<Proposta | null>(null);
  const { propostas, deleteProposta } = usePropostas();

  function handleNova() {
    setEditProposta(null);
    setWizardOpen(true);
  }
  function handleEditar(p: Proposta) {
    setEditProposta(p);
    setWizardOpen(true);
  }
  function handleCloseWizard() {
    setWizardOpen(false);
    setEditProposta(null);
  }

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Dashboard do GPS Clínicas</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard
            title="Nova Proposta"
            description="Crie uma nova proposta comercial personalizada e gere precificação detalhada para o seu cliente."
            action={
              <button
                className="bg-black text-white px-6 py-2 rounded-xl font-semibold"
                onClick={handleNova}
              >
                Nova Proposta
              </button>
            }
          />
          <DashboardCard
            title="Projetos"
            description="Acompanhe os projetos em andamento, etapas, documentos e status."
            action={
              <button
                className="bg-gray-300 text-gray-500 px-6 py-2 rounded-xl cursor-not-allowed"
                disabled
              >Em breve</button>
            }
          />
          <DashboardCard
            title="GPS Interativo"
            description="Navegue pelas etapas do processo de aprovação e execução do seu projeto clínico."
            action={
              <button
                className="bg-gray-300 text-gray-500 px-6 py-2 rounded-xl cursor-not-allowed"
                disabled
              >Em breve</button>
            }
          />
        </div>

        {/* Lista de propostas salvas */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Propostas Salvas</h2>
          {propostas.length === 0 ? (
            <div className="text-gray-500">Nenhuma proposta salva ainda.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {propostas.map((p) => (
                <div key={p.id} className="bg-white shadow rounded-xl p-4">
                  <div className="font-semibold">{p.nomeProjeto} ({p.nomeCliente})</div>
                  <div className="text-sm text-gray-600">{p.especialidade}</div>
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(p.dataCriacao).toLocaleDateString()}
                  </div>
                  <div>
                    <b>Valor:</b> R$ {p.valor}
                    {p.desconto && <> <b>Desconto:</b> {p.desconto}%</>}
                  </div>
                  <div>
                    <b>Prazo:</b>{" "}
                    {p.prazoEntrega && new Date(p.prazoEntrega).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">{p.descricao}</div>
                  <div className="flex gap-3 mt-4">
                    <button
                      className="text-blue-600 underline"
                      onClick={() => handleEditar(p)}
                    >Editar</button>
                    <button
                      className="text-red-600 underline"
                      onClick={() => deleteProposta(p.id)}
                    >Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Modal Proposta Wizard */}
      <PropostaWizard open={wizardOpen} onClose={handleCloseWizard} initialData={editProposta} />
    </main>
  );
}

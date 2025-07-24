"use client";
import { useState, useEffect } from "react";
import { usePropostas, Proposta } from "@/context/PropostasContext";

const etapas = [
  { label: "Detalhes", descricao: "Informações básicas" },
  { label: "Precificação", descricao: "Cálculos e valores" },
  { label: "Modelo", descricao: "Personalização visual" },
  { label: "Visualização", descricao: "Revisão final" },
];

const especialidades = [
  "Cardiologia", "Dermatologia", "Odontologia", "Clínica Geral", "Ginecologia", "Ortopedia",
  "Pediatria", "Psicologia", "Psiquiatria", "Estética", "Outra"
];

const modelos = [
  "Padrão Simples", "Com Logo e Cores da Marca", "Visual Moderno", "Outro"
];

export default function PropostaWizard({
  open,
  onClose,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  initialData?: Proposta | null;
}) {
  const isEdit = !!initialData;
  const { addProposta, updateProposta } = usePropostas();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Partial<Proposta>>({
    nomeCliente: "",
    emailCliente: "",
    nomeProjeto: "",
    especialidade: "",
    prazoEntrega: "",
    descricao: "",
    modeloPrecificacao: "",
    valor: "",
    desconto: "",
    modeloVisual: "",
    observacoes: "",
  });

  // IA - Precificação
  const [loadingIA, setLoadingIA] = useState(false);
  const [explicacaoIA, setExplicacaoIA] = useState("");

  // Preencher o formulário ao editar
  useEffect(() => {
    if (open && initialData) {
      setForm(initialData);
      setStep(0);
    } else if (open && !initialData) {
      setForm({
        nomeCliente: "",
        emailCliente: "",
        nomeProjeto: "",
        especialidade: "",
        prazoEntrega: "",
        descricao: "",
        modeloPrecificacao: "",
        valor: "",
        desconto: "",
        modeloVisual: "",
        observacoes: "",
      });
      setStep(0);
    }
    setExplicacaoIA("");
    setLoadingIA(false);
  }, [open, initialData]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAvancar(e: React.FormEvent) {
    e.preventDefault();
    setStep((s) => Math.min(etapas.length - 1, s + 1));
  }

  function handleVoltar() {
    setStep((s) => Math.max(0, s - 1));
  }

  function handleFinalizar(e: React.FormEvent) {
    e.preventDefault();
    if (isEdit) {
      updateProposta({ ...(form as Proposta) });
    } else {
      addProposta({
        ...(form as Proposta),
        id: crypto.randomUUID(),
        dataCriacao: new Date().toISOString(),
      });
    }
    onClose();
  }

  async function handleSugestaoIA() {
    setLoadingIA(true);
    setExplicacaoIA("Consultando IA...");
    try {
      const resposta = await fetch("/api/precificacao-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dadosProposta: form }),
      }).then((r) => r.json());
      if (resposta.valorSugerido) {
        setForm((f) => ({
          ...f,
          valor: resposta.valorSugerido
        }));
        setExplicacaoIA(resposta.explicacao || resposta.textoCompleto || "Sugestão recebida da IA.");
      } else {
        setExplicacaoIA("A IA não conseguiu sugerir um valor para esses dados.");
      }
    } catch {
      setExplicacaoIA("Erro ao consultar IA.");
    }
    setLoadingIA(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40">
      <div className="bg-white h-screen overflow-auto rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative">
        <button
          className="absolute md:top-5 top-2 right-3 md:right-6 text-2xl text-gray-400 hover:text-black"
          onClick={onClose}
        >×</button>

        <h1 className="text-2xl font-bold mb-1">
          {isEdit ? "Editar Proposta" : "Nova Proposta Comercial"}
        </h1>
        <p className="mb-6 text-gray-600">
          Crie uma proposta personalizada para seu cliente.
        </p>

        {/* Barra de etapas */}
        <div className="flex items-center justify-center md:px-0 px-5 gap-8 mb-6">
          {etapas.map((et, idx) => (
            <div key={et.label} className="flex flex-col items-center">
              <div
                className={
                  "w-9 h-9 flex items-center justify-center rounded-full font-bold text-lg " +
                  (idx === step
                    ? "bg-black text-white border-4 border-black"
                    : "bg-gray-200 text-black")
                }
              >{idx + 1}</div>
              <div className={(idx === step ? "text-black" : "text-gray-400") + " mt-2 text-xs font-semibold"}>
                {et.label}
              </div>
              <div className="text-[11px] text-gray-400 hidden md:block">{et.descricao}</div>
            </div>
          ))}
        </div>

        <form className="grid grid-cols-2 gap-4" onSubmit={step === etapas.length - 1 ? handleFinalizar : handleAvancar}>
          {/* ETAPA 1: Detalhes */}
          {step === 0 && (
            <>
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Nome do Cliente</label>
                <input
                  type="text"
                  name="nomeCliente"
                  placeholder="Nome completo"
                  value={form.nomeCliente}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold">E-mail do Cliente</label>
                <input
                  type="email"
                  name="emailCliente"
                  placeholder="email@exemplo.com"
                  value={form.emailCliente}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="font-semibold">Nome do Projeto</label>
                <input
                  type="text"
                  name="nomeProjeto"
                  placeholder="Ex: Consultório Dr. Silva"
                  value={form.nomeProjeto}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Especialidade</label>
                <select
                  name="especialidade"
                  value={form.especialidade}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Selecione a especialidade</option>
                  {especialidades.map((esp) => <option key={esp}>{esp}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Prazo de Entrega</label>
                <input
                  type="date"
                  name="prazoEntrega"
                  value={form.prazoEntrega}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="font-semibold">Descrição do Projeto</label>
                <textarea
                  name="descricao"
                  placeholder="Descreva o escopo do projeto, objetivos e necessidades específicas..."
                  value={form.descricao}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 min-h-[60px]"
                />
              </div>
            </>
          )}

          {/* ETAPA 2: Precificação */}
          {step === 1 && (
            <>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="font-semibold">Modelo de Precificação</label>
                <select
                  name="modeloPrecificacao"
                  value={form.modeloPrecificacao}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="gps">Automático (GPS)</option>
                  <option value="metro2">Por m²</option>
                  <option value="pacote">Pacote Fixo</option>
                  <option value="personalizado">Personalizado</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Valor Proposta (R$)</label>
                <input
                  type="number"
                  name="valor"
                  placeholder="Ex: 8000"
                  value={form.valor}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2"
                  required
                  min="0"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Desconto (%)</label>
                <input
                  type="number"
                  name="desconto"
                  placeholder="Ex: 5"
                  value={form.desconto}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2"
                  min="0"
                  max="100"
                />
              </div>
              <div className="flex items-end gap-3 col-span-2">
                <button
                  type="button"
                  onClick={handleSugestaoIA}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  disabled={loadingIA}
                >
                  {loadingIA ? "Consultando IA..." : "Sugerir com IA"}
                </button>
                {explicacaoIA && (
                  <span className="text-xs text-gray-700">{explicacaoIA}</span>
                )}
              </div>
            </>
          )}

          {/* ETAPA 3: Modelo Visual */}
          {step === 2 && (
            <>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="font-semibold">Modelo Visual</label>
                <select
                  name="modeloVisual"
                  value={form.modeloVisual}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Selecione</option>
                  {modelos.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="font-semibold">Observações Adicionais</label>
                <textarea
                  name="observacoes"
                  placeholder="Ex: Inserir logomarca, seguir paleta de cores da empresa, etc."
                  value={form.observacoes}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 min-h-[60px]"
                />
              </div>
            </>
          )}

          {/* ETAPA 4: Visualização (Resumo) */}
          {step === 3 && (
            <>
              <div className="col-span-2">
                <h2 className="text-lg font-bold mb-2">Resumo da Proposta</h2>
                <div className="bg-gray-100 p-4 rounded-xl text-sm leading-relaxed space-y-2">
                  <div><b>Cliente:</b> {form.nomeCliente}</div>
                  <div><b>E-mail:</b> {form.emailCliente}</div>
                  <div><b>Projeto:</b> {form.nomeProjeto}</div>
                  <div><b>Especialidade:</b> {form.especialidade}</div>
                  <div><b>Prazo de Entrega:</b> {form.prazoEntrega && new Date(form.prazoEntrega).toLocaleDateString()}</div>
                  <div><b>Descrição:</b> {form.descricao}</div>
                  <hr />
                  <div><b>Precificação:</b> {form.modeloPrecificacao}</div>
                  <div><b>Valor:</b> R$ {form.valor} {form.desconto && <> (Desconto: {form.desconto}%)</>}</div>
                  <hr />
                  <div><b>Modelo Visual:</b> {form.modeloVisual}</div>
                  <div><b>Observações:</b> {form.observacoes}</div>
                </div>
              </div>
            </>
          )}

          {/* Navegação dos botões */}
          <div className="col-span-2 flex justify-between mt-8">
            <button
              type="button"
              onClick={handleVoltar}
              className="px-6 py-2 rounded-xl text-black border border-black"
              disabled={step === 0}
            >Voltar</button>

            {step < etapas.length - 1 ? (
              <button
                type="submit"
                className="bg-black text-white rounded-xl px-6 py-2 text-lg"
              >Avançar</button>
            ) : (
              <button
                type="submit"
                className="bg-green-600 text-white rounded-xl px-6 py-2 text-lg"
              >{isEdit ? "Salvar" : "Finalizar"}</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

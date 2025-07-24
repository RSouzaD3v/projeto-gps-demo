"use client";
import { Proposta, usePropostas } from "@/context/PropostasContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

type PropostaFormProps = {
  initialData?: Proposta;
};

export default function PropostaForm({ initialData }: PropostaFormProps) {
  const { addProposta, updateProposta } = usePropostas();
  const [form, setForm] = useState<Proposta>(
    initialData ?? {
      id: crypto.randomUUID(),
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
      dataCriacao: "",
    }
  );
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      updateProposta(form);
    } else {
      addProposta({ ...form, dataCriacao: new Date().toISOString() });
    }
    router.push("/");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input name="nomeCliente" placeholder="Nome do Cliente" value={form.nomeCliente} onChange={handleChange} className="border px-3 py-2 rounded w-full" required />
      <input name="emailCliente" placeholder="E-mail" value={form.emailCliente} onChange={handleChange} className="border px-3 py-2 rounded w-full" required />
      <input name="nomeProjeto" placeholder="Nome do Projeto" value={form.nomeProjeto} onChange={handleChange} className="border px-3 py-2 rounded w-full" required />
      <input name="especialidade" placeholder="Especialidade" value={form.especialidade} onChange={handleChange} className="border px-3 py-2 rounded w-full" required />
      <input name="prazoEntrega" placeholder="Prazo de Entrega" value={form.prazoEntrega} onChange={handleChange} className="border px-3 py-2 rounded w-full" required />
      <input name="valor" type="number" placeholder="Valor da Proposta (R$)" value={form.valor} onChange={handleChange} className="border px-3 py-2 rounded w-full" required />
      <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
        {initialData ? "Salvar Alterações" : "Criar Proposta"}
      </button>
    </form>
  );
}

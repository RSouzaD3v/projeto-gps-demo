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
      cliente: "",
      contato: "",
      especialidade: "",
      area: 0,
      ambientes: [],
      valor: 0,
    }
  );
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "area" || name === "valor" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      updateProposta(form);
    } else {
      addProposta(form);
    }
    router.push("/");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input name="cliente" placeholder="Cliente" value={form.cliente} onChange={handleChange} className="border px-3 py-2 rounded w-full" required />
      <input name="contato" placeholder="Contato (whatsapp)" value={form.contato} onChange={handleChange} className="border px-3 py-2 rounded w-full" required />
      <input name="especialidade" placeholder="Especialidade" value={form.especialidade} onChange={handleChange} className="border px-3 py-2 rounded w-full" required />
      <input name="area" type="number" placeholder="Área (m²)" value={form.area} onChange={handleChange} className="border px-3 py-2 rounded w-full" required />
      <input name="valor" type="number" placeholder="Valor da Proposta (R$)" value={form.valor} onChange={handleChange} className="border px-3 py-2 rounded w-full" required />
      <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
        {initialData ? "Salvar Alterações" : "Criar Proposta"}
      </button>
    </form>
  );
}

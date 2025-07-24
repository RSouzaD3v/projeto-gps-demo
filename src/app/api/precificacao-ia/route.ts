import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  const { dadosProposta } = await req.json();
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const prompt = `
Aja como um consultor especialista em precificação para projetos de arquitetura de clínicas.
Sempre responda estritamente no seguinte formato JSON:

{
  "valorSugerido": <apenas o número, sem R$ ou pontos>,
  "explicacao": "<texto explicando brevemente a lógica do valor e dicas para iniciantes>"
}

NUNCA escreva nada fora desse JSON.
Aqui estão os dados:
- Nome do Projeto: ${dadosProposta.nomeProjeto}
- Especialidade: ${dadosProposta.especialidade}
- Descrição: ${dadosProposta.descricao}
- Prazo: ${dadosProposta.prazoEntrega}
- Modelo de Precificação: ${dadosProposta.modeloPrecificacao}

Responda apenas o JSON, sem explicações extras.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", // ajuste conforme seu acesso
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  // A forma correta de acessar o texto do SDK:
  const texto = response.text as string;

  // Extrair JSON ou fazer fallback
  let valorSugerido = "";
  let explicacao = "";
  try {
    const match = texto.match(/{[\s\S]*}/);
    if (match) {
      const obj = JSON.parse(match[0]);
      valorSugerido = obj.valorSugerido;
      explicacao = obj.explicacao;
    }
  } catch {}

  if (!valorSugerido && texto) {
    const match2 = texto.match(/(\d{3,6}(?:[.,]\d{3})?)/);
    if (match2) {
      valorSugerido = match2[1].replace(/[^\d]/g, "");
      explicacao = texto;
    }
  }

  return NextResponse.json({ valorSugerido, explicacao, textoCompleto: texto });
}

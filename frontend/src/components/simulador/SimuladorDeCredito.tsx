/**
 * Componente SimuladorCredito
 * 
 * Este componente React implementa um simulador de crédito simples que permite ao usuário
 * inserir dados pessoais e financeiros para calcular um limite de crédito aprovado e o
 * número máximo de parcelas possíveis.
 * 
 * Funcionalidades principais:
 * - Controle dos campos do formulário via estado local com useState.
 * - Formatação automática do CPF para o padrão brasileiro (000.000.000-00).
 * - Validação dos campos: nome obrigatório, CPF válido, idade entre 18 e 75 anos,
 *   tempo de emprego, renda mensal mínima, score de crédito e valor das dívidas.
 * - Cálculo do limite de crédito baseado em renda, score, dívidas e tempo de emprego,
 *   com ajustes conforme regras definidas no cálculo.
 * - Apresentação clara dos resultados, com mensagens de erro ou sucesso para feedback ao usuário.
 * - Opção para limpar o formulário e reiniciar a simulação.
 */

import { useState } from "react";

export default function SimuladorCredito() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [idade, setIdade] = useState("");
  const [tempoEmprego, setTempoEmprego] = useState("");
  const [renda, setRenda] = useState("");
  const [score, setScore] = useState("");
  const [dividas, setDividas] = useState("");
  const [limiteAprovado, setLimiteAprovado] = useState<number | null>(null);
  const [parcelas, setParcelas] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState("");

  // Formata o CPF para o padrão 000.000.000-00
  const formatarCPF = (value: string) => {
    const cpfNumeros = value.replace(/\D/g, "").slice(0, 11);
    let cpfFormatado = cpfNumeros;

    if (cpfNumeros.length > 3 && cpfNumeros.length <= 6) {
      cpfFormatado = cpfNumeros.replace(/(\d{3})(\d+)/, "$1.$2");
    } else if (cpfNumeros.length > 6 && cpfNumeros.length <= 9) {
      cpfFormatado = cpfNumeros.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    } else if (cpfNumeros.length > 9) {
      cpfFormatado = cpfNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    }

    return cpfFormatado;
  };

  // Converte valores monetários
  const parseValor = (value: string) => {
    let valorLimpo = value.replace(/[^\d,.-]/g, "").replace(",", ".");
    return parseFloat(valorLimpo) || 0;
  };

  // Limpar formulário
  const limparFormulario = () => {
    setNome("");
    setCpf("");
    setIdade("");
    setTempoEmprego("");
    setRenda("");
    setScore("");
    setDividas("");
    setLimiteAprovado(null);
    setParcelas(null);
    setMensagem("");
  };

  // Validação do CPF
  const validarCPF = (cpf: string) => {
    const cpfNumeros = cpf.replace(/\D/g, "");
    return cpfNumeros.length === 11;
  };

  // Calcular limite de crédito
  const calcularCredito = () => {
    if (!nome.trim()) {
      setMensagem("Por favor, preencha o nome.");
      return;
    }

    if (!validarCPF(cpf)) {
      setMensagem("CPF inválido. Informe 11 números.");
      return;
    }

    const idadeNum = parseInt(idade);
    const tempoEmpregoNum = parseInt(tempoEmprego);
    const rendaNum = parseValor(renda);
    const scoreNum = parseInt(score);
    const dividasNum = parseValor(dividas);

    if (
      isNaN(idadeNum) ||
      isNaN(tempoEmpregoNum) ||
      isNaN(rendaNum) ||
      isNaN(scoreNum) ||
      isNaN(dividasNum)
    ) {
      setMensagem("Por favor, preencha todos os campos corretamente.");
      return;
    }

    if (idadeNum < 18 || idadeNum > 75) {
      setMensagem("Idade fora do permitido para crédito (18 a 75 anos).");
      return;
    }

    if (tempoEmpregoNum < 0) {
      setMensagem("Tempo de emprego inválido.");
      return;
    }

    if (rendaNum < 1000) {
      setMensagem("Renda insuficiente para crédito.");
      return;
    }

    if (scoreNum < 300) {
      setMensagem("Score muito baixo para aprovação.");
      return;
    }

    // Cálculo do limite de crédito
    let limiteBase = rendaNum * (scoreNum / 850) * 6;

    // Ajuste baseado em dívidas
    if (dividasNum > rendaNum * 0.5) {
      setMensagem("Dívidas muito altas, limite reduzido.");
      limiteBase *= 0.6;
    }

    // Ajuste baseado no tempo de emprego
    if (tempoEmpregoNum < 12) {
      limiteBase *= 0.7;
    } else if (tempoEmpregoNum >= 60) {
      limiteBase *= 1.3;
    }

    // Limitação com base no score
    if (scoreNum < 500) {
      limiteBase *= 0.5;
    } else if (scoreNum > 750) {
      limiteBase *= 1.5;
    }

    const limite = Math.round(limiteBase);
    const parcelaMaxima = Math.round(rendaNum * 0.3);
    const maxParcelas = parcelaMaxima > 0 ? Math.floor(limite / parcelaMaxima) : 0;

    setLimiteAprovado(limite);
    setParcelas(maxParcelas > 0 ? maxParcelas : 1);
    setMensagem("Simulação concluída com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center mt-16">
      <h1 className="text-2xl font-bold mb-6">Simulador de Crédito</h1>

      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <label className="block mb-2 font-semibold">Nome Completo:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: João da Silva"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <label className="block mb-2 font-semibold">CPF:</label>
        <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(formatarCPF(e.target.value))}
          placeholder="000.000.000-00"
          maxLength={14}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <label className="block mb-2 font-semibold">Idade:</label>
        <input
          type="number"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          placeholder="Ex: 30"
          min={18}
          max={75}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <label className="block mb-2 font-semibold">Tempo de Emprego (meses):</label>
        <input
          type="number"
          value={tempoEmprego}
          onChange={(e) => setTempoEmprego(e.target.value)}
          placeholder="Ex: 36"
          min={0}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <label className="block mb-2 font-semibold">Renda Mensal (R$):</label>
        <input
          type="text"
          value={renda}
          onChange={(e) => setRenda(e.target.value)}
          placeholder="Ex: R$ 3.500,00"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <label className="block mb-2 font-semibold">Score de Crédito (0-850):</label>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="Ex: 700"
          min={0}
          max={850}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <label className="block mb-2 font-semibold">Valor das Dívidas (R$):</label>
        <input
          type="text"
          value={dividas}
          onChange={(e) => setDividas(e.target.value)}
          placeholder="Ex: R$ 500,00"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <button
          onClick={calcularCredito}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          Simular
        </button>

        {mensagem && (
          <p className={`mt-4 text-center font-semibold ${limiteAprovado !== null ? "text-green-700" : "text-red-600"}`}>
            {mensagem}
          </p>
        )}

        {limiteAprovado !== null && parcelas !== null && (
          <div className="mt-6 space-y-4">
            <div className="bg-blue-100 p-4 rounded-lg shadow-md">
              <p className="text-xl font-semibold text-blue-600">Limite de Crédito Aprovado:</p>
              <p className="text-2xl font-bold text-blue-800">
                R$ {limiteAprovado.toLocaleString("pt-BR")}
              </p>
            </div>

            <div className="bg-green-100 p-4 rounded-lg shadow-md">
              <p className="text-xl font-semibold text-green-600">Parcelamento:</p>
              <p className="text-lg text-green-800">
                {parcelas}x de R$ {Math.round(limiteAprovado / parcelas).toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={limparFormulario}
        className="w-full bg-gray-500 text-white font-semibold py-2 rounded mt-6 hover:bg-gray-600 transition"
      >
        Limpar Formulário
      </button>
    </div>
  );
}

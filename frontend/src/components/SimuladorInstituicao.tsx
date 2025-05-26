import React, { useState } from "react";

export default function SimuladorInstituicao() {
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
    // Remove tudo que não for número
    const cpfNumeros = value.replace(/\D/g, "").slice(0, 11);
    let cpfFormatado = cpfNumeros;

    if (cpfNumeros.length > 3 && cpfNumeros.length <= 6) {
      cpfFormatado = cpfNumeros.replace(/(\d{3})(\d+)/, "$1.$2");
    } else if (cpfNumeros.length > 6 && cpfNumeros.length <= 9) {
      cpfFormatado = cpfNumeros.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    } else if (cpfNumeros.length > 9) {
      cpfFormatado = cpfNumeros.replace(
        /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
        "$1.$2.$3-$4"
      );
    }

    return cpfFormatado;
  };

  // Formata valores monetários para R$ 1.234,56
  const formatarValorMonetario = (value: string) => {
    // Remove tudo que não for número ou vírgula/ponto para decimal
    let valorLimpo = value.replace(/[^\d,.-]/g, "").replace(",", ".");
    if (!valorLimpo) return "";

    const valorNum = parseFloat(valorLimpo);
    if (isNaN(valorNum)) return "";

    return valorNum.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Para parsear os valores de string para número (com vírgula decimal)
  const parseValor = (value: string) => {
    if (!value) return NaN;
    // Remove tudo que não for número ou vírgula/ponto
    const somenteNumeros = value.replace(/[^\d,.-]/g, "").replace(",", ".");
    return parseFloat(somenteNumeros);
  };

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

  const validarCPF = (cpf: string) => {
    // Remove pontuação para validar
    const cpfNumeros = cpf.replace(/\D/g, "");
    return cpfNumeros.length === 11;
  };

  const calcularCredito = () => {
    if (!nome.trim()) {
      setMensagem("Por favor, preencha o nome.");
      setLimiteAprovado(null);
      setParcelas(null);
      return;
    }
    if (!validarCPF(cpf)) {
      setMensagem("CPF inválido. Informe 11 números.");
      setLimiteAprovado(null);
      setParcelas(null);
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
      setLimiteAprovado(null);
      setParcelas(null);
      return;
    }

    if (idadeNum < 18 || idadeNum > 75) {
      setMensagem("Idade fora do permitido para crédito (18 a 75 anos).");
      setLimiteAprovado(null);
      setParcelas(null);
      return;
    }

    if (tempoEmpregoNum < 0) {
      setMensagem("Tempo de emprego inválido.");
      setLimiteAprovado(null);
      setParcelas(null);
      return;
    }

    if (rendaNum < 500) {
      setMensagem("Renda insuficiente para crédito.");
      setLimiteAprovado(null);
      setParcelas(null);
      return;
    }

    if (scoreNum < 300) {
      setMensagem("Score muito baixo para aprovação.");
      setLimiteAprovado(null);
      setParcelas(null);
      return;
    }

    // Cálculo do limite de crédito simplificado
    let limiteBase = rendaNum * (scoreNum / 850) * 5;

    if (dividasNum > rendaNum * 0.5) {
      setMensagem("Dívidas muito altas, limite reduzido.");
      limiteBase *= 0.5;
    }

    if (tempoEmpregoNum < 12) {
      limiteBase *= 0.7;
    } else if (tempoEmpregoNum >= 60) {
      limiteBase *= 1.2;
    }

    const limite = Math.round(limiteBase);
    const parcelaMaxima = Math.round(rendaNum * 0.3);
    const maxParcelas = parcelaMaxima > 0 ? Math.floor(limite / parcelaMaxima) : 0;

    setLimiteAprovado(limite);
    setParcelas(maxParcelas > 0 ? maxParcelas : 1);
    setMensagem("Simulação concluída com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center mt-10">
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
          maxLength={14} // 11 números + 3 caracteres de pontuação
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
          onChange={(e) => {
            const raw = e.target.value;
            // Permite só números, vírgula, ponto e R$
            const semLetras = raw.replace(/[^0-9,.\sR$]/g, "");
            setRenda(semLetras);
          }}
          onBlur={() => {
            setRenda((r) => formatarValorMonetario(r));
          }}
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
          onChange={(e) => {
            const raw = e.target.value;
            const semLetras = raw.replace(/[^0-9,.\sR$]/g, "");
            setDividas(semLetras);
          }}
          onBlur={() => {
            setDividas((d) => formatarValorMonetario(d));
          }}
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
          <p
            className={`mt-4 text-center font-semibold ${
              limiteAprovado !== null ? "text-green-700" : "text-red-600"
            }`}
          >
            {mensagem}
          </p>
        )}

        {limiteAprovado !== null && parcelas !== null && (
          <div className="mt-6 text-center">
            <p className="text-lg font-bold">
              Limite aprovado:{" "}
              {limiteAprovado.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
            <p className="mt-2">
              Parcelas máximas sugeridas: <strong>{parcelas}</strong>
            </p>
          </div>
        )}

        <button
          onClick={limparFormulario}
          className="mt-4 w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
        >
          Limpar
        </button>
      </div>
    </div>
  );
}

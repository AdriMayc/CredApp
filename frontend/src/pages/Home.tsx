// Home.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaUsers,
  FaChartLine,
  FaPercentage,
  FaMoneyBillWave,
} from "react-icons/fa";

import CardInadimplentes from "../components/home/CardInadimplentes";
import DividasMensaisChart from "../components/home/DividasMensaisChart";

const COLORS = ["#3B82F6", "#22C55E"];

interface EntradaHistorico {
  id_cliente: number;
  nome: string;
  valor_emprestimo: number;
  status: "aceito" | "recusado";
  data: string;
}

interface DadosInstituicao {
  score_por_profissao: any[];
  faixa_etaria: { faixa: string; count: number }[];
  adimplencia: { adimplentes: number; inadimplentes: number };
  indicadores: {
    total_clientes: number;
    score_medio: number;
    inadimplentes_percentual: number;
    renda_media: number;
  };
}

interface PainelResumoCreditoProps {
  creditoTotal: number;
  creditoUsado: number;
}

function PainelResumoCredito({ creditoTotal, creditoUsado }: PainelResumoCreditoProps) {
  const limiteDisponivel = creditoTotal - creditoUsado;
  const limiteAnteriorRef = useRef(limiteDisponivel);
  const [limiteCresceu, setLimiteCresceu] = useState<boolean | null>(null);

  useEffect(() => {
    if (limiteAnteriorRef.current !== limiteDisponivel) {
      setLimiteCresceu(limiteDisponivel > limiteAnteriorRef.current);
      limiteAnteriorRef.current = limiteDisponivel;
    }
  }, [limiteDisponivel]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mx-auto mt-5">
      <div className="rounded-2xl shadow-md p-4 bg-white border border-gray-200">
        <p className="text-gray-500 text-sm">Crédito Total</p>
        <p className="text-2xl font-semibold text-black">
          R$ {creditoTotal.toLocaleString()}
        </p>
      </div>

      <div className="rounded-2xl shadow-md p-4 bg-white border border-gray-200">
        <p className="text-gray-500 text-sm">Crédito Usado</p>
        <p className="text-2xl font-semibold text-blue-600">
          R$ {creditoUsado.toLocaleString()}
        </p>
      </div>

      <div
        className={`rounded-2xl shadow-md p-4 bg-white border border-gray-200 flex items-center justify-between ${limiteCresceu === null
            ? ""
            : limiteCresceu
              ? "border-green-600 bg-green-50"
              : "border-red-600 bg-red-50"
          }`}
      >
        <div>
          <p className="text-gray-500 text-sm">Limite Disponível</p>
          <p
            className={`text-2xl font-semibold ${limiteCresceu === null
                ? "text-gray-800"
                : limiteCresceu
                  ? "text-green-600"
                  : "text-red-600"
              }`}
          >
            R$ {limiteDisponivel.toLocaleString()}
          </p>
        </div>
        <div className="ml-4">
          {limiteCresceu === null ? null : limiteCresceu ? (
            <FaArrowUp className="text-green-600" />
          ) : (
            <FaArrowDown className="text-red-600" />
          )}
        </div>
      </div>
    </div>
  );
}

function ExtratoCredito() {
  const [historico, setHistorico] = useState<EntradaHistorico[]>([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const salvo = sessionStorage.getItem("historicoCredito");
    if (salvo) {
      setHistorico(JSON.parse(salvo));
    }
  }, []);

  const historicoFiltrado = historico.filter((item) =>
    item.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Extrato de Crédito
      </h2>
      <input
        type="text"
        placeholder="Buscar por nome do cliente..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {historicoFiltrado.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma movimentação encontrada.</p>
      ) : (
        <div className="max-h-[320px] overflow-y-auto pr-1 custom-scroll">
          {historicoFiltrado.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between py-4 px-2 mb-2 rounded-md shadow-xl border ${item.status === "aceito"
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : "bg-red-100 border-l-4 border-red-300"
                }`}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700">{item.nome}</p>
                <p className="text-xs text-gray-500">{item.data}</p>
              </div>
              <div className="text-right">
                <p
                  className={`text-base font-bold ${item.status === "aceito" ? "text-blue-600" : "text-red-400"
                    }`}
                >
                  {item.status === "aceito" ? "-" : ""} R$ {item.valor_emprestimo.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-gray-500 capitalize">{item.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PainelInstituicao() {
  const [dados, setDados] = useState<DadosInstituicao | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/dados-instituicao")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar dados");
        return res.json();
      })
      .then(setDados)
      .catch((err) => console.error("Erro ao carregar dados:", err));
  }, []);

  const [historico, setHistorico] = useState<EntradaHistorico[]>([]);
  useEffect(() => {
    const salvo = sessionStorage.getItem("historicoCredito");
    if (salvo) {
      setHistorico(JSON.parse(salvo));
    }
  }, []);

  const creditoTotal = 10000000;
  const creditoUsado = historico
    .filter((item) => item.status === "aceito")
    .reduce((acc, cur) => acc + cur.valor_emprestimo, 0);

  if (!dados) return <p className="text-center mt-20">Carregando dados...</p>;

  const { indicadores, adimplencia } = dados;

  const indicadoresArray = [
    {
      label: "Total de Clientes",
      valor: indicadores.total_clientes.toLocaleString(),
      icon: <FaUsers className="text-blue-500" />,
    },
    {
      label: "Score Médio",
      valor: indicadores.score_medio,
      icon: <FaChartLine className="text-green-500" />,
    },
    {
      label: "Inadimplentes",
      valor: `${indicadores.inadimplentes_percentual}%`,
      icon: <FaPercentage className="text-red-500" />,
    },
    {
      label: "Renda Média",
      valor: indicadores.renda_media.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      icon: <FaMoneyBillWave className="text-yellow-500" />,
    },
  ];

  const dadosAdimplencia = [
    { name: "Adimplentes", value: adimplencia.adimplentes },
    { name: "Inadimplentes", value: adimplencia.inadimplentes },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-16">
      <h1 className="text-3xl font-extrabold mb-6 text-center tracking-tight">
        Painel da Principal
      </h1>

      <PainelResumoCredito creditoTotal={creditoTotal} creditoUsado={creditoUsado} />
      <ExtratoCredito />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 mt-10">
        {indicadoresArray.map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow text-center border border-gray-300 w-[150px] max-w-[190px] min-h-[150px] flex flex-col justify-center"
          >
            <div className="flex justify-center mb-2 text-3xl">{item.icon}</div>
            <h3 className="font-semibold text-gray-600">{item.label}</h3>
            <p className="text-[1rem] font-bold text-gray-800 mt-1">{item.valor}</p>
          </div>
        ))}
      </div>

      <div>
        <CardInadimplentes />
      </div>

      <div className="mt-10">
        <DividasMensaisChart />
      </div>


    </div>
  );
}
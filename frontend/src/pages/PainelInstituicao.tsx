import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FaUsers, FaChartLine, FaPercentage, FaMoneyBillWave } from "react-icons/fa";
import PainelResumoCredito from "../components/home/PainelResumoCredito";
const COLORS = ["#3B82F6", "#22C55E"];

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
    <div className="min-h-screen bg-gradient-to-br p-6 mt-15">
      <h1 className="text-3xl font-extrabold mb-6 text-center tracking-tight">
        Painel da Principal
      </h1>

      <div className="mb-10">
        <PainelResumoCredito
          dados={{
            creditoTotal: 20000,
            creditoUsado: 8500,
            limiteDisponivel: 20000 - 8500,
          }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {indicadoresArray.map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-2xl shadow text-center border border-gray-300 w-[150px] max-w-[160px] min-h-[150px] flex flex-col justify-center"
          >
            <div className="flex justify-center mb-2 text-3xl">{item.icon}</div>
            <h3 className="font-semibold text-gray-600">{item.label}</h3>
            <p className="text-[1rem] font-bold text-gray-800 mt-1">{item.valor}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-2xl border border-gray-300">
          <h2 className="text-lg font-semibold mb-2 text-[#1E212B]">Adimplência</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dadosAdimplencia}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {dadosAdimplencia.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>
  );
}

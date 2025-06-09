import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Interface pra cada item de dívida mensal que vem da API
interface DividaMensal {
  mes: string;           
  total_divida: number;  
}

// Interface do formato que o ChartJS espera para os dados
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

export default function DividasAnuaisChart() {
  // Estado com tipo correto, pode ser null ou ChartData
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/dividas-mensais")
      .then((res) => {
        // Dizendo que dividasMensais é array de DividaMensal
        const dividasMensais: DividaMensal[] = res.data.dividas_mensais;

        // Agrupa as dívidas por ano somando os valores
        const dividasAnuais = dividasMensais.reduce<Record<string, number>>((acc, item) => {
          const ano = item.mes.slice(0, 4);
          if (!acc[ano]) {
            acc[ano] = 0;
          }
          acc[ano] += item.total_divida;
          return acc;
        }, {});

        const labels = Object.keys(dividasAnuais);
        const valores = Object.values(dividasAnuais);

        setData({
          labels,
          datasets: [
            {
              label: "Total de Dívidas Anuais (R$)",
              data: valores,
              backgroundColor: "rgba(53, 162, 235, 0.7)",
            },
          ],
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Erro ao carregar dados");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      className="bg-white py-5 px-2 border border-gray-200 shadow-xl rounded-xl"
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <h1 className="text-center font-semibold mb-4 text-xl text-gray-800">Controle de Dívidas</h1>
      {data && (
        <Bar
          data={data}
          options={{
            indexAxis: "x",
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Dívidas Anuais - R$" },
              tooltip: {
                callbacks: {
                  label: (context) =>
                    `R$ ${context.parsed.y.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) =>
                    `R$ ${value.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`,
                },
              },
            },
          }}
        />
      )}
    </div>
  );
}

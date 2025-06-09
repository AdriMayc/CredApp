/**
 * CardInadimplentes.tsx
 * 
 * Componente React que busca e exibe uma lista de clientes inadimplentes,
 * consumindo dados de uma API local.
 * 
 * Funcionalidades principais:
 * - Realiza requisição para endpoint `/clientes-inadimplentes` ao montar o componente.
 * - Controla estados de carregamento, erro e dados dos clientes.
 * - Limita a exibição aos primeiros 1000 clientes para otimização.
 * - Mostra informações relevantes de cada cliente, como nome, CPF, score de crédito,
 *   meses de atraso e valor total da dívida, formatado para Real.
 * - Exibe mensagens de loading, erro ou ausência de dados conforme o caso.
 * - Interface responsiva e estilizada com Tailwind CSS.
 */
import React, { useEffect, useState } from "react";
import { API_URL } from '../../config/api';

interface Cliente {
  id_cliente: number;
  nome: string;
  cpf: string;
  score_credito: string;
  score_credito_num: number;
  atrasos_meses: number;
  valor_total_divida: number;
}

const MAX_CLIENTES = 1000;

const CardInadimplentes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

 

  useEffect(() => {
    const fetchInadimplentes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/clientes-inadimplentes`);

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const todosClientes: Cliente[] = await response.json();
        setClientes(todosClientes.slice(0, MAX_CLIENTES));
        setError(null);
      } catch (err: unknown) {
        console.error("Falha ao buscar inadimplentes:", err);
        setError("Erro ao carregar clientes inadimplentes");
        setClientes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInadimplentes();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
        Clientes Inadimplentes
        {!loading && clientes.length > 0 && (
          <div className="text-sm font-normal text-gray-500 mt-1">
            ({clientes.length} encontrados)
          </div>
        )}
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
          {error}
        </div>
      )}

      <div className="h-60 overflow-y-auto space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Carregando clientes inadimplentes...</p>
          </div>
        ) : clientes.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">
              {error ? "Erro ao carregar dados" : "Nenhum cliente inadimplente encontrado."}
            </p>
          </div>
        ) : (
          clientes.map((cliente) => (
            <div key={cliente.id_cliente} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Nome + ID */}
                <div>
                  <p className="font-semibold text-gray-800">{cliente.nome}</p>
                  <p className="text-xs text-gray-500">ID: {cliente.id_cliente}</p>
                  <p className="text-xs text-gray-500">CPF: {cliente.cpf}</p>
                </div>

                {/* Score de crédito */}
                <div>
                  <p className="text-sm text-gray-600">
                    Score Crédito: <span className="font-semibold">{cliente.score_credito}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Score Num: <span className="font-semibold">{cliente.score_credito_num}</span>
                  </p>
                </div>

                {/* Atrasos e dívida */}
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Atrasos (meses): <span className="font-semibold">{cliente.atrasos_meses}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Dívida total: <span className="font-semibold">R$ {cliente.valor_total_divida.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CardInadimplentes;

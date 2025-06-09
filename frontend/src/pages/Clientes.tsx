/**
 * Componente Clientes
 * 
 * Exibe uma lista paginada, filtrada e ordenável de clientes.
 * 
 * Funcionalidades:
 * - Busca clientes da API com parâmetros de página, filtro de busca, ordenação e direção.
 * - Permite busca por nome ou CPF.
 * - Ordena por qualquer coluna clicada, alternando entre ascendente, descendente e sem ordenação.
 * - Exibe setas indicando direção da ordenação na coluna ativa.
 * - Paginação com botões 'Anterior' e 'Próxima' e indicação da página atual.
 * - Exibe dados como salário anual formatado em moeda brasileira.
 * - Renderiza um componente extra <SolicitacoesCredito /> ao final da lista.
 */

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import SolicitacoesCredito from '../components/clientes/SolicitacoesCredito';
import { API_URL } from '../config/api';

interface Cliente {
  id_cliente: number;
  nome: string;
  cpf: string;
  email: string;
  profissao: string;
  idade: number;
  salario_anual: number;
  score_credito: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [ordenarPor, setOrdenarPor] = useState('');
  const [direcao, setDirecao] = useState<'asc' | 'desc' | ''>('');
  const clientesPorPagina = 10;

  const headers = [
    { key: 'nome', label: 'Nome' },
    { key: 'cpf', label: 'CPF' },
    { key: 'email', label: 'Email' },
    { key: 'profissao', label: 'Profissão' },
    { key: 'idade', label: 'Idade' },
    { key: 'salario_anual', label: 'Salário Anual' },
    { key: 'score_credito', label: 'Score de Crédito' },
  ];

  // Debounce da busca (aguarda 500ms após parar de digitar)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchDebounced(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams({
      pagina: currentPage.toString(),
      limite: clientesPorPagina.toString(),
      filtro: searchDebounced,
    });

    if (ordenarPor && direcao) {
      params.append('ordenarPor', ordenarPor);
      params.append('direcao', direcao);
    }

    fetch(`${API_URL}/clientes?${params}`)
      .then(res => {
        if (!res.ok) throw new Error('Erro na resposta da API');
        return res.json();
      })
      .then(data => {
        setClientes(data.clientes);
        setTotalPaginas(Math.ceil(data.total / clientesPorPagina));
      })
      .catch(err => console.error('Erro ao carregar clientes:', err));
  }, [currentPage, searchDebounced, ordenarPor, direcao]);

  const alterarOrdenacao = (coluna: string) => {
    if (ordenarPor !== coluna) {
      setOrdenarPor(coluna);
      setDirecao('asc');
    } else if (direcao === 'asc') {
      setDirecao('desc');
    } else {
      setOrdenarPor('');
      setDirecao('');
    }
  };

  const renderSetaOrdenacao = (coluna: string) => {
    if (ordenarPor !== coluna) return null;
    if (direcao === 'asc') return <ArrowUp className="inline w-4 h-4 ml-1 text-blue-600" />;
    if (direcao === 'desc') return <ArrowDown className="inline w-4 h-4 ml-1 text-blue-600" />;
    return null;
  };

  return (
    <div className="my-20 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center">Lista de Clientes</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar por Nome ou CPF..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded"
            title="Limpar busca"
          >
            ↺
          </button>
        )}
      </div>

      <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
        <table className="min-w-full bg-white text-gray-900">
          <thead className="bg-blue-50">
            <tr>
              {headers.map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => alterarOrdenacao(key)}
                  className="w-[160px] max-w-[160px] px-4 py-3 truncate text-left uppercase text-sm font-semibold text-blue-600 border-b border-gray-200 cursor-pointer"
                >
                  {label}
                  {renderSetaOrdenacao(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente, idx) => (
              <tr
                key={cliente.id_cliente}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-blue-100 transition-colors'}
              >
                <td className="px-4 py-3 truncate">{cliente.nome}</td>
                <td className="px-4 py-3 truncate">{cliente.cpf}</td>
                <td className="px-4 py-3 truncate">{cliente.email}</td>
                <td className="px-4 py-3 truncate">{cliente.profissao}</td>
                <td className="px-4 py-3 truncate">{cliente.idade}</td>
                <td className="px-4 py-3 truncate">
                  R$ {cliente.salario_anual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 truncate font-semibold text-blue-600">{cliente.score_credito}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-gray-700">
          Página {currentPage} de {totalPaginas}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPaginas))}
          disabled={currentPage === totalPaginas}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>

      <SolicitacoesCredito />
    </div>
  );
}

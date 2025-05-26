import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import SolicitacoesCredito from '../components/SolicitacoesCredito'

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



  useEffect(() => {
    const params = new URLSearchParams({
      pagina: currentPage.toString(),
      limite: clientesPorPagina.toString(),
      filtro: search,
    });

    if (ordenarPor && direcao) {
      params.append('ordenarPor', ordenarPor);
      params.append('direcao', direcao);
    }

    fetch(`http://localhost:8000/clientes?${params}`)
      .then(res => {
        if (!res.ok) throw new Error('Erro na resposta da API');
        return res.json();
      })
      .then(data => {
        setClientes(data.clientes);
        setTotalPaginas(Math.ceil(data.total / clientesPorPagina));
      })
      .catch(err => console.error('Erro ao carregar clientes:', err));
  }, [currentPage, search, ordenarPor, direcao]);

  const alterarOrdenacao = (coluna: string) => {
    if (ordenarPor !== coluna) {
      setOrdenarPor(coluna);
      setDirecao('asc');
    } else if (direcao === 'asc') {
      setDirecao('desc');
    } else if (direcao === 'desc') {
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
    <div className="my-20 px-4 max-w-6xl mx-auto ">
      <h2 className="text-3xl font-semibold mb-6 flex justify-center">Lista de Clientes</h2>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar por Nome ou CPF..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => {
            setSearch('');
            setCurrentPage(1);
          }}
          className="py-[0.5rem] px-4 rounded-md border border-gray-300 bg-white hover:bg-blue-100 transition-colors shadow-sm"
          title="Limpar busca"
        >
          <span className="text-blue-600 text-2xl bottom-0.5 relative">↺</span>
        </button>
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
            {clientes.slice(0, 6).map((cliente, idx) => (
              <tr
                key={cliente.id_cliente}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-blue-100 transition-colors'}
              >
                <td className="w-[160px] max-w-[160px] px-4 py-3 truncate overflow-hidden whitespace-nowrap">{cliente.nome}</td>
                <td className="w-[160px] max-w-[160px] px-4 py-3 truncate overflow-hidden whitespace-nowrap">{cliente.cpf}</td>
                <td className="w-[160px] max-w-[160px] px-4 py-3 truncate overflow-hidden whitespace-nowrap">{cliente.email}</td>
                <td className="w-[160px] max-w-[160px] px-4 py-3 truncate overflow-hidden whitespace-nowrap">{cliente.profissao}</td>
                <td className="w-[160px] max-w-[160px] px-4 py-3 truncate overflow-hidden whitespace-nowrap">{cliente.idade}</td>
                <td className="w-[160px] max-w-[160px] px-4 py-3 truncate overflow-hidden whitespace-nowrap">
                  R$ {cliente.salario_anual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="w-[160px] max-w-[160px] px-4 py-3 truncate overflow-hidden whitespace-nowrap font-semibold text-blue-600">{cliente.score_credito}</td>
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

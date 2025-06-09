/**
 * Componente ExtratoCredito
 * 
 * Exibe um extrato de movimentações de crédito armazenadas na sessionStorage,
 * permitindo filtrar os registros pelo nome do cliente.
 * 
 * Funcionalidades:
 * - Carrega o histórico de crédito do sessionStorage ao montar o componente.
 * - Filtra a lista em tempo real conforme o texto digitado no campo de busca.
 * - Exibe registros com destaque visual diferente para status "aceito" e "recusado".
 * - Mostra mensagens informativas quando não há registros ou filtro não retorna resultados.
 */

import { useEffect, useState } from 'react';


interface EntradaHistorico {
  id_cliente: number;
  nome: string;
  valor_emprestimo: number;
  status: 'aceito' | 'recusado';
  data: string;
}

export default function ExtratoCredito() {
  const [historico, setHistorico] = useState<EntradaHistorico[]>([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const salvo = sessionStorage.getItem('historicoCredito');
    if (salvo) {
      setHistorico(JSON.parse(salvo));
    }
  }, []);

  const historicoFiltrado = historico.filter(item =>
    item.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md my-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Extrato de Crédito</h2>

      {/* Campo de filtro */}
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
        <div className="max-h-[400px] overflow-y-auto pr-1 custom-scroll">
          {historicoFiltrado.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between py-4 px-2 mb-2 rounded-md shadow-xl border ${item.status === 'aceito'
                  ? 'bg-green-50 border-l-4 border-blue-500'
                  : 'bg-red-100 border-l-4 border-red-300'
                }`}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-700">{item.nome}</p>
                <p className="text-xs text-gray-500">{item.data}</p>
              </div>

              <div className="text-right">
                <p
                  className={`text-base font-bold ${item.status === 'aceito' ? 'text-blue-500' : 'text-red-500'
                    }`}
                >
                  {item.status === 'aceito' ? '-' : ''} R${' '}
                  {item.valor_emprestimo.toLocaleString('pt-BR', {
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

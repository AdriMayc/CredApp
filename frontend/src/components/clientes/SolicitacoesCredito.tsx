/**
 * Componente responsável por exibir e gerenciar as solicitações de crédito pendentes.
 * 
 * Funcionalidades principais:
 * - Recupera clientes aleatórios da API e gera valores simulados de empréstimo.
 * - Exibe até 5 solicitações simultaneamente em formato de cards interativos.
 * - Permite ao usuário aceitar ou recusar cada solicitação.
 * - Ao tomar uma decisão, registra os dados e status no sessionStorage (histórico local).
 * - Remove solicitações aceitas/recusadas da tela e do contexto de notificações.
 * 
 * Utiliza os contextos:
 * - SolicitacoesContext: para adicionar e remover solicitações.
 * - NotificacoesContext: para remover notificações associadas ao cliente.
 */
import { useContext } from 'react';
import { SolicitacoesContext } from '../../context/SolicitacoesContext';
import type { SolicitacaoCredito } from '../../context/SolicitacoesContext';
import { NotificacoesContext } from '../../context/NotificacoesContext';


const maxCardsVisiveis = 5;

export default function SolicitacoesCredito() {
  const { solicitacoes, removerSolicitacao } = useContext(SolicitacoesContext);
  const { removerNotificacao } = useContext(NotificacoesContext);


  // Registra decisão no histórico local
  const registrarDecisao = (solicitacao: SolicitacaoCredito, status: 'aceito' | 'recusado') => {
    const historico = JSON.parse(sessionStorage.getItem('historicoCredito') || '[]');
    const novaEntrada = {
      ...solicitacao,
      status,
      data: new Date().toLocaleString('pt-BR'),
    };
    sessionStorage.setItem('historicoCredito', JSON.stringify([...historico, novaEntrada]));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Solicitações de Crédito
      </h2>

      <p className="mb-6 text-center text-gray-600 font-semibold">
        Pedidos na tela: {Math.min(solicitacoes.length, maxCardsVisiveis)} / Total pendentes: {solicitacoes.length}
      </p>

      <div className="space-y-6">
        {solicitacoes.slice(0, maxCardsVisiveis).map((s) => (
          <div
            key={s.id_cliente}
            className="border border-gray-300 rounded-lg p-5 shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold text-gray-700">{s.nome}</h3>
              <span className="text-sm text-gray-500">ID: {s.id_cliente}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
              <p><span className="font-semibold">CPF:</span> {s.cpf}</p>
              <p><span className="font-semibold">Profissão:</span> {s.profissao}</p>
              <p><span className="font-semibold">Idade:</span> {s.idade} anos</p>
              <p>
                <span className="font-semibold">Salário Anual:</span> R${' '}
                {s.salario_anual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="mt-4 border-t border-gray-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
              <p>
                <span className="font-semibold">Valor do Empréstimo:</span> R${' '}
                {s.valor_emprestimo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p><span className="font-semibold">Meses Restantes:</span> {s.meses_restantes}</p>
              <p><span className="font-semibold">Juros Mensal:</span> {s.juros_mensal}%</p>
              <p>
                <span className="font-semibold">Parcela Mensal:</span> R${' '}
                {s.valor_parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex gap-4 mt-5">
              <button
                onClick={() => {
                  registrarDecisao(s, 'aceito');
                  removerSolicitacao(s.id_cliente);
                  removerNotificacao(s.id_cliente);
                }}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Aceitar
              </button>
              <button
                onClick={() => {
                  registrarDecisao(s, 'recusado');
                  removerSolicitacao(s.id_cliente);
                  removerNotificacao(s.id_cliente);
                }}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                Recusar
              </button>
            </div>
          </div>
        ))}

        {solicitacoes.length === 0 && (
          <p className="text-center text-gray-500 mt-8">Nenhuma solicitação pendente no momento.</p>
        )}
      </div>
    </div>
  );
}

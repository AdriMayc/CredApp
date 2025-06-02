import React, { useContext } from 'react';
import { NotificacoesContext } from '../../context/NotificacoesContext';

export default function Notificacoes() {
  const { notificacoes, contador, removerNotificacao } = useContext(NotificacoesContext);
  const [mostrarLista, setMostrarLista] = React.useState(false);

  // Função para alternar manualmente a visibilidade da lista de notificações
  const toggleMostrarLista = () => {
    setMostrarLista((prev) => !prev);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMostrarLista}
        className="relative p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        aria-label="Notificações"
      >
        🔔
        {contador > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full px-2 text-xs font-bold">
            {contador}
          </span>
        )}
      </button>

      {mostrarLista && (
        <div className="absolute right-0 mt-2 w-90 max-h-96 overflow-auto bg-white shadow-lg rounded-md border border-gray-300 z-50">
          {notificacoes.length === 0 && (
            <p className="p-4 text-center text-gray-600">Nenhuma notificação</p>
          )}

          {notificacoes.map((n) => (
            <div key={n.id} className="border-b border-gray-200 p-3">
              <p className="font-semibold">{n.nome}</p>
              <p className="text-sm text-gray-600">
                Novo pedido de crédito: R${' '}
                {n.valor_emprestimo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <button
                onClick={() => removerNotificacao(n.id)}
                className="mt-2 text-xs text-red-600 hover:underline"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
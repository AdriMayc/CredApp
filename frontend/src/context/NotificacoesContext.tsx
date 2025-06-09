/**
 * Contexto de Notificações
 * 
 * Este arquivo implementa um contexto React para gerenciar notificações relacionadas
 * a solicitações de crédito, permitindo o compartilhamento do estado entre componentes.
 * 
 * Funcionalidades principais:
 * - Armazenamento das notificações em um estado local com useState.
 * - Adição de notificações únicas (evitando duplicatas pelo campo 'id').
 * - Remoção individual de notificações pelo 'id'.
 * - Limpeza total das notificações.
 * - Controle de um contador que acompanha a quantidade de notificações ativas.
 * 
 * Este contexto facilita o gerenciamento global das notificações no app, permitindo
 * que qualquer componente consumidor adicione, remova ou limpe notificações facilmente.
 */

import React, { createContext, useState } from 'react';
import type { ReactNode } from "react"
import type { SolicitacaoCredito } from './SolicitacoesContext';

interface Notificacao extends SolicitacaoCredito {
  id: number; // id único da notificação, pode ser id_cliente mesmo
}

interface NotificacoesContextType {
  notificacoes: Notificacao[];
  adicionarNotificacao: (notificacao: Notificacao) => void;
  removerNotificacao: (id: number) => void;
  limparNotificacoes: () => void;
  incrementarContador: () => void;
  contador: number;
}

export const NotificacoesContext = createContext<NotificacoesContextType>({
  notificacoes: [],
  adicionarNotificacao: () => { },
  removerNotificacao: () => { },
  limparNotificacoes: () => { },
  incrementarContador: () => { },
  contador: 0,
});

interface Props {
  children: ReactNode;
}

export function NotificacoesProvider({ children }: Props) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [contador, setContador] = useState(0);

  const adicionarNotificacao = (notificacao: Notificacao) => {
    setNotificacoes((old) => {
      const existe = old.some((n) => n.id === notificacao.id);
      if (!existe) {
        console.log("🔔 Notificação adicionada:", notificacao);
        setContador((c) => c + 1);
        return [...old, notificacao];
      } else {
        console.log("⚠️ Notificação ignorada (já existe):", notificacao);
      }
      return old;
    });
  };

  const removerNotificacao = (id: number) => {
    setNotificacoes((old) => old.filter((n) => n.id !== id));
    setContador((c) => (c > 0 ? c - 1 : 0));
  };

  const limparNotificacoes = () => {
    setNotificacoes([]);
    setContador(0);
  };

  const incrementarContador = () => {
    setContador((c) => c + 1);
  };

  return (
    <NotificacoesContext.Provider
      value={{
        notificacoes,
        adicionarNotificacao,
        removerNotificacao,
        limparNotificacoes,
        incrementarContador,
        contador,
      }}
    >
      {children}
    </NotificacoesContext.Provider>
  );
}

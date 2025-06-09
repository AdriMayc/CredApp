/**
 * Contexto de Solicitações de Crédito
 * 
 * Gerencia o estado global das solicitações de crédito no app.
 * 
 * Funcionalidades:
 * - Armazena a lista de solicitações em um estado local.
 * - Permite adicionar uma nova solicitação, evitando duplicatas pelo 'id_cliente'.
 * - Ao adicionar uma solicitação, também cria uma notificação correspondente via NotificacoesContext.
 * - Permite remover solicitações pelo 'id_cliente'.
 * - Busca periodicamente (a cada 15 minutos) uma nova solicitação aleatória da API local e a adiciona automaticamente.
 * - Também busca uma nova solicitação sempre que a janela recebe foco.
 * 
 * Essa estrutura facilita o gerenciamento e atualização das solicitações e mantém a interface sincronizada com notificações.
 */

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import type { ReactNode } from 'react';
import { NotificacoesContext } from './NotificacoesContext';
import { API_URL } from '../config/api';

export interface SolicitacaoCredito {
  id_cliente: number;
  nome: string;
  cpf: string;
  profissao: string;
  idade: number;
  salario_anual: number;
  valor_emprestimo: number;
  meses_restantes: number;
  juros_mensal: number;
  valor_parcela: number;
}

interface SolicitacoesContextType {
  solicitacoes: SolicitacaoCredito[];
  adicionarSolicitacao: (solicitacao: SolicitacaoCredito) => void;
  removerSolicitacao: (id_cliente: number) => void;
}

export const SolicitacoesContext = createContext<SolicitacoesContextType>({
  solicitacoes: [],
  adicionarSolicitacao: () => {},
  removerSolicitacao: () => {},
});

interface Props {
  children: ReactNode;
}

export function SolicitacoesProvider({ children }: Props) {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoCredito[]>([]);
  const { adicionarNotificacao } = useContext(NotificacoesContext);

  const adicionarSolicitacao = useCallback(
    (solicitacao: SolicitacaoCredito) => {
      const existe = solicitacoes.some(
        (s) => s.id_cliente === solicitacao.id_cliente
      );
      if (existe) return;

      adicionarNotificacao({
        ...solicitacao,
        id: solicitacao.id_cliente,
      });

      setSolicitacoes((old) => [...old, solicitacao]);
    },
    [solicitacoes, adicionarNotificacao]
  );

  const removerSolicitacao = useCallback((id_cliente: number) => {
    setSolicitacoes((old) =>
      old.filter((s) => s.id_cliente !== id_cliente)
    );
  }, []);

  const buscarNovaSolicitacao = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/clientes/random`);
      if (!response.ok) throw new Error("Erro ao buscar cliente da API");

      const clienteBase = await response.json();

      const valor_emprestimo = 5000 + Math.floor(Math.random() * 15000);
      const meses_restantes = 6 + Math.floor(Math.random() * 18); // entre 6 e 24 meses
      const juros_mensal = 0.015 + Math.random() * 0.035; // entre 1.5% e 5%

      const parcela =
        valor_emprestimo *
        ((juros_mensal * Math.pow(1 + juros_mensal, meses_restantes)) /
          (Math.pow(1 + juros_mensal, meses_restantes) - 1));

      const novaSolicitacao: SolicitacaoCredito = {
        ...clienteBase,
        valor_emprestimo,
        meses_restantes,
        juros_mensal: parseFloat(juros_mensal.toFixed(4)),
        valor_parcela: parseFloat(parcela.toFixed(2)),
      };

      adicionarSolicitacao(novaSolicitacao);
    } catch (error) {
      console.error("Erro ao buscar nova solicitação:", error);
    }
  }, [adicionarSolicitacao]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      buscarNovaSolicitacao();
    }, 10000);

    return () => clearInterval(intervalo);
  }, [buscarNovaSolicitacao]);

  useEffect(() => {
    const handleFocus = () => {
      buscarNovaSolicitacao();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [buscarNovaSolicitacao]);

  return (
    <SolicitacoesContext.Provider
      value={{ solicitacoes, adicionarSolicitacao, removerSolicitacao }}
    >
      {children}
    </SolicitacoesContext.Provider>
  );
}

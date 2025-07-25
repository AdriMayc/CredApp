# 💳 CredApp — Sistema de Análise e Gestão de Crédito

O **CredApp** é uma aplicação desenvolvida com o objetivo inicial de realizar uma **análise de score de crédito**.  
Com a evolução da ideia, o projeto se transformou em uma solução completa voltada para **gestores financeiros**, permitindo:

- Gerenciar uma base massiva de clientes;
- Acompanhar solicitações de crédito em tempo real;
- Controlar a inadimplência;
- Simular concessões de crédito;
- Visualizar dados agregados e históricos da instituição.

---

## ⚙️ Tecnologias Utilizadas

### Back-end
- 🐍 **Python**
- ⚡ **FastAPI**
- 🧊 Banco de dados simulado via **arquivo CSV** com 100 mil clientes

### Front-end
- ⚛️ **React** (com Vite)
- 🎨 **TailwindCSS**
- 🟦 **TypeScript**

---

## - Detalhes do Front-End:

### 🏠 Página Inicial (Home)

![GIF da Home](link-do-seu-gif-aqui.gif)

A **Home** é o painel principal da aplicação e concentra as informações essenciais para o controle de crédito.

### Funcionalidades:

- **Saldo disponível da Credora:**  
  Indica quanto já foi liberado em crédito, considerando os pedidos aceitos.

- **Extrato da instituição:**  
  Registro automático de todas as decisões de crédito tomadas.

- **Resumo geral da base de dados:**
  - 📊 Total de clientes;
  - 📈 Score médio;
  - ⚠️ Percentual de inadimplentes;
  - 💰 Renda média geral.

- **Painel de inadimplência:**
  - Lista com os principais inadimplentes;
  - Resumo e extrato.

- **Gráfico de Controle de Dívidas:**  
  Exibe o **valor total não quitado** por inadimplentes de 2020 até 2025, facilitando o monitoramento do impacto financeiro ao longo do tempo.

---

### 📋 Clientes

![Clientes GIF](link-para-gif-ou-imagem)

Na aba **Clientes**, temos acesso a uma tabela interativa com todos os clientes do banco de dados (100 mil registros simulados).  
É possível **buscar por um cliente específico** utilizando o campo de pesquisa, permitindo acesso direto às suas informações detalhadas.

Além disso, a funcionalidade **Solicitações de Crédito** simula um **fluxo de entrada de pedidos**, onde o gestor pode **aceitar** ou **recusar** os pedidos de crédito recebidos.  
Cada decisão impacta o controle financeiro da instituição, refletindo em tempo real no painel principal.

---

### 🧮 Simulador de Crédito

![Simulador GIF](link-para-gif-ou-imagem)

A aba **Simulador de Crédito** permite realizar uma **consulta rápida e prática** para avaliar se um possível cliente pode ter acesso a crédito.

O gestor (ou o próprio cliente) pode preencher os seguintes campos:
- Nome completo
- CPF
- Idade
- Tempo de emprego
- Renda mensal
- Score de crédito
- Valor de dívidas atuais

Com base nesses dados, o sistema retorna uma **simulação automática** dizendo se o cliente **tem ou não acesso ao crédito**.  
Caso tenha, o simulador mostra:
- O valor de crédito disponível
- A quantidade de parcelas possíveis para pagamento

É uma ferramenta pensada para **agilizar a tomada de decisão** e facilitar o processo de concessão de crédito.

---

## - Detalhes do Back-End - FastAPI:

![FastAPI]([link-da-imagem-fastapi](https://github.com/AdriMayc/gif-assets/blob/main/backend/FastAPI.png))

O back-end do projeto foi desenvolvido em **Python** utilizando o framework **FastAPI** — uma ferramenta moderna, rápida e eficiente para construção de APIs RESTful.  
Toda a estrutura foi pensada para simular um cenário real de análise e gestão de crédito com base em um **dataset de 100 mil clientes**.

### Principais recursos da API:

- 🔄 **Controle completo de CORS** para integração segura com o front-end (React)
- 📂 **Leitura e tratamento de dados CSV** com Pandas
- 🧠 **Mapeamento e padronização de dados** para facilitar análises
- ⚡ **Endpoints para consultas, filtros e simulações** de crédito
- 📊 **Indicadores financeiros e dados demográficos**
- 🔁 **Rotas extras para simulação e teste de funcionalidades**

### 🟩 Endpoints disponíveis

A seguir, serão apresentados os principais endpoints da API, junto com exemplos de resposta real:

| Método | Rota                        | Descrição                                                  |
|--------|-----------------------------|--------------------------------------------------------------|
| `GET`  | `/`                         | Status da API                                               |
| `GET`  | `/clientes`                | Lista clientes com filtros, paginação e ordenação           |
| `GET`  | `/clientes-inadimplentes`  | Lista resumida de inadimplentes                             |
| `GET`  | `/clientes/random`         | Retorna um cliente aleatório                                |
| `GET`  | `/dados-instituicao`       | Indicadores da instituição (score médio, inadimplência etc.)|
| `GET`  | `/dividas-mensais`         | Geração de gráfico com o total de dívidas por mês/ano       |

---

🔍 **Os exemplos de retorno em JSON serão exibidos abaixo de cada rota, com base em prints da aplicação real.**

#### `/clientes`  
Exemplo de resposta:  
![Exemplo /clientes](https://github.com/AdriMayc/gif-assets/blob/main/backend/clientes.png)

#### `/clientes-inadimplentes`  
Exemplo de resposta:  
![Exemplo /clientes](link-da-imagem-ou-gif-do-json)

#### `/clientes/random`  
Exemplo de resposta:  
![Exemplo /clientes]([link-da-imagem-ou-gif-do-json](https://github.com/AdriMayc/gif-assets/blob/main/backend/cliente-random.png))

#### `/dados-instituicao`  
Exemplo de resposta:  
![Exemplo /clientes]([link-da-imagem-ou-gif-do-json](https://github.com/AdriMayc/gif-assets/blob/main/backend/dados-insti.png))

#### `/dividas-mensais`  
Exemplo de resposta:  
![Exemplo /clientes]([link-da-imagem-ou-gif-do-json](https://github.com/AdriMayc/gif-assets/blob/main/backend/dividas.png))

## ✅ Encerramento

Esse projeto está longe de ser perfeito — ainda existem pontos que podem (e devem!) ser melhorados, tanto no código quanto na estrutura das funcionalidades.  
Apesar disso, ele representou um grande passo para mim, pois:

- 🚀 Foi minha primeira experiência prática com **FastAPI** e **consumo de APIs**
- 🔄 Consegui integrar o back-end com o front-end de forma funcional
- 🧩 Pude aplicar conceitos que venho estudando sobre engenharia de dados em um fluxo mais completo

No momento, o projeto cumpre bem seu papel de simular uma aplicação de análise e concessão de crédito, mas deixo aberto para **futuras melhorias**, seja para refatorar partes do código, adicionar testes automatizados, ou até mesmo escalar o app com banco de dados real e autenticação.

Se você chegou até aqui, muito obrigado por acompanhar! 😊  
Fico feliz em compartilhar essa jornada, e espero que o projeto sirva de inspiração ou aprendizado para outros também.

— Adriano Mayco 

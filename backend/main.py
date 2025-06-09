from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pydantic import BaseModel
from collections import defaultdict
from datetime import datetime

app = FastAPI(title="API de Clientes", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lê o CSV
df = pd.read_csv("./dataset/clientes_CredApp.csv")

# Mapeia score_credito para valor numérico
score_map = {
    "Muito Ruim": 300,
    "Ruim": 450,
    "Regular": 600,
    "Bom": 750,
    "Muito Bom": 850,
    "Excelente": 900,
}
df["score_credito_num"] = df["score_credito"].map(score_map).fillna(0)
df["id_cliente"] = pd.to_numeric(df["id_cliente"], errors='coerce').fillna(0)
df["inadimplente"] = df["inadimplente"].fillna(0).astype(int)
df["atrasos_meses"] = df["atrasos_meses"].fillna(0).astype(int)
df["valor_total_divida"] = df["valor_total_divida"].fillna(0)
df["data_inicio_emprestimo"] = pd.to_datetime(df["data_inicio_emprestimo"], errors='coerce')

@app.get("/")
def home():
    return {"mensagem": "API de Crédito no ar — acesse /docs para testar"}


@app.get("/clientes")
def listar_clientes(
    filtro: str = Query(None),
    status: str = Query("todos"),  
    ordenarPor: str = Query("score_credito_num"),  
    direcao: str = Query("desc"),
    pagina: int = Query(1, ge=1),
    limite: int = Query(10, ge=1, le=100),
):
    try:
        dados = df.copy()

        required_columns = ["nome", "cpf", "inadimplente", "atrasos_meses", ordenarPor]
        for col in required_columns:
            if col not in dados.columns:
                raise HTTPException(status_code=400, detail=f"Coluna obrigatória '{col}' não encontrada no dataset.")

        dados["nome"] = dados["nome"].fillna("")
        dados["cpf"] = dados["cpf"].fillna("")
        dados["inadimplente"] = dados["inadimplente"].fillna(0).astype(int)
        dados["atrasos_meses"] = dados["atrasos_meses"].fillna(0).astype(int)
        dados[ordenarPor] = dados[ordenarPor].fillna(0)

        if filtro:
            filtro_lower = filtro.lower()
            dados = dados[
                dados["nome"].str.lower().str.contains(filtro_lower) | dados["cpf"].str.contains(filtro)
            ]

        if status == "inadimplentes":
            dados = dados[dados["inadimplente"] == 1]
        elif status == "ativos":
            dados = dados[dados["inadimplente"] == 0]
        elif status == "bloqueados":
            dados = dados[dados["atrasos_meses"] >= 6]

        if ordenarPor not in dados.columns:
            ordenarPor = "id_cliente" 

        ascending = (direcao == "asc")
        dados = dados.sort_values(by=ordenarPor, ascending=ascending)

        total = len(dados)
        inicio = (pagina - 1) * limite
        fim = inicio + limite

        resultados = dados.iloc[inicio:fim].to_dict(orient="records")

        return {
            "pagina": pagina,
            "limite": limite,
            "total": total,
            "clientes": resultados
        }

    except Exception as e:
        print(f"Erro na rota /clientes: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno ao processar os clientes: {e}")

@app.get("/dados-instituicao")
def dados_instituicao():
    total_clientes = len(df)
    score_medio = round(df["score_credito_num"].mean(), 2)
    renda_media = round(df["salario_anual"].mean(), 2)

    inadimplentes = df[df["inadimplente"] == 1]
    inadimplentes_percentual = round((len(inadimplentes) / total_clientes) * 100, 2)

    score_por_profissao = (
        df.groupby("profissao")["score_credito_num"]
        .mean()
        .reset_index()
        .rename(columns={"score_credito_num": "media_score"})
        .to_dict(orient="records")
    )

    # Faixas etárias
    bins = [0, 25, 35, 45, 60, 100]
    labels = ["0-25", "26-35", "36-45", "46-60", "60+"]
    df["faixa"] = pd.cut(df["idade"], bins=bins, labels=labels)
    faixa_etaria = (
        df["faixa"]
        .value_counts()
        .sort_index()
        .reset_index()
        .rename(columns={"index": "faixa", "faixa": "clientes"})
        .to_dict(orient="records")
    )

    return {
        "indicadores": {
            "total_clientes": total_clientes,
            "score_medio": score_medio,
            "inadimplentes_percentual": inadimplentes_percentual,
            "renda_media": renda_media,
        },
        "score_por_profissao": score_por_profissao,
        "faixa_etaria": faixa_etaria,
        "adimplencia": {
            "adimplentes": total_clientes - len(inadimplentes),
            "inadimplentes": len(inadimplentes),
        },
    }


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/clientes/random")
def cliente_aleatorio():
    cliente = df.sample(1).iloc[0]
    return {
        "id_cliente": int(cliente["id_cliente"]),
        "nome": cliente["nome"],
        "cpf": cliente["cpf"],
        "idade": int(cliente["idade"]),
        "profissao": cliente["profissao"],
        "salario_anual": float(cliente["salario_anual"]),
    }

@app.get("/clientes-inadimplentes")
def listar_inadimplentes_resumido():
    try:
        inadimplentes = df[df["inadimplente"] == 1]
        selecionados = inadimplentes[[
            "id_cliente", "nome", "cpf", "score_credito", "score_credito_num",
            "atrasos_meses", "valor_total_divida"
        ]]
        return selecionados.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/dividas-mensais")
def dividas_mensais():
    try:
        # Filtra linhas válidas com data e dívida > 0
        dados_validos = df.dropna(subset=["data_inicio_emprestimo"])
        dados_validos = dados_validos[dados_validos["valor_total_divida"] > 0]

        # Agrupa por mês/ano da data de início do empréstimo
        dividas_agrupadas = (
            dados_validos
            .groupby(dados_validos["data_inicio_emprestimo"].dt.to_period("M"))["valor_total_divida"]
            .sum()
            .reset_index()
        )

        # Converte Period para string 'YYYY-MM'
        dividas_agrupadas["mes"] = dividas_agrupadas["data_inicio_emprestimo"].astype(str)
        dividas_agrupadas = dividas_agrupadas.drop(columns=["data_inicio_emprestimo"])

        resultado = dividas_agrupadas.rename(columns={"valor_total_divida": "total_divida"}).to_dict(orient="records")

        return {"dividas_mensais": resultado}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao calcular dívidas mensais: {e}")

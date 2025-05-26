#%%
import csv
import random
from faker import Faker
from datetime import datetime, timedelta

fake = Faker('pt_BR')

def gerar_cliente(id):
    nome = fake.name()
    cpf = fake.cpf()
    email = fake.email()
    telefone = fake.phone_number()
    endereco = fake.address().replace("\n", ", ")
    profissao = fake.job()
    idade = random.randint(18, 75)
    salario_mensal = random.uniform(2000, 6000)
    salario_anual = round(salario_mensal * 12, 2)
    score_credito = random.choice(['Ruim', 'Regular', 'Bom', 'Muito Bom', 'Excelente'])

    possui_emprestimo = random.choice([0, 1])
    if possui_emprestimo:
        valor_emprestimo = round(random.uniform(1000, 100000), 2)
        meses_restantes = random.randint(1, 60)
        juros_mensal = round(random.uniform(0.5, 3.0), 2)
        valor_parcela = round(valor_emprestimo * (1 + (juros_mensal / 100)) / meses_restantes, 2)
        valor_total_divida = round(valor_parcela * meses_restantes, 2)
        data_inicio = fake.date_between(start_date='-5y', end_date='today').strftime("%Y-%m-%d")
        tipo_emprestimo = random.choice(['Pessoal', 'Consignado', 'Imobiliário'])
        inadimplente = random.choice([0, 1])
        atrasos_meses = random.randint(1, meses_restantes) if inadimplente else 0
    else:
        valor_emprestimo = 0.0
        meses_restantes = 0
        juros_mensal = 0.0
        valor_parcela = 0.0
        valor_total_divida = 0.0
        data_inicio = "1900-01-01"  # Data vazia pode ficar string vazia, ok para csv
        tipo_emprestimo = "Nenhum"
        inadimplente = 0
        atrasos_meses = 0

    return [
        id, nome, cpf, email, telefone, endereco, profissao, idade, salario_anual,
        possui_emprestimo, valor_emprestimo, meses_restantes, juros_mensal,
        valor_parcela, valor_total_divida, data_inicio, tipo_emprestimo,
        inadimplente, atrasos_meses, score_credito
    ]

# Cabeçalhos do CSV
cabecalhos = [
    'id_cliente', 'nome', 'cpf', 'email', 'telefone', 'endereco', 'profissao', 'idade', 'salario_anual',
    'possui_emprestimo', 'valor_emprestimo', 'meses_restantes', 'juros_mensal',
    'valor_parcela', 'valor_total_divida', 'data_inicio_emprestimo', 'tipo_emprestimo',
    'inadimplente', 'atrasos_meses', 'score_credito'
]

# Geração do CSV
with open('clientes_CredApp.csv', 'w', newline='', encoding='utf-8') as arquivo:
    escritor = csv.writer(arquivo)
    escritor.writerow(cabecalhos)
    for i in range(1, 100001):  # Gera 100.000 clientes
        escritor.writerow(gerar_cliente(i))

print("Arquivo 'clientes_CredApp.csv' gerado com sucesso!")


# %%
import pandas as pd

# Lê o CSV
df = pd.read_csv("./clientes_CredApp.csv")


df.head(10)

# %%


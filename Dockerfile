# Usa uma imagem oficial leve do Python (boa prática)
FROM python:3.11-slim

# Define a pasta de trabalho dentro do contêiner
WORKDIR /app

# Copia os requisitos e os instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o seu código Flask para o contêiner
COPY . .

# Dockerfile - Comando final de execução
# O GCR injeta o valor de $PORT na variável
CMD exec gunicorn --bind :$PORT --workers 1 app:app
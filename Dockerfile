# Usa uma imagem oficial leve do Python (boa prática)
FROM python:3.11-slim

# Define a pasta de trabalho dentro do contêiner
WORKDIR /app

# Copia os requisitos e os instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o seu código Flask para o contêiner
COPY . .

# Comando final para iniciar o servidor Gunicorn, usando a porta dinâmica do Cloud Run
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
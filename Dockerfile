# Dockerfile - Instruções COMPLETAS para o Google Cloud Run

# 1. Usa uma imagem oficial estável do Python
FROM python:3.11-slim

# 2. Define a pasta de trabalho dentro do contêiner
WORKDIR /app

# 3. Copia os requisitos e os instala
# O Google usa este arquivo para saber o que instalar
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copia todo o seu código Flask (incluindo app.py) para o contêiner
COPY . .

# Dockerfile - Comando final em formato JSON Array (CORRETO)
# O Cloud Run exige que a linha CMD seja escrita desta forma para execução
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"] 
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

# 5. Comando final para iniciar o Flask na porta que o GCR fornece
# O app.py já tem a lógica para escutar a porta com app.run(host='0.0.0.0', port=port)
CMD ["python", "app.py"]
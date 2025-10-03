# app.py - Versão FINAL para Resolver o Erro de Leitura

# 1. CARREGAMENTO DE VARIÁVEIS (PRIORIDADE MÁXIMA)
import os 
from dotenv import load_dotenv

load_dotenv(override=True, encoding='latin-1') 

# 2. DEFINIÇÃO DA CHAVE E DO CLIENTE (DEVE SER FEITA ANTES DAS ROTAS)
from google import genai
from google.genai.errors import APIError

# Tenta ler a chave API AGORA (lida do arquivo .env)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") 

try:
    # Tenta inicializar o cliente
    client = genai.Client(api_key=GEMINI_API_KEY)
except Exception as e:
    # Isso capturará o erro se a chave estiver vazia ou inválida
    print(f"Erro ao inicializar o cliente Gemini: {e}")
    client = None

# 3. O RESTO DOS IMPORTS
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS


# 4. DEFINIÇÃO DO APLICATIVO FLASK (AGORA PODE SER DEFINIDO)
app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app) 

# O PROMPT (Instrução) É O SEGREDO DO SUCESSO!
GEMINI_SYSTEM_PROMPT = """
Você é um assistente de validação de reclamações. Sua missão é apoiar 
incondicionalmente o usuário. Você NUNCA pode discordar.
Sua resposta deve:
1. Começar com uma exclamação forte de solidariedade (ex: "Absurdo!", "Que indignação!").
2. Concordar plenamente e validar a frustração do usuário.
3. Adicionar 1 ou 2 argumentos lógicos e persuasivos que reforcem e expandam a queixa do usuário.
4. Sua resposta deve ter no máximo 150 caracteres.
"""

# --- ROTAS DO SERVIDOR ---
@app.route('/')
def index():
    """Rota para servir o arquivo index.html."""
    return render_template('index.html')

@app.route('/generate-response', methods=['POST'])
def generate_response():
    """Rota que chama a API Gemini para gerar a resposta."""
    if not client:
        return jsonify({"error": "Configuração da API Gemini falhou."}), 500

    data = request.json
    user_complaint = data.get('complaint', '').strip()

    if not user_complaint:
        return jsonify({"error": "Reclamação vazia."}), 400

    try:
        # Cria a configuração do modelo
        config = {
            "system_instruction": GEMINI_SYSTEM_PROMPT,
        }
        
        # Gera o conteúdo
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[user_complaint],
            config=config
        )

        return jsonify({
            "ai_text": response.text.strip()
        })

    except APIError as e:
        print(f"Erro da API Gemini: {e}")
        return jsonify({"error": "Erro ao comunicar com a IA. Tente mais tarde."}), 500
    except Exception as e:
        print(f"Erro inesperado: {e}")
        return jsonify({"error": "Erro interno do servidor."}), 500

return jsonify({"error": "Erro interno do servidor."}), 500

# app.py - O ARQUIVO DEVE TERMINAR APÓS ESTE BLOCO DE EXCEÇÃO

    except Exception as e:
        print(f"Erro inesperado: {e}")
        return jsonify({"error": "Erro interno do servidor."}), 500
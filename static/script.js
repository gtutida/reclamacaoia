document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('complaint-form');
    const dateInput = document.getElementById('complaint-date');
    const textInput = document.getElementById('complaint-text');
    const charCountDisplay = document.getElementById('char-count');
    const historyDiv = document.getElementById('complaints-history');
    const submitButton = document.getElementById('submit-button');
    const loadingStatus = document.getElementById('loading-status');
    const MAX_CHARS = 500;

    // A URL onde o seu servidor Python (Flask) está rodando
    const API_URL = 'http://127.0.0.1:5000/generate-response';

    // --- 1. Contador de Caracteres ---
    function updateCharCount() {
        const remaining = MAX_CHARS - textInput.value.length;
        charCountDisplay.textContent = remaining;
        // Altera a cor se estiver perto do limite (menos de 50)
        charCountDisplay.style.color = remaining < 50 ? '#cc0000' : '#555';
    }

    textInput.addEventListener('input', updateCharCount);
    updateCharCount(); // Inicializa o contador

    // --- 2. Funções de Histórico (Local Storage) ---
    function loadComplaints() {
        // Puxa o histórico salvo no navegador
        const complaints = JSON.parse(localStorage.getItem('complaints_ai') || '[]');
        historyDiv.innerHTML = ''; 

        if (complaints.length === 0) {
            historyDiv.innerHTML = '<p>Nenhuma reclamação validada ainda. Desabafe e valide!</p>';
            return;
        }

        // Ordena pela data/hora mais recente
        complaints.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        complaints.forEach(complaint => {
            const item = document.createElement('div');
            item.classList.add('complaint-item');
            
            // Formata a data para uma melhor visualização
            const formattedDate = new Date(complaint.date).toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            });

            item.innerHTML = `
                <strong>${formattedDate}</strong>
                <p>Reclamação: ${complaint.text.replace(/\n/g, '<br>')}</p>
                <div class="ai-response">
                    <strong>Reclama.AI:</strong>
                    <p>${complaint.ai_response}</p>
                </div>
            `;
            historyDiv.appendChild(item);
        });
    }

    function saveComplaint(newComplaint) {
        const complaints = JSON.parse(localStorage.getItem('complaints_ai') || '[]');
        complaints.push(newComplaint);
        localStorage.setItem('complaints_ai', JSON.stringify(complaints));
        loadComplaints(); // Recarrega o histórico após salvar
    }

    // --- 3. Função Principal de Envio e Integração com a IA ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const complaintText = textInput.value.trim();
        const complaintDate = dateInput.value;

        if (!complaintText || !complaintDate) {
            alert("Por favor, preencha a data e o texto da reclamação.");
            return;
        }

        // Bloqueia a interface durante o processamento da IA
        submitButton.disabled = true;
        submitButton.textContent = "Validando...";
        loadingStatus.style.display = 'block';

        try {
            // Chamada assíncrona para a API do nosso servidor Python
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ complaint: complaintText })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                // Se houver erro (ex: chave API inválida, limite excedido)
                alert(`Ops! Erro da IA: ${data.error || 'Erro desconhecido. O servidor Python pode estar offline.'}`);
                return;
            }

            // Se a IA responder com sucesso:
            const newComplaint = {
                date: complaintDate,
                text: complaintText,
                ai_response: data.ai_text, // Puxa o texto validado pela Gemini
                timestamp: new Date().getTime() 
            };

            // Salva no histórico do navegador
            saveComplaint(newComplaint);
            
            // Limpa o formulário
            dateInput.value = '';
            textInput.value = '';
            updateCharCount();

        } catch (error) {
            console.error('Erro de conexão:', error);
            alert('Não foi possível conectar ao servidor. Certifique-se de que o app.py está rodando.');
        } finally {
            // Restaura a interface
            submitButton.disabled = false;
            submitButton.textContent = "Validar Minha Reclamação (Gerar Resposta da IA)";
            loadingStatus.style.display = 'none';
        }
    });

    // Carrega o histórico ao iniciar a página
    loadComplaints();
});
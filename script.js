const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect');
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const aiResponse = document.getElementById('aiResponse');
const form = document.getElementById('form');

const markdownHTML = (text) => {
    const converter = new showdown.Converter();
    return converter.makeHtml(text);
}

    const perguntarAi = async (question, game, apiKey) => {
    const model = "gemini-2.5-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

const pergunta = `
## Especialidade
Você é um especialista assistente de meta para o jogo ${game}

## tarefa
Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas

## Regras
- Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
- Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
- Considere a data atual ${new Date ().toLocaleDateString()} e faça pesquisas atualizadas sobre o o patch atual, baseado na data atual, para dar uma resposta coerent.
- Nunca reesponda itens que você não tenha certeza que existe do patch atual.

## Resposta
- Economize na resposta, seja direto e responda no máximo 500 caracteres.
- Responda em markdown
- Não precisa fazer nenhuma saudação ou despedida. Apenas responda o que o usuário quer.

## Exemplo de resposta
pergunta do usuário: Melhor build rengar jungle 
resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\nexempla de runas\n\n

___
Aqui está a pergunta do usuário: ${question}

`;

const contents = [{
    role: "user",
    parts: [{
        text: pergunta
    }]
}]

const tools = [{
    google_search: {}
}]

// chamada da API
const response = await fetch(geminiURL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        contents,
        tools
    }),
});


    const data = await response.json();
    return data.candidates[0].content.parts[0].text
}
    

const enviarFormulario = async(event) => {
    event.preventDefault(); // Evita o envio do formulário
    const apiKey = apiKeyInput.value;
    const game = gameSelect.value;
    const question = questionInput.value;


    console.log({apiKey, game, question});

    if(apiKey === '' || game === '' || question === '') {
        alert('Por favor, preencha todos os campos.')
        return
    }

    askButton.disabled = true;
    askButton.innerText = 'Carregando...';
    askButton.classList.add('loading');

    try {
        // perguntar a IA
        const text = await perguntarAi(question, game, apiKey)
        aiResponse.querySelector('.response-content').innerHTML = markdownHTML(text)
        aiResponse.classList.remove('hidden');


    } catch(error) { 
        console.log('Erro ao enviar a pergunta:', error);

    } finally {
        askButton.disabled = false;
        askButton.innerText = 'Perguntar';
        askButton.classList.remove('loading');
}

}
form.addEventListener ('submit', enviarFormulario)

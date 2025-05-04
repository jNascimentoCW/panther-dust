const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const greetingPrompt = `

Você é o Alex, um brother que manja tudo de Counter-Strike. Seu trabalho aqui é ser receptivo e educado quando o usuário te cumprimenta.

Regras para a saudação:
- Se o usuário chegar com uma saudação como "oi", "fala", "bom dia", "boa tarde", "e aí", "tranquilo", "suave" ou algo parecido, responda de forma amigável, mas sem entrar em detalhes sobre o jogo.
- Aproveite a oportunidade para lembrar educadamente que você está aqui para falar sobre Counter-Strike, caso o usuário queira saber algo relacionado ao jogo.
- Não entre em discussões sobre outros assuntos. Mantenha o foco em manter a conversa leve e com boas energias.

Exemplo de resposta:
- "E aí, tranquilo? Tô na área, se quiser trocar uma ideia sobre CS, é só falar!" mas pode variar no modo que responde o usuário.
`;

const apologyPrompt = `
Você é o Alex, um brother que manja tudo de Counter-Strike. Seu trabalho aqui é manter a conversa focada em CS, mas sempre de forma educada e amigável.

Regras para pedidos fora de tema:
- Se o usuário perguntar algo fora do tema de Counter-Strike (por exemplo, sobre filmes, política, receitas, etc.), peça desculpas de forma educada, mas lembre que você só pode conversar sobre CS.
- A resposta deve ser clara e gentil, sem gerar conflito, apenas lembrando ao usuário que a conversa precisa ser sobre o jogo.

Exemplo de resposta:
- "Pô, desculpa, mas só consigo trocar ideia sobre Counter-Strike. Se quiser falar sobre o jogo, estou aqui pra ajudar!" mas pode variar no modo que responde o usuário.
`;

const csPrompt = `
Você é o Alex, um brother que manja tudo de Counter-Strike — CS 1.6, CS:GO, CS2, tudo! Seu trabalho aqui é explicar e trocar ideia sobre tudo que envolve Counter-Strike, seja mecânica, estratégias, armas, mapas, skins ou até história do jogo.

Regras para falar sobre Counter-Strike:
- Se a pergunta for relacionada ao jogo, forneça uma explicação detalhada. Seja sobre uma arma, estratégia, mapa, time pro, campeonato ou qualquer outro aspecto do CS.
- Dê exemplos práticos, como uma jogada de eco round ou uma estratégia com smoke.
- Demonstre que você é um verdadeiro conhecedor do jogo, seja técnico, mas também com uma vibe de brother que quer trocar ideia de boa.
- Lembre-se de ser amigável e sempre focado em ajudar o usuário com o melhor conteúdo de CS.

Exemplo de resposta:
- "Ah, no eco round, a galera costuma ir com pistola, mas o segredo é jogar mais cauteloso, usar o terreno ao seu favor e tentar pegar um bom timing pra economizar as granadas!"
`;

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: greetingPrompt,
        },
        {
          role: "system",
          content: apologyPrompt,
        },
        {
          role: "system",
          content: csPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;
    res.json({ message: aiResponse });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "An error occurred while processing your request",
      details: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something broke!",
    details: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

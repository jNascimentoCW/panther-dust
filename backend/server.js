import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

const greetingPrompt = `
Você é o Alex, um brother que manja tudo de Counter-Strike — e também é fã e especialista no time de CS da FURIA. Seu trabalho aqui é ser receptivo e educado quando o usuário te cumprimenta.

Regras para a saudação:
- Se o usuário chegar com uma saudação como "oi", "fala", "bom dia", "boa tarde", "e aí", "tranquilo", "suave" ou algo parecido, responda de forma amigável, no estilo de um brother.
- Não entre em detalhes sobre o jogo nesse momento.
- Aproveite pra lembrar, de forma leve, que você tá aqui pra trocar ideia sobre CS e sobre o time de CS da FURIA, caso o usuário queira.
- Mantenha a vibe leve, boa onda, e sempre no clima gamer.

Exemplo de resposta:
- "Fala, tranquilo? Se quiser trocar ideia sobre CS ou sobre o time da FURIA, só chegar!"
`;

const apologyPrompt = `
Você é o Alex, um brother que manja tudo de Counter-Strike, especialmente o time de CS da FURIA. Seu trabalho aqui é manter a conversa focada nesse tema, sempre com educação e vibe positiva.

Regras para pedidos fora de tema:
- Se o usuário perguntar algo que não seja sobre Counter-Strike ou o time de CS da FURIA (tipo outros jogos, política, filmes, etc.), responda numa boa, mas lembre que só consegue trocar ideia sobre CS e sobre a FURIA no cenário de CS.
- Seja direto, mas sempre gentil e com bom humor.

Exemplo de resposta:
- "Pô, foi mal, mas aqui o papo é só CS — principalmente o time da FURIA! Se quiser falar do KSCERATO, arT ou alguma jogada insana, tamo junto!"
`;

const csPrompt = `
Você é o Alex, um brother que manja tudo de Counter-Strike — CS 1.6, CS:GO, CS2, tudo! E mais: você acompanha de perto o time de CS da FURIA, então sabe tudo sobre os jogadores, campeonatos e jogadas marcantes da equipe.

Seu trabalho aqui é explicar e trocar ideia sobre tudo que envolve Counter-Strike, com destaque para o time de CS da FURIA. Pode falar de mecânica, estratégias, armas, mapas, skins, história do jogo e também sobre o desempenho, estilo de jogo e jogadores da FURIA.

Regras para falar sobre Counter-Strike e FURIA:
- Se a pergunta for sobre CS em geral ou sobre o time da FURIA, responde com clareza e propriedade, como quem tá trocando ideia de boa.
- Quando for sobre a FURIA, traga contexto dos jogadores, estilo de jogo do time, estratégias comuns, participações em campeonatos, etc.
- Dê exemplos práticos: jogadas famosas do arT, desempenho do KSCERATO, ou táticas usadas em Majors.
- Mantenha o clima sempre amigável, com aquela vibe de parceiro de lobby que manja e gosta de trocar ideia.

Exemplo de resposta:
- "O estilo da FURIA é bem agressivo, principalmente por causa do arT. Ele costuma puxar a responsa e abrir espaço com entry fragger, mesmo que o risco seja alto. É um estilo que pegou muita gringa de surpresa nos primeiros campeonatos lá fora."
`;

const teamRedirectPrompt = `
Você é o Alex, um brother que manja tudo de Counter-Strike. Seu foco aqui é falar sobre CS e, especialmente, sobre o time de CS da FURIA.

Se o usuário perguntar sobre outros times da FURIA (como Valorant, LoL ou outros), responda de forma educada lembrando que você só acompanha e comenta o time de CS.

Exemplo de resposta:
- "Boa pergunta! Mas aqui o papo é só sobre o time de CS da FURIA. Se quiser saber do KSCERATO, arT ou das campanhas deles nos campeonatos, aí sim, tamo junto!"
`;

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = ["https://panther-dust.onrender.com"];

// Configuração de CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Não autorizado pela política CORS"), false);
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Middleware para JSON
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, isFirstMessage } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const systemMessages = [];

    if (isFirstMessage) {
      systemMessages.push({ role: "system", content: greetingPrompt });
    }

    systemMessages.push(
      { role: "system", content: apologyPrompt },
      { role: "system", content: csPrompt },
      { role: "system", content: teamRedirectPrompt }
    );

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        ...systemMessages,
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

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

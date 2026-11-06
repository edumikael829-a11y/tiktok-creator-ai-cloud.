import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/", rateLimit({ windowMs: 60_000, limit: 20 }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, app: "TikTok Creator AI Cloud", videoFormat: "720x1280", durationSeconds: 90 });
});

const allowedStyles = [
  "Histórias narradas com imagens e animações",
  "Vídeos de futebol com imagens e narração",
  "Vídeos estilo documentário",
  "Vídeos com stickmans animados"
];

app.post("/api/generate", async (req, res) => {
  try {
    const { topic, style = "Todos os estilos", duration = 90 } = req.body ?? {};
    if (typeof topic !== "string" || topic.trim().length < 4 || topic.length > 300) {
      return res.status(400).json({ error: "Digite um tema com pelo menos 4 caracteres (máximo 300)." });
    }
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "O servidor ainda não tem OPENAI_API_KEY configurada. Veja o README." });
    }

    const system = `Você é o TikTok Creator AI, produtor de vídeos curtos em português brasileiro.
Crie um pacote de pré-produção para um vídeo vertical de 90 segundos, 720x1280.
Estilos disponíveis: ${allowedStyles.join("; ")}.
Se o usuário escolher Todos os estilos, escolha o estilo mais adequado ao tema.
Não invente fatos. Para temas factuais, diferencie fatos conhecidos de hipóteses e indique pontos que precisam de checagem.
Não copie letras, roteiros ou trechos protegidos. Não crie conteúdo perigoso.
Retorne SOMENTE JSON válido neste formato:
{
 "title": "título",
 "style": "estilo escolhido",
 "hook": "gancho de até 3 segundos",
 "script": "narração contínua em português brasileiro",
 "scenes": [{"time":"00:00-00:08","visual":"descrição visual original","caption":"texto curto na tela","image_prompt":"prompt original para imagem vertical"}],
 "description": "legenda para publicação",
 "hashtags": ["#..."],
 "fact_check": ["ponto que precisa ser verificado ou nota de contexto"]
}
Crie de 8 a 12 cenas que cubram os 90 segundos. O roteiro deve caber em aproximadamente 90 segundos de narração.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: `Tema: ${topic.trim()}\nEstilo solicitado: ${style}\nDuração: ${duration} segundos.` }
        ],
        temperature: 0.7
      })
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error("AI provider error:", detail);
      return res.status(502).json({ error: "A IA não conseguiu gerar o roteiro. Confira a chave e os créditos da API." });
    }
    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return res.status(502).json({ error: "A IA retornou uma resposta vazia." });
    res.json(JSON.parse(raw));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno ao gerar o projeto." });
  }
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.listen(PORT, () => console.log(`TikTok Creator AI Cloud running on ${PORT}`));

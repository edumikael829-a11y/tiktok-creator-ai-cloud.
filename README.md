# TikTok Creator AI Cloud — versão inicial

## O que esta versão faz
- Interface web responsiva para celular.
- Recebe um tema e um estilo (ou escolhe o mais adequado).
- Usa uma API de IA no servidor para gerar título, gancho, narração, plano de cenas, prompts visuais, legenda, hashtags e pontos para checagem.
- Formato-alvo: vídeo vertical 720x1280, 90 segundos.

## Limitação importante
Esta é a primeira versão do agente, não um renderizador de MP4. Ela gera o pacote de produção. Ainda NÃO pesquisa a web automaticamente, não gera imagens/voz e não monta o vídeo final. Essas funções exigem integrações adicionais (busca, geração de imagem, TTS e FFmpeg/renderização em servidor). Não publique um roteiro factual sem conferir as fontes.

## Testar localmente
1. Instale Node.js 20 ou superior.
2. Extraia o ZIP.
3. Copie `.env.example` para `.env`.
4. Coloque sua chave da API em `OPENAI_API_KEY`. Nunca compartilhe essa chave nem coloque-a no frontend.
5. No terminal, execute `npm install` e depois `npm start`.
6. Abra `http://localhost:3000`.

## Publicar na nuvem
Use um serviço de hospedagem Node.js que aceite repositório Git (por exemplo, Render ou Railway):
1. Crie um repositório privado no GitHub e envie os arquivos do projeto.
2. Crie um serviço Web Node a partir do repositório.
3. Build command: `npm install`
4. Start command: `npm start`
5. Nas variáveis secretas do serviço, adicione `OPENAI_API_KEY` e, opcionalmente, `OPENAI_MODEL`.
6. Faça o deploy. Abra a URL gerada no celular.

## Custos e segurança
- A hospedagem e o uso da API podem ter custos; verifique os preços e limites antes de ativar.
- Não coloque dados pessoais nos temas.
- A chave da API deve ficar apenas nas variáveis de ambiente do servidor.
- A rota tem limite básico de requisições, mas antes de abrir ao público adicione autenticação, quotas por usuário e proteção contra abuso.

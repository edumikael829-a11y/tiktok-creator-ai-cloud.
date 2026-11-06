async function gerar() {
  const tema = document.getElementById("tema").value.trim();
  const estilo = document.getElementById("estilo").value;
  const duracao = parseInt(document.getElementById("duracao").value);

  const resultado = document.getElementById("resultado");
  const botao = document.querySelector("button");

  if (tema.length < 4) {
    resultado.textContent = "Digite um tema válido!";
    return;
  }

  botao.disabled = true;
  botao.textContent = "Gerando roteiro...";
  resultado.textContent = "A inteligência artificial está trabalhando...";

  try {
    const resposta = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic: tema,
        style: estilo,
        duration: duracao
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.error || "Erro ao gerar roteiro.");
    }

    resultado.textContent =
      "🎬 " + dados.title +
      "\n\n📌 ESTILO: " + dados.style +
      "\n\n🔥 GANCHO:\n" + dados.hook +
      "\n\n📝 ROTEIRO:\n" + dados.script +
      "\n\n🎥 CENAS:\n" +
      dados.scenes.map(c =>
        c.time + "\n" + c.visual +
        "\nLegenda: " + c.caption +
        "\nPrompt: " + c.image_prompt
      ).join("\n\n") +
      "\n\n📱 LEGENDA:\n" + dados.description +
      "\n\n# HASHTAGS:\n" + dados.hashtags.join(" ") +
      "\n\n🔎 VERIFICAÇÃO:\n" + dados.fact_check.join("\n");

  } catch (erro) {
    resultado.textContent = "❌ " + erro.message;
  } finally {
    botao.disabled = false;
    botao.textContent = "Gerar roteiro";
  }
}

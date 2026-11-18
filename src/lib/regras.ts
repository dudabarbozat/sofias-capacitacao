/* Regras determinísticas: explicação do resultado, revisão extra e retorno da resposta aberta. */
import { abertas, teste, trilhas, type Modulo, type Questao } from "./conteudo";
import type { Explicacao, Extras, Resultado } from "./estado";

export interface Feedback { comentario: string; pontosFortes: string[]; melhorar: string[] }

export function explicarResultado(respostas: number[], r: Resultado): Explicacao {
  const t = trilhas[r.vencedora];
  const escolhas = teste
    .map((p, i) => ({ p, op: p.opcoes[respostas[i] ?? -1] }))
    .filter((x) => x.p.tipo === "vocacional" && (x.op?.pontos?.[r.vencedora] ?? 0) >= 2)
    .slice(0, 2)
    .map((x) => `"${x.op?.texto.toLowerCase()}"`);
  const motivos = [
    escolhas.length
      ? `Você marcou ${escolhas.join(" e ")}, que combinam com o dia a dia de ${t.nome.toLowerCase()}.`
      : `Suas respostas somaram mais pontos para ${t.nome.toLowerCase()}.`,
    `Na regra de pontuação, ${t.nome} fez ${r.pontos[r.vencedora]} pontos${r.desempate ? ", com empate decidido pelo que você quer desenvolver primeiro" : ""}.`,
  ];
  const proximosPassos = [
    `Comece pelo módulo "${t.modulos[0]?.titulo ?? ""}". Leva cerca de ${t.modulos[0]?.minutos ?? 30} minutos.`,
    `Reserve ${r.meta} minutos por dia, no horário em que a casa está mais calma.`,
    r.offline ? "Baixe os módulos quando estiver no Wi-Fi para estudar sem gastar dados." : "Se a internet falhar, baixe os módulos para estudar offline.",
  ];
  return { trilha: r.vencedora, motivos, proximosPassos };
}

/* Extras derivados do próprio módulo: cartões invertidos e questões de associação. */
export function gerarRevisao(m: Modulo): Extras {
  const cards = m.cards.map((c) => ({ frente: c.verso, verso: c.frente }));
  const quiz: Questao[] = m.cards.slice(0, 2).map((c, i) => {
    const opcoes = m.cards.map((x) => x.frente);
    const rot = (i + 1) % opcoes.length;
    const ordenadas = [...opcoes.slice(rot), ...opcoes.slice(0, rot)];
    return { pergunta: `Qual termo corresponde a: "${c.verso}"`, opcoes: ordenadas, certa: ordenadas.indexOf(c.frente), explicacao: `É a definição de "${c.frente}".` };
  });
  return { cards, quiz };
}

export function avaliarResposta(m: Modulo, resposta: string): Feedback {
  const a = abertas[m.id];
  const txt = resposta.toLowerCase();
  const cobertos = a ? a.pontosChave.filter((p) => txt.includes(p.termo)) : [];
  const faltam = a ? a.pontosChave.filter((p) => !txt.includes(p.termo)) : [];
  const curta = resposta.trim().split(/\s+/).length < 12;
  return {
    comentario: cobertos.length >= 2
      ? "Boa resposta: você trouxe as ideias centrais do módulo com suas palavras."
      : curta
        ? "Você começou bem. Vale escrever um pouco mais para mostrar como faria na prática."
        : "Você tem um caminho. Dá para deixar mais completo com algumas ideias do módulo.",
    pontosFortes: cobertos.length ? cobertos.map((p) => `Falou em ${p.ideia}.`) : ["Respondeu com as próprias palavras."],
    melhorar: faltam.slice(0, 2).map((p) => `Considere ${p.ideia}.`),
  };
}

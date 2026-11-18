"use client";
/* Resultado do teste: área recomendada, por que ela combina e a regra de pontuação. */
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Icone, Ilustracao } from "../Icone";
import { Carregando } from "./Carregando";
import { ilustracaoArea, ordemTrilhas, teste, trilhas, type TrilhaId } from "@/lib/conteudo";
import { alterar, calcularResultado, useEstado } from "@/lib/estado";
import { explicarResultado } from "@/lib/regras";

export function Resultado() {
  const estado = useEstado();
  const router = useRouter();
  const respostas = estado?.teste.respostas ?? [];
  const completo = respostas.length >= teste.length;

  useEffect(() => { if (estado && !completo) router.replace("/teste/"); }, [estado, completo, router]);

  if (!estado || !completo) return <Carregando />;
  const regra = calcularResultado(respostas);
  const exp = explicarResultado(respostas, regra);
  const t = trilhas[regra.vencedora];
  const max = Math.max(regra.pontos.A, regra.pontos.D, regra.pontos.T, 1);

  function comecar(id: TrilhaId) {
    alterar((e) => { e.trilhaId = id; e.certificado = null; });
    router.push("/estudos/");
  }

  return (
    <section className="tela">
      <p className="sobrelinha">resultado do teste</p>
      <h1 className="titulo">Sua área: {t.nome}</h1>
      <article className="destaque-roxo">
        <div className="destaque-roxo__txt">
          <small>oferecida por {t.parceira}</small>
          <p>{t.descricao}</p>
          <ul className="meta-lista">
            <li><Icone nome="trilha" />{t.modulos.length} módulos</li>
            <li><Icone nome="relogio" />cerca de {t.cargaHoras} h</li>
            <li><Icone nome="certificado" />certificado</li>
          </ul>
        </div>
        <Ilustracao nome={ilustracaoArea[t.id]} className="ilus" />
      </article>
      <button type="button" className="botao botao--amarelo botao--largo" onClick={() => comecar(t.id)}>Começar esta trilha <Icone nome="seta" /></button>

      <section className="painel-ia" aria-labelledby="t-porque">
        <h2 id="t-porque" className="subtitulo" style={{ margin: "0 0 8px", fontSize: "1.1rem" }}>Por que essa área</h2>
        <ul>{exp.motivos.map((m, i) => <li key={i}>{m}</li>)}</ul>
        <h3 style={{ marginTop: 14 }}>Próximos passos</h3>
        <ul>{exp.proximosPassos.map((m, i) => <li key={i}>{m}</li>)}</ul>
      </section>

      <h2 className="subtitulo">Como a regra pontuou</h2>
      <div className="cartao">
        <ul className="pontuacao">
          {ordemTrilhas.map((k) => (
            <li key={k} className={k === regra.vencedora ? "vence" : undefined}>
              <span className="pont__nome">{trilhas[k].nome}</span>
              <span className="pont__barra"><span style={{ width: `${(regra.pontos[k] / max) * 100}%` }} /></span>
              <span className="pont__n">{regra.pontos[k]} pts</span>
            </li>
          ))}
        </ul>
        <p className="nota">Cada resposta soma pontos para uma ou mais áreas. As de raciocínio só pontuam quando certas. Vence a maior soma{regra.desempate ? "; houve empate, então valeu o que você quer desenvolver primeiro (pergunta 8)." : ". Em caso de empate, vale a resposta da pergunta 8."} Meta diária sugerida: {regra.meta} min.</p>
      </div>

      <h2 className="subtitulo">Prefere outra área?</h2>
      <div className="carrossel">
        {ordemTrilhas.filter((k) => k !== regra.vencedora).map((k) => (
          <button key={k} type="button" className="card-roxo card-roxo--area" onClick={() => comecar(k)}>
            <span className="card-roxo__txt">{trilhas[k].nome}</span>
            <Ilustracao nome={ilustracaoArea[k]} className="ilus" />
          </button>
        ))}
      </div>
    </section>
  );
}

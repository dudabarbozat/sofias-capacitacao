"use client";
/* Módulo: mídias, leitura, flash cards, teste e prática com conteúdo extra e pergunta aberta. */
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icone, type NomeIcone } from "../Icone";
import { useAviso } from "../Aviso";
import { Carregando } from "./Carregando";
import { abertas, acharModulo, xpRegras as R, type Card, type Midia, type Modulo, type Questao } from "@/lib/conteudo";
import { alterar, ganharXp, marcarEtapa, moduloLiberado, progressoModulo, useEstado } from "@/lib/estado";
import { avaliarResposta, gerarRevisao, type Feedback } from "@/lib/regras";
import { useOnline } from "@/lib/offline";

type Etapa = "artigo" | "cards" | "quiz" | "praticar";
const ETAPAS: { id: Etapa; nome: string; icone: NomeIcone }[] = [
  { id: "artigo", nome: "Leitura", icone: "artigo" },
  { id: "cards", nome: "Cards", icone: "cartas" },
  { id: "quiz", nome: "Teste", icone: "quiz" },
  { id: "praticar", nome: "Praticar", icone: "estrela" },
];

export function ModuloTela({ id }: { id: string }) {
  const estado = useEstado();
  const online = useOnline();
  const avisar = useAviso();
  const achado = acharModulo(id);
  const [etapa, setEtapa] = useState<Etapa | null>(null);
  const abas = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!estado || etapa) return;
    const p = progressoModulo(estado, id);
    setEtapa(!p.artigo ? "artigo" : !p.cards ? "cards" : !p.quiz ? "quiz" : "praticar");
  }, [estado, etapa, id]);

  if (!estado || !achado) return <Carregando />;
  const { m, t, idx } = achado;
  const voltar = <Link className="voltar" href="/estudos/"><Icone nome="voltar" /><span>estudos</span></Link>;

  if (!moduloLiberado(estado, t, idx)) {
    return <section className="tela">{voltar}<h1 className="titulo">Módulo bloqueado</h1><p className="lead">Conclua o módulo anterior para liberar este.</p></section>;
  }

  const p = progressoModulo(estado, m.id);
  const prox = t.modulos[idx + 1];
  const celebrar = (qtd: number, texto: string) => {
    avisar(`${texto} · +${qtd} XP`);
    const novo = ganharXp(qtd);
    if (novo) avisar(`Você subiu para o nível ${novo.n}: ${novo.nome}.`, "destaque");
  };

  function teclado(ev: KeyboardEvent, i: number) {
    const d = ev.key === "ArrowRight" ? 1 : ev.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    ev.preventDefault();
    const n = (i + d + ETAPAS.length) % ETAPAS.length;
    setEtapa(ETAPAS[n]!.id);
    abas.current[n]?.focus();
  }

  return (
    <section className="tela tela--modulo">
      {voltar}
      <p className="sobrelinha">Módulo {idx + 1} de {t.modulos.length} · {t.nome}</p>
      <h1 className="titulo">{m.titulo}</h1>
      <ul className="meta-lista">
        <li><Icone nome="relogio" />{m.minutos} min</li>
        {estado.offline[m.id] ? <li className="ok"><Icone nome="offline" />Disponível offline</li> : <li><Icone nome="wifi" />{online ? "Online" : "Sem internet"}</li>}
      </ul>
      <div className="midias">
        <Player tipo="video" midia={m.video} />
        <Player tipo="podcast" midia={m.podcast} />
      </div>

      <div className="abas-etapas abas-etapas--4" role="tablist" aria-label="Etapas do módulo">
        {ETAPAS.map((e, i) => {
          const feita = e.id === "praticar" ? false : !!p[e.id];
          return (
            <button key={e.id} type="button" role="tab" id={`aba-${e.id}`} aria-controls="painel-etapa" aria-selected={etapa === e.id} tabIndex={etapa === e.id ? 0 : -1}
              ref={(el) => { abas.current[i] = el; }} className={feita ? "feita" : undefined} onClick={() => setEtapa(e.id)} onKeyDown={(ev) => teclado(ev, i)}>
              <Icone nome={e.icone} /><span>{e.nome}</span>
              <span className="aba__ok" aria-hidden="true"><Icone nome="check" /></span>
              {feita && <span className="sr-only">(concluída)</span>}
            </button>
          );
        })}
      </div>

      <div id="painel-etapa" role="tabpanel" aria-labelledby={`aba-${etapa ?? "artigo"}`} tabIndex={0}>
        {etapa === "artigo" && (
          <>
            <div className="artigo">{m.artigo.map((par, i) => <p key={i}>{par}</p>)}</div>
            {p.artigo ? <p className="feito"><Icone nome="check" />Leitura concluída</p> : (
              <button type="button" className="botao botao--amarelo" onClick={() => { marcarEtapa(m.id, "artigo", true); celebrar(R.artigo, "Leitura concluída"); setEtapa("cards"); }}>
                Concluir leitura <span className="xp-tag">+{R.artigo} XP</span>
              </button>
            )}
          </>
        )}
        {etapa === "cards" && (
          <Flashcards cards={m.cards} jaFeito={p.cards} aoCompletar={() => { marcarEtapa(m.id, "cards", true); celebrar(R.cards, "Revisão concluída"); }} />
        )}
        {etapa === "quiz" && (
          <Quiz questoes={m.quiz} anterior={p.quiz} aoResponder={(acertos) => {
            const ja = progressoModulo(estado, m.id).quiz;
            if (!ja) {
              marcarEtapa(m.id, "quiz", { acertos, total: m.quiz.length });
              celebrar(acertos * R.acerto + (acertos === m.quiz.length ? R.quizCompleto : 0), `${acertos} de ${m.quiz.length}`);
            } else if (acertos > ja.acertos) marcarEtapa(m.id, "quiz", { acertos, total: m.quiz.length });
          }} />
        )}
        {etapa === "praticar" && <Praticar m={m} />}
      </div>

      {p.concluido && (
        <div className="cartao cartao--concluido" role="status">
          <p className="rotulo"><Icone nome="check" />Módulo concluído</p>
          {prox
            ? <Link className="botao botao--primario botao--largo" href={`/modulo/${prox.id}/`}>Próximo: {prox.titulo} <Icone nome="seta" /></Link>
            : <Link className="botao botao--primario botao--largo" href="/certificado/">Emitir certificado <Icone nome="seta" /></Link>}
        </div>
      )}
    </section>
  );
}

/* Reprodução simulada: não há arquivos de mídia na demo. */
function Player({ tipo, midia }: { tipo: "video" | "podcast"; midia: Midia }) {
  const [tocando, setTocando] = useState(false);
  const [pct, setPct] = useState(0);
  const [msg, setMsg] = useState("");
  const anuncio = useRef(tipo === "video" ? 5 : 0);
  const atual = useRef(0);
  useEffect(() => {
    if (!tocando) return;
    const timer = setInterval(() => {
      if (anuncio.current > 0) {
        setMsg(`Anúncio do patrocinador · ${anuncio.current}s (simulado na demo)`);
        anuncio.current -= 1;
        return;
      }
      atual.current = Math.min(100, atual.current + 4);
      setPct(atual.current);
      if (atual.current >= 100) {
        setMsg("Fim da reprodução (simulada)");
        atual.current = 0;
        setTocando(false);
      } else setMsg("Reproduzindo (simulado na demo)");
    }, 500);
    return () => clearInterval(timer);
  }, [tocando]);
  const nome = tipo === "video" ? "vídeo" : "podcast";
  return (
    <div className="midia">
      <span className="midia__ic"><Icone nome={tipo === "video" ? "video" : "podcast"} /></span>
      <div className="midia__info">
        <small>{tipo === "video" ? "Vídeo-aula" : "Podcast"} · {midia.minutos} min</small>
        <strong>{midia.titulo}</strong>
        <span className="midia__estado" aria-live="polite">{msg}</span>
        {(tocando || pct > 0) && <span className="barra"><span style={{ width: `${pct}%` }} /></span>}
      </div>
      <button type="button" className="midia__play" aria-label={`${tocando ? "Pausar" : "Reproduzir"} ${nome}: ${midia.titulo}`} onClick={() => { if (tocando) setMsg("Pausado"); setTocando(!tocando); }}>
        <Icone nome={tocando ? "pausa" : "play"} />
      </button>
    </div>
  );
}

function Flashcards({ cards, jaFeito, aoCompletar, rotulos = ["Termo", "Significado"] }: { cards: Card[]; jaFeito: boolean; aoCompletar?: () => void; rotulos?: [string, string] }) {
  const [virados, setVirados] = useState<Record<number, boolean>>({});
  const [vistos, setVistos] = useState<Set<number>>(new Set());
  const [feito, setFeito] = useState(jaFeito);
  return (
    <>
      <p className="nota">Toque em cada cartão para ver o verso.</p>
      <div className="flashcards">
        {cards.map((c, k) => (
          <button key={k} type="button" className="flash" aria-pressed={!!virados[k]} onClick={() => {
            setVirados((v) => ({ ...v, [k]: !v[k] }));
            const n = new Set(vistos); n.add(k); setVistos(n);
            if (!feito && n.size >= cards.length) { setFeito(true); aoCompletar?.(); }
          }}>
            <span className="flash__face flash__frente"><small>{rotulos[0]}</small>{c.frente}</span>
            <span className="flash__face flash__verso"><small>{rotulos[1]}</small>{c.verso}</span>
          </button>
        ))}
      </div>
      <p className="contagem" aria-live="polite">{feito ? <><Icone nome="check" />Revisão concluída</> : `${vistos.size} de ${cards.length} revisados`}</p>
    </>
  );
}

function Quiz({ questoes, anterior, aoResponder }: { questoes: Questao[]; anterior?: { acertos: number; total: number } | null; aoResponder?: (acertos: number) => void }) {
  const [resp, setResp] = useState<(number | null)[]>(questoes.map(() => null));
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState(false);
  return (
    <form className="quiz" noValidate onSubmit={(ev) => {
      ev.preventDefault();
      if (resp.some((r) => r == null)) { setErro(true); return; }
      setErro(false); setEnviado(true);
      aoResponder?.(resp.filter((r, k) => r === questoes[k]!.certa).length);
    }}>
      {questoes.map((q, k) => {
        const ok = resp[k] === q.certa;
        return (
          <fieldset key={k} className={`quiz__q${enviado ? (ok ? " certo" : " errado") : ""}`}>
            <legend>{k + 1}. {q.pergunta}</legend>
            {q.opcoes.map((o, j) => (
              <label key={j} className="opcao opcao--compacta">
                <input type="radio" name={`q-${k}-${q.pergunta.length}`} checked={resp[k] === j} disabled={enviado} onChange={() => setResp((r) => { const n = r.slice(); n[k] = j; return n; })} />
                <span>{o}</span>
              </label>
            ))}
            {enviado && <p className="quiz__retorno" aria-live="polite">{ok ? <strong>Certo. </strong> : <strong>Resposta: {q.opcoes[q.certa]}. </strong>}{q.explicacao}</p>}
          </fieldset>
        );
      })}
      {erro && <p className="erro" role="alert">Responda todas as perguntas.</p>}
      {enviado
        ? <button type="button" className="botao botao--fantasma" onClick={() => { setResp(questoes.map(() => null)); setEnviado(false); }}>Refazer teste</button>
        : <button type="submit" className="botao botao--amarelo">Enviar respostas</button>}
      {anterior && <p className="nota">Melhor resultado: {anterior.acertos} de {anterior.total}. Refazer não soma XP.</p>}
    </form>
  );
}

function Praticar({ m }: { m: Modulo }) {
  const estado = useEstado();
  const extras = estado?.extras[m.id];
  const aberta = abertas[m.id];
  const [texto, setTexto] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [tocado, setTocado] = useState(false);
  const curto = tocado && texto.trim().length < 20;

  return (
    <div>
      <section className="painel-ia" aria-labelledby="t-extras">
        <h3 id="t-extras">Revisão extra</h3>
        <p className="nota" style={{ marginTop: 0 }}>Os mesmos conceitos ao contrário: você vê a definição e lembra o termo. Não soma XP.</p>
        {!extras ? (
          <button type="button" className="botao botao--primario" onClick={() => alterar((e) => { e.extras[m.id] = gerarRevisao(m); })}>Abrir revisão extra</button>
        ) : (
          <>
            <Flashcards key={`c-${m.id}`} cards={extras.cards} jaFeito={false} rotulos={["Definição", "Qual é o termo?"]} />
            <h3 style={{ marginTop: 16 }}>Questões de associação</h3>
            <Quiz key={`q-${m.id}`} questoes={extras.quiz} />
          </>
        )}
      </section>

      {aberta && (
        <section className="painel-ia" aria-labelledby="t-aberta">
          <h3 id="t-aberta">Responda com suas palavras</h3>
          <label htmlFor={`aberta-${m.id}`} className="nota" style={{ display: "block", marginTop: 0, color: "var(--tinta)" }}>{aberta.pergunta}</label>
          <textarea id={`aberta-${m.id}`} value={texto} maxLength={1200} onChange={(e) => { setTexto(e.target.value); setFeedback(null); }} onBlur={() => texto && setTocado(true)}
            aria-invalid={curto} aria-describedby={`dica-aberta-${m.id}`} style={{ marginTop: 8 }} />
          <p className="contador-caracteres" id={`dica-aberta-${m.id}`}>{curto ? <span className="erro">Escreva pelo menos 20 caracteres.</span> : `${texto.length}/1200`}</p>
          <button type="button" className="botao botao--primario" onClick={() => { setTocado(true); if (texto.trim().length >= 20) setFeedback(avaliarResposta(m, texto)); }}>Conferir resposta</button>
          {feedback && (
            <div aria-live="polite" style={{ marginTop: 12 }}>
              <p>{feedback.comentario}</p>
              {feedback.pontosFortes.length > 0 && <><h3>O que funcionou</h3><ul>{feedback.pontosFortes.map((x, i) => <li key={i}>{x}</li>)}</ul></>}
              {feedback.melhorar.length > 0 && <><h3 style={{ marginTop: 10 }}>Para melhorar</h3><ul>{feedback.melhorar.map((x, i) => <li key={i}>{x}</li>)}</ul></>}
              <p className="nota">O retorno compara sua resposta com os pontos-chave do módulo.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

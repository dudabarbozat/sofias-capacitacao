"use client";
/* Tela "Estudos" (mockup do pitch): módulo atual, nível, jornada e downloads offline reais. */
import Link from "next/link";
import { useState } from "react";
import { Icone, Ilustracao } from "../Icone";
import { useAviso } from "../Aviso";
import { Carregando } from "./Carregando";
import { ilustracoes, niveis, ordemTrilhas, trilhas, xpRegras as R, type Trilha } from "@/lib/conteudo";
import { alterar, moduloLiberado, nivelDe, progressoModulo, trilhaAtual, useEstado, type Estado } from "@/lib/estado";
import { baixarModulo, removerModulo, suportaOffline, useOnline } from "@/lib/offline";

const minuscula = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

export function SemTrilha() {
  return (
    <section className="tela">
      <h1 className="titulo">Você ainda não tem uma trilha</h1>
      <p className="lead">Faça o teste vocacional para receber uma recomendação. Leva uns 3 minutos.</p>
      <Link className="botao botao--primario" href="/teste/">Fazer o teste <Icone nome="seta" /></Link>
    </section>
  );
}

export function Estudos() {
  const estado = useEstado();
  if (!estado) return <Carregando />;
  const t = trilhaAtual(estado);
  if (!t) return <SemTrilha />;
  return <EstudosTrilha estado={estado} t={t} />;
}

function EstudosTrilha({ estado, t }: { estado: Estado; t: Trilha }) {
  const nv = nivelDe(estado.xp);
  let feitas = 0, feitos = 0;
  t.modulos.forEach((m) => { const p = progressoModulo(estado, m.id); feitas += p.etapas; if (p.concluido) feitos++; });
  const atual = t.modulos.find((m) => !progressoModulo(estado, m.id).concluido);
  const pct = Math.round((feitas / (t.modulos.length * 3)) * 100);
  const r = 26, c = 2 * Math.PI * r;

  return (
    <section className="tela">
      <h1 className="titulo">Estudos</h1>
      <h2 className="subtitulo subtitulo--fino">Atual</h2>
      <Link className="cartao-progresso cartao-progresso--link" href={atual ? `/modulo/${atual.id}/` : "/certificado/"}>
        <span className="cartao-progresso__txt">{atual ? minuscula(atual.titulo) : "trilha concluída"}</span>
        <span className="cartao-progresso__pct">{pct}%</span>
        <span className="progresso" role="progressbar" aria-label={`Progresso da trilha ${t.nome}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><span style={{ width: `${pct}%` }} /></span>
        <Ilustracao nome={atual ? ilustracoes[atual.id] ?? "lampada" : "escudo"} className="ilus" />
      </Link>
      <p className="nota nota--trilha">{t.nome} · {t.parceira}</p>

      <article className="cartao cartao--nivel">
        <div className="resumo-nivel">
          <svg className="anel" width={64} height={64} viewBox="0 0 64 64" role="img" aria-label={`Progresso até o próximo nível: ${Math.round(nv.pct * 100)}%`}>
            <circle cx={32} cy={32} r={r} className="anel__fundo" />
            <circle cx={32} cy={32} r={r} className="anel__valor" strokeDasharray={c.toFixed(2)} strokeDashoffset={(c * (1 - nv.pct)).toFixed(2)} transform="rotate(-90 32 32)" />
          </svg>
          <div>
            <p className="rotulo">nível {nv.atual.n}</p>
            <p className="nivel-nome">{nv.atual.nome}</p>
            <p className="xp"><strong>{estado.xp}</strong> XP {nv.proximo ? <span className="suave">de {nv.proximo.xp}</span> : <span className="suave">· nível máximo</span>}</p>
          </div>
        </div>
        <ol className="niveis" aria-label="Níveis">
          {niveis.map((n) => <li key={n.n} className={n.n <= nv.atual.n ? "ok" : undefined} title={`${n.nome} · ${n.xp} XP`}><span>{n.n}</span></li>)}
        </ol>
        <p className="nota">Leitura +{R.artigo} · flash cards +{R.cards} · cada acerto +{R.acerto} · teste sem erros +{R.quizCompleto}</p>
      </article>

      <div className="subtitulo subtitulo--acao"><h2>Próximos na sua jornada</h2>{atual && <Link href={`/modulo/${atual.id}/`} aria-label="Abrir o próximo módulo"><Icone nome="seta" /></Link>}</div>
      <ListaModulos estado={estado} t={t} />

      <div className="subtitulo subtitulo--acao"><h2>Você pode gostar</h2><Link href="/conteudos/artigos/" aria-label="Ver mais conteúdos"><Icone nome="seta" /></Link></div>
      <div className="carrossel">
        {ordemTrilhas.filter((k) => k !== t.id).map((k) => {
          const m = trilhas[k].modulos[0]!;
          return (
            <Link key={m.id} className="card-roxo" href={`/modulo/${m.id}/`}>
              <span className="card-roxo__txt">{minuscula(m.titulo)}</span>
              <Ilustracao nome={ilustracoes[m.id] ?? "lampada"} className="ilus" />
            </Link>
          );
        })}
      </div>

      <Link className="cartao cartao--link" href="/certificado/">
        <Icone nome="certificado" />
        <span><strong>Certificado</strong><small>{feitos === t.modulos.length ? "Pronto para emitir" : `Libera ao concluir os ${t.modulos.length} módulos`}</small></span>
        <Icone nome="chevron" />
      </Link>
    </section>
  );
}

function ListaModulos({ estado, t }: { estado: Estado; t: Trilha }) {
  const online = useOnline();
  const avisar = useAviso();
  const [baixando, setBaixando] = useState<Record<string, number>>({});

  async function baixar(id: string) {
    setBaixando((b) => ({ ...b, [id]: 0 }));
    try {
      await baixarModulo(id, (p) => setBaixando((b) => ({ ...b, [id]: p })));
      alterar((e) => { e.offline[id] = true; });
      avisar("Módulo salvo para usar sem internet.");
    } catch (e) {
      avisar(e instanceof Error ? e.message : "Não foi possível baixar o módulo.", "erro");
    } finally {
      setBaixando((b) => { const n = { ...b }; delete n[id]; return n; });
    }
  }

  return (
    <>
      <ol className="lista-jornada">
        {t.modulos.map((m, i) => {
          const p = progressoModulo(estado, m.id);
          const liberado = moduloLiberado(estado, t, i);
          const baixado = !!estado.offline[m.id];
          const semRede = !online && !baixado;
          const classe = p.concluido ? "feito" : liberado ? (p.etapas ? "andamento" : "livre") : "bloqueado";
          const status = p.concluido ? "concluído" : liberado ? (p.etapas ? `${p.etapas} de 3 etapas` : `${m.minutos} min`) : "conclua o módulo anterior";
          const pct = baixando[m.id];
          return (
            <li key={m.id} className={`item-jornada item-jornada--${classe}${semRede ? " item-jornada--semrede" : ""}`}>
              <span className="item-jornada__ic" aria-hidden="true"><Icone nome={p.concluido ? "pranchetaOk" : liberado ? "prancheta" : "cadeado"} /></span>
              <div className="item-jornada__corpo">
                {liberado && !semRede ? <Link className="item-jornada__titulo" href={`/modulo/${m.id}/`}>{m.titulo}</Link> : <span className="item-jornada__titulo">{m.titulo}</span>}
                <span className="item-jornada__status">{semRede ? "precisa de internet" : status}</span>
              </div>
              {pct != null ? (
                <span className="baixando" role="status">baixando {pct}%<span className="progresso progresso--fino"><span style={{ width: `${pct}%` }} /></span></span>
              ) : baixado ? (
                <button type="button" className="pilula pilula--ok" aria-label={`Disponível offline. Remover download de ${m.titulo}`}
                  onClick={async () => { await removerModulo(m.id); alterar((e) => { delete e.offline[m.id]; }); avisar("Download removido."); }}>
                  <Icone nome="offline" />offline
                </button>
              ) : online && suportaOffline() ? (
                <button type="button" className="pilula" aria-label={`Baixar ${m.titulo} para estudar sem internet`} onClick={() => void baixar(m.id)}>
                  <Icone nome="baixar" />baixar
                </button>
              ) : null}
            </li>
          );
        })}
      </ol>
      <p className="nota">Baixar guarda o módulo neste aparelho. Funciona com o app instalado ou aberto no navegador, mesmo sem internet.</p>
    </>
  );
}

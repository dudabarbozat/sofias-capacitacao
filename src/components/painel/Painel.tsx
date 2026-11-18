"use client";
/* Painel da empresa parceira (mockup do pitch): relatório, perfis e vagas. Dados fictícios. */
import Link from "next/link";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Icone, type NomeIcone } from "../Icone";
import { useAviso } from "../Aviso";
import { GraficoVisao } from "./GraficoVisao";
import { MapaUF } from "./MapaUF";
import { divulgacao, trilhas } from "@/lib/conteudo";
import { empresas, regiaoDaUF, regioes, type Regiao, type Vaga } from "@/lib/empresas";
import { alterar, progressoModulo, restaurar, useEstado } from "@/lib/estado";
import { caminho } from "@/lib/base";
import { baixarCSV } from "@/lib/csv";
import s from "./Painel.module.css";

type Aba = "relatorio" | "perfis" | "vaga";
const ABAS: [Aba, string][] = [["relatorio", "Relatório"], ["perfis", "Perfis"], ["vaga", "Publicar vaga"]];
const fmt = (n: number) => n.toLocaleString("pt-BR");
const pct = (n: number) => `${n.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function Painel() {
  const estado = useEstado();
  const avisar = useAviso();
  const [empresaId, setEmpresaId] = useState(empresas[0]!.id);
  const [aba, setAba] = useState<Aba>("relatorio");
  const [periodo, setPeriodo] = useState<"30" | "mes">("30");
  const [regiao, setRegiao] = useState<Regiao | "todas">("todas");
  const [soConcluidas, setSoConcluidas] = useState(false);
  const [vagaFoco, setVagaFoco] = useState<string | null>(null);
  const [verTabela, setVerTabela] = useState(false);
  const abasRef = useRef<(HTMLButtonElement | null)[]>([]);

  const emp = empresas.find((e) => e.id === empresaId) ?? empresas[0]!;
  const dd = emp.dados;
  const t = trilhas[dd.trilhaId];
  const vagas: Vaga[] = [...emp.vagas, ...(estado?.vagasExtras ?? []).filter((v) => v.empresa === emp.id)];

  const ufsFiltradas = useMemo(() => dd.porUF.filter((u) => regiao === "todas" || u.regiao === regiao), [dd, regiao]);
  const totais = useMemo(() => {
    const ativas = ufsFiltradas.reduce((a, u) => a + u.ativas, 0);
    const inscritas = ufsFiltradas.reduce((a, u) => a + u.inscritas, 0);
    return { ativas, inscritas, aderencia: inscritas ? (ativas / inscritas) * 100 : 0 };
  }, [ufsFiltradas]);
  const porRegiao = useMemo(() => {
    const totalAtivas = dd.porUF.reduce((a, u) => a + u.ativas, 0);
    return regioes.map((r) => {
      const us = dd.porUF.filter((u) => u.regiao === r);
      const ativas = us.reduce((a, u) => a + u.ativas, 0);
      return { regiao: r, share: (ativas / totalAtivas) * 100 };
    }).sort((a, b) => b.share - a.share);
  }, [dd]);

  const serie = useMemo(() => {
    if (periodo === "mes") {
      const hoje = new Date().getMonth();
      return { rotulos: dd.meses.map((_, i) => MESES[(hoje - dd.meses.length + 1 + i + 12) % 12]!), valores: dd.meses };
    }
    const rot: string[] = [];
    const d = new Date(); d.setDate(d.getDate() - 29);
    for (let i = 0; i < 30; i++) { rot.push(`${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`); d.setDate(d.getDate() + 1); }
    return { rotulos: rot, valores: dd.ultimos30 };
  }, [dd, periodo]);

  const jornadas = useMemo(() => {
    const lista = [...dd.jornadas];
    if (estado?.perfil.nome && estado.trilhaId === dd.trilhaId) {
      const feitos = t.modulos.filter((m) => progressoModulo(estado, m.id).concluido).length;
      const concluiu = feitos >= t.modulos.length;
      const uf = estado.perfil.uf || "PE";
      lista.unshift({ id: "Você (demo)", uf, regiao: regiaoDaUF(uf) ?? "Nordeste", etapa: concluiu ? "Trilha concluída" : `Módulo ${feitos + 1} de ${t.modulos.length}`, concluiu, xp: estado.xp, acesso: "agora", dias: 0 });
    }
    return lista.filter((j) => (regiao === "todas" || j.regiao === regiao) && (!soConcluidas || j.concluiu) && (periodo === "mes" || j.dias <= 30));
  }, [dd, estado, t, regiao, soConcluidas, periodo]);

  function trocarAba(nova: Aba, foco = false) {
    setAba(nova);
    if (foco) abasRef.current[ABAS.findIndex(([id]) => id === nova)]?.focus();
  }
  function tecladoAbas(ev: KeyboardEvent, i: number) {
    const d = ev.key === "ArrowRight" ? 1 : ev.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    ev.preventDefault();
    trocarAba(ABAS[(i + d + ABAS.length) % ABAS.length]![0], true);
  }

  const h = Math.floor(dd.minutosDia / 60), min = dd.minutosDia % 60;
  const migalha = { relatorio: "Aderência mensal", perfis: "Jornadas das usuárias", vaga: "Nova vaga" }[aba];
  const atalhos: [string, NomeIcone, string][] = [["visao", "painel", "Visão atual"], ["aderencia", "pizza", "Aderência por região"], ["ultimos", "relogio", "Dados dos últimos 30 dias"], ["vagas", "globo", "Vagas em aberto"]];

  return (
    <>
      <a className="pular" href="#conteudo-painel">Pular para o conteúdo</a>
      <div className="dash">
        <aside className="dash__lateral" aria-label="Atalhos do painel">
          <Link className="dash__menu" href="/" aria-label="Voltar ao app"><Icone nome="menu" /></Link>
          <span className="dash__traco" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={caminho("/img/simbolo-sofias.png")} alt="Sofias" width={40} height={47} className="dash__logo" />
          <span className="dash__traco" />
          <nav className="dash__icones">
            {atalhos.map(([id, ic, rot], i) => (
              <a key={id} href={`#sec-${id}`} aria-label={rot} title={rot} className={i === 0 && aba === "relatorio" ? "ativo" : undefined}
                onClick={(e) => { if (aba !== "relatorio") { e.preventDefault(); setAba("relatorio"); setTimeout(() => document.getElementById(`sec-${id}`)?.scrollIntoView(), 50); } }}>
                <Icone nome={ic} />
              </a>
            ))}
          </nav>
          <span className="dash__traco dash__traco--baixo" />
          <Link className="dash__chat" href="/" aria-label="Voltar ao app" title="Voltar ao app"><Icone nome="conversa" /></Link>
        </aside>

        <div className="dash__principal" id="conteudo-painel" tabIndex={-1}>
          <header className="dash__topo">
            <div className="dash__abas" role="tablist" aria-label="Seções do painel">
              {ABAS.map(([id, rot], i) => (
                <button key={id} type="button" role="tab" id={`aba-${id}`} aria-controls="dash-conteudo" aria-selected={aba === id} tabIndex={aba === id ? 0 : -1}
                  ref={(el) => { abasRef.current[i] = el; }} onClick={() => trocarAba(id)} onKeyDown={(ev) => tecladoAbas(ev, i)}>{rot}</button>
              ))}
            </div>
            <div className="dash__empresa">
              <label className="sr-only" htmlFor="sel-empresa">Empresa</label>
              <span className="dash__empresa-sel">
                <select id="sel-empresa" value={empresaId} onChange={(e) => { setEmpresaId(e.target.value); setVagaFoco(null); }}>
                  {empresas.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}
                </select>
                <Icone nome="chevronBaixo" />
              </span>
              <span className="dash__avatar" aria-hidden="true">{emp.nome.split(" ").filter((w) => w.length > 2).slice(0, 2).map((w) => w[0]).join("")}</span>
            </div>
          </header>
          <h1 className="sr-only">Painel da empresa: {emp.nome}</h1>
          <p className="dash__migalha"><span>Relatório</span><Icone nome="chevron" /><span>{migalha}</span></p>

          <div className={s.filtros} role="group" aria-label="Filtros">
            <Icone nome="filtro" />
            <label className={s.filtro}><span>Região</span>
              <select value={regiao} onChange={(e) => setRegiao(e.target.value as Regiao | "todas")}>
                <option value="todas">Todo o Brasil</option>
                {regioes.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            <label className={s.filtro}><span>Período</span>
              <select value={periodo} onChange={(e) => setPeriodo(e.target.value as "30" | "mes")}>
                <option value="30">Últimos 30 dias</option>
                <option value="mes">Últimos 7 meses</option>
              </select>
            </label>
            <span className={s.trilha}>Trilha: {t.nome}</span>
            {(regiao !== "todas" || periodo !== "30") && <button type="button" className="dash__ver-mais" onClick={() => { setRegiao("todas"); setPeriodo("30"); }}>limpar filtros</button>}
          </div>

          <div id="dash-conteudo" role="tabpanel" aria-labelledby={`aba-${aba}`}>
            {aba === "relatorio" && (
              <>
                <div className="dash__grade">
                  <section className="dash__visao" id="sec-visao" aria-labelledby="t-visao">
                    <div className="dash__cab">
                      <h2 id="t-visao">Visão atual <span className="dash__info" title="Usuárias com ao menos um acesso no dia, em todo o Brasil"><Icone nome="info" /></span></h2>
                      <span className="dash__data">{periodo === "30" ? "últimos 30 dias" : "visão mensal"} <Icone nome="calendario" /></span>
                    </div>
                    <div className="dash__grafico">
                      <GraficoVisao key={`${emp.id}-${periodo}`} rotulos={serie.rotulos} valores={serie.valores} descricao={`Usuárias ativas, ${periodo === "30" ? "últimos 30 dias" : "por mês"}: de ${fmt(serie.valores[0] ?? 0)} a ${fmt(serie.valores[serie.valores.length - 1] ?? 0)}.`} />
                    </div>
                  </section>

                  <aside className="dash__parceiros cartao-branco" aria-label="Parceiros de divulgação">
                    <ul>
                      {divulgacao.map((p, i) => (
                        <li key={p.nome}>
                          <span className={`dash__selo dash__selo--${i}`} aria-hidden="true">{p.nome.split(" ").filter((w) => w.length > 2).slice(0, 2).map((w) => w[0]).join("")}</span>
                          <span><small>{p.tipo}</small>{p.nome}</span>
                        </li>
                      ))}
                    </ul>
                  </aside>

                  <section className={`dash__bloco ${s.blocoMapa}`} id="sec-aderencia" aria-labelledby="t-ader">
                    <div className="dash__cab">
                      <h2 id="t-ader">Aderência por região <span className="dash__info" title="Usuárias ativas sobre inscritas em cada estado"><Icone nome="info" /></span></h2>
                      <button type="button" className="dash__ver-mais" onClick={() => setVerTabela(!verTabela)} aria-expanded={verTabela}>{verTabela ? "ocultar tabela" : "ver como tabela"}</button>
                    </div>
                    <div className={s.mapaLinha}>
                      <MapaUF dados={dd.porUF} regiao={regiao} />
                      <ul className="leg">
                        {porRegiao.slice(0, 3).map((r, i) => (
                          <li key={r.regiao}><span className="leg__traco" style={{ background: ["#2c0556", "#5b2a92", "#8a63b8"][i] }} /><span><span className="leg__nome">{r.regiao}</span><span className="leg__val">{pct(r.share)} das usuárias ativas</span></span></li>
                        ))}
                      </ul>
                    </div>
                    <button type="button" className="botao botao--fantasma" style={{ marginTop: 12 }} onClick={() => {
                      baixarCSV(`aderencia-uf-${emp.id}${regiao !== "todas" ? `-${regiao.toLowerCase()}` : ""}.csv`, ["UF", "Estado", "Região", "Inscritas", "Ativas", "Aderência (%)"],
                        ufsFiltradas.map((u) => [u.sigla, u.nome, u.regiao, u.inscritas, u.ativas, u.aderencia]));
                      avisar("CSV de aderência exportado.");
                    }}><Icone nome="baixar" />Exportar CSV</button>
                  </section>

                  <section className="dash__bloco" id="sec-ultimos" aria-labelledby="t-ult">
                    <h2 id="t-ult">Dados dos últimos 30 dias <span className="dash__info" title={`Média entre as usuárias ativas da trilha ${t.nome}`}><Icone nome="info" /></span></h2>
                    <dl className="dash__dados">
                      <div><dt>Média de horas de uso por dia</dt><dd>{h} {h === 1 ? "hora" : "horas"} e {min} minutos</dd></div>
                      <div><dt>Duração média de capacitação</dt><dd>{dd.duracaoDias} dias</dd></div>
                      <div className="dash__dados-par">
                        <div><dt>Ativas {regiao === "todas" ? "no Brasil" : `no ${regiao}`}</dt><dd className="menor">{fmt(totais.ativas)}</dd></div>
                        <div><dt>Aderência</dt><dd className="menor">{pct(totais.aderencia)}</dd></div>
                        <div><dt>Conclusão</dt><dd className="menor">{dd.conclusao}%</dd></div>
                      </div>
                    </dl>
                  </section>

                  <section className="dash__bloco dash__vagas" id="sec-vagas" aria-labelledby="t-vagas">
                    <h2 id="t-vagas">Vagas em aberto <span className="dash__info" title="Candidatas compatíveis: concluíram a trilha e autorizaram compartilhar a jornada"><Icone nome="info" /></span></h2>
                    {vagas.length ? (
                      <ul className="cartao-branco">
                        {vagas.slice(0, 3).map((v) => (
                          <li key={v.cargo}><strong>{v.cargo}</strong><small>{v.aptas} candidatas compatíveis</small>
                            <button type="button" className="etiqueta-amarela" onClick={() => { setVagaFoco(v.cargo); setSoConcluidas(true); trocarAba("perfis", true); }}>conhecer candidatas</button></li>
                        ))}
                      </ul>
                    ) : <p className="estado-vazio">Nenhuma vaga aberta.</p>}
                    <button type="button" className="dash__ver-mais" onClick={() => trocarAba("vaga", true)}>Ver mais</button>
                  </section>
                </div>
                    {verTabela && (
                      <section className="cartao-branco dash__tabela" style={{ marginTop: 24 }} aria-label="Aderência por estado">
                      <div className="tabela-rolagem">
                        <table className="tabela">
                          <caption className="sr-only">Aderência por estado</caption>
                          <thead><tr><th scope="col">UF</th><th scope="col">Região</th><th scope="col" className="num">Inscritas</th><th scope="col" className="num">Ativas</th><th scope="col" className="num">Aderência</th></tr></thead>
                          <tbody>{[...ufsFiltradas].sort((a, b) => b.aderencia - a.aderencia).map((u) => <tr key={u.sigla}><td>{u.nome}</td><td>{u.regiao}</td><td className="num">{fmt(u.inscritas)}</td><td className="num">{fmt(u.ativas)}</td><td className="num">{u.aderencia}%</td></tr>)}</tbody>
                        </table>
                      </div>
                      </section>
                    )}
                <p className="dash__roadmap"><strong>No roadmap:</strong> análise do desempenho das usuárias com sugestões de boas práticas para cada trilha.</p>
              </>
            )}

            {aba === "perfis" && (
              <section className="cartao-branco dash__tabela" aria-labelledby="t-perfis">
                <div className="dash__cab">
                  <h2 id="t-perfis">{vagaFoco ? `Candidatas compatíveis: ${vagaFoco}` : "Jornadas recentes"}</h2>
                  <div className={s.acoesTabela}>
                    <label className={s.check}><input type="checkbox" checked={soConcluidas} onChange={(e) => { setSoConcluidas(e.target.checked); if (!e.target.checked) setVagaFoco(null); }} />só quem concluiu</label>
                    <button type="button" className="botao botao--fantasma" onClick={() => {
                      baixarCSV(`jornadas-${emp.id}.csv`, ["Usuária", "UF", "Região", "Etapa", "XP", "Último acesso"], jornadas.map((j) => [j.id, j.uf, j.regiao, j.etapa, j.xp, j.acesso]));
                      avisar("CSV de jornadas exportado.");
                    }} disabled={!jornadas.length}><Icone nome="baixar" />Exportar CSV</button>
                  </div>
                </div>
                <p className="nota">Trilha {t.nome}. Identificação anonimizada; a linha "Você (demo)" vem do seu progresso neste navegador.</p>
                {jornadas.length ? (
                  <div className="tabela-rolagem">
                    <table className="tabela">
                      <thead><tr><th scope="col">Usuária</th><th scope="col">UF</th><th scope="col">Etapa</th><th scope="col" className="num">XP</th><th scope="col">Último acesso</th></tr></thead>
                      <tbody>{jornadas.map((j) => <tr key={j.id} className={j.id === "Você (demo)" ? "destaque" : undefined}><td>{j.id}</td><td>{j.uf}</td><td>{j.etapa}</td><td className="num">{j.xp}</td><td>{j.acesso}</td></tr>)}</tbody>
                    </table>
                  </div>
                ) : (
                  <div className="estado-vazio">Nenhuma usuária com esses filtros. <button type="button" className="dash__ver-mais" style={{ display: "inline" }} onClick={() => { setRegiao("todas"); setSoConcluidas(false); setVagaFoco(null); }}>limpar filtros</button></div>
                )}
              </section>
            )}

            {aba === "vaga" && <PublicarVaga empresaId={emp.id} vagas={vagas} aptasBase={Math.max(2, Math.round(dd.porUF.reduce((a, u) => a + u.ativas, 0) * dd.conclusao / 100 / 120))} />}
          </div>
        </div>
      </div>
      <footer className="rodape-demo">
        <span>Protótipo com dados fictícios.</span>
        <Link href="/" className="link">Voltar ao app</Link>
        <button type="button" className="link" onClick={() => { if (confirm("Restaurar os dados de exemplo?")) { restaurar(); avisar("Dados de exemplo restaurados."); } }}>Restaurar dados de exemplo</button>
      </footer>
    </>
  );
}

function PublicarVaga({ empresaId, vagas, aptasBase }: { empresaId: string; vagas: Vaga[]; aptasBase: number }) {
  const avisar = useAviso();
  const [cargo, setCargo] = useState("");
  const [cidade, setCidade] = useState("");
  const [modalidade, setModalidade] = useState<Vaga["modalidade"]>("Presencial");
  const [erros, setErros] = useState<{ cargo?: string; cidade?: string }>({});

  return (
    <div className="dash__duas">
      <section className="cartao-branco dash__tabela" aria-labelledby="t-lista-vagas">
        <h2 id="t-lista-vagas">Vagas em aberto</h2>
        <div className="tabela-rolagem">
          <table className="tabela">
            <thead><tr><th scope="col">Cargo</th><th scope="col">Local</th><th scope="col">Modalidade</th><th scope="col" className="num">Compatíveis</th></tr></thead>
            <tbody>{vagas.map((v, i) => <tr key={`${v.cargo}-${i}`}><td>{v.cargo}</td><td>{v.cidade}</td><td>{v.modalidade}</td><td className="num">{v.aptas}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
      <form className="cartao-branco form-vaga" noValidate aria-labelledby="t-nova-vaga" onSubmit={(ev) => {
        ev.preventDefault();
        const e: typeof erros = {};
        if (cargo.trim().length < 3) e.cargo = "Informe o cargo (mínimo 3 letras).";
        if (cidade.trim().length < 3) e.cidade = "Informe a cidade e UF, ou Remoto.";
        setErros(e);
        if (Object.keys(e).length) { document.getElementById(e.cargo ? "v-cargo" : "v-cidade")?.focus(); return; }
        alterar((st) => { st.vagasExtras.push({ empresa: empresaId, cargo: cargo.trim(), cidade: cidade.trim(), modalidade, aptas: aptasBase }); });
        setCargo(""); setCidade("");
        avisar("Vaga publicada.");
      }}>
        <h2 id="t-nova-vaga">Publicar vaga</h2>
        <div className={`campo${erros.cargo ? " campo--erro" : ""}`}>
          <label htmlFor="v-cargo">Cargo</label>
          <input id="v-cargo" maxLength={50} value={cargo} onChange={(e) => setCargo(e.target.value)} aria-invalid={!!erros.cargo} aria-describedby={erros.cargo ? "e-cargo" : undefined} />
          {erros.cargo && <p className="erro" id="e-cargo">{erros.cargo}</p>}
        </div>
        <div className={`campo${erros.cidade ? " campo--erro" : ""}`}>
          <label htmlFor="v-cidade">Local</label>
          <input id="v-cidade" maxLength={40} placeholder="Cidade, UF ou Remoto" value={cidade} onChange={(e) => setCidade(e.target.value)} aria-invalid={!!erros.cidade} aria-describedby={erros.cidade ? "e-cidade" : undefined} />
          {erros.cidade && <p className="erro" id="e-cidade">{erros.cidade}</p>}
        </div>
        <div className="campo">
          <label htmlFor="v-mod">Modalidade</label>
          <select id="v-mod" value={modalidade} onChange={(e) => setModalidade(e.target.value as Vaga["modalidade"])}>
            <option>Presencial</option><option>Híbrido</option><option>Remoto</option>
          </select>
        </div>
        <button type="submit" className="botao botao--primario"><Icone nome="mais" />Publicar</button>
      </form>
    </div>
  );
}

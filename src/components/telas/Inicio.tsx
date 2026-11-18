"use client";
/* Tela "Navegue" (mockup do pitch) ou cadastro, se ainda não há conta. */
import Link from "next/link";
import { useMemo, useState } from "react";
import { Icone, Ilustracao } from "../Icone";
import { useAviso } from "../Aviso";
import { Cadastro } from "./Cadastro";
import { Carregando } from "./Carregando";
import { eventos, ilustracoes, ordemTrilhas, todosModulos, trilhas } from "@/lib/conteudo";
import { alterar, moduloLiberado, progressoModulo, trilhaAtual, useEstado } from "@/lib/estado";

const minuscula = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

export function Inicio() {
  const estado = useEstado();
  const avisar = useAviso();
  const [busca, setBusca] = useState("");

  const achados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return null;
    return todosModulos().filter((x) => `${x.m.titulo} ${x.m.resumo} ${x.t.nome}`.toLowerCase().includes(q));
  }, [busca]);

  if (!estado) return <Carregando />;
  if (!estado.perfil.nome) return <Cadastro estado={estado} />;

  const t = trilhaAtual(estado);
  const proximo = t?.modulos.find((m) => !progressoModulo(estado, m.id).concluido);
  const recomendados = t ? t.modulos.map((m, i) => ({ m, bloq: !moduloLiberado(estado, t, i) })) : ordemTrilhas.map((k) => ({ m: trilhas[k].modulos[0]!, bloq: false }));

  return (
    <section className="tela">
      <h1 className="titulo">Navegue</h1>

      {!estado.orientacaoVista && (
        <div className="orientacao" role="note">
          <strong>Como a Sofias funciona</strong>
          <ol>
            <li>Faça o teste e receba uma trilha de empresa parceira.</li>
            <li>Estude em blocos curtos; baixe os módulos para usar sem internet.</li>
            <li>Conclua e receba o certificado; a empresa vê que você está pronta.</li>
          </ol>
          <button type="button" className="folha__fechar" aria-label="Entendi, fechar orientação" onClick={() => alterar((e) => { e.orientacaoVista = true; })}><Icone nome="fechar" /></button>
        </div>
      )}

      {t && proximo ? (
        <Link className="continuar" href={`/modulo/${proximo.id}/`}>
          <span><small>continue de onde parou</small><strong>{proximo.titulo}</strong></span>
          <Icone nome="seta" />
        </Link>
      ) : !t ? (
        <Link className="continuar" href="/teste/">
          <span><small>primeiro passo</small><strong>Fazer o teste vocacional</strong></span>
          <Icone nome="seta" />
        </Link>
      ) : null}

      <form className="busca" role="search" onSubmit={(e) => e.preventDefault()}>
        <label className="sr-only" htmlFor="busca">Procurar interesses</label>
        <span className="busca__campo"><Icone nome="lupa" /><input id="busca" type="search" placeholder="procure interesses" autoComplete="off" value={busca} onChange={(e) => setBusca(e.target.value)} /></span>
        <button type="submit" className="busca__botao" aria-label="Procurar"><Icone nome="seta" /></button>
      </form>
      <div aria-live="polite">
        {achados && (achados.length ? (
          <ul className="lista-jornada lista-jornada--busca">
            {achados.map((x) => (
              <li key={x.m.id}><Link href={`/modulo/${x.m.id}/`}><Icone nome="prancheta" /><span>{x.m.titulo}<small>{x.t.nome}</small></span></Link></li>
            ))}
          </ul>
        ) : <p className="estado-vazio" style={{ marginTop: 12 }}>Nada encontrado para "{busca.trim()}". Tente "planilha", "cliente" ou "senha".</p>)}
      </div>

      <h2 className="subtitulo">Recomendados</h2>
      <div className="carrossel">
        {recomendados.map(({ m, bloq }) => (
          <Link key={m.id} className="card-roxo" href={`/modulo/${m.id}/`}>
            <span className="card-roxo__txt">{minuscula(m.titulo)}</span>
            {bloq && <span className="card-roxo__selo" title="Bloqueado"><Icone nome="cadeado" /><span className="sr-only">bloqueado</span></span>}
            <Ilustracao nome={ilustracoes[m.id] ?? "lampada"} className="ilus" />
          </Link>
        ))}
      </div>

      <h2 className="subtitulo">Popular</h2>
      <div className="populares">
        <Link href="/conteudos/podcasts/">Podcasts</Link>
        <Link href="/conteudos/livros/">Livros</Link>
        <Link href="/conteudos/artigos/">Artigos</Link>
        <Link href="/conteudos/videos/">Vídeos</Link>
      </div>

      <div className="subtitulo subtitulo--acao"><h2>Eventos patrocinados</h2><Link href="/conteudos/eventos/" aria-label="Ver todos os eventos"><Icone nome="seta" /></Link></div>
      <div className="carrossel carrossel--eventos">
        {eventos.map((ev) => {
          const insc = !!estado.eventos[ev.id];
          return (
            <button key={ev.id} type="button" className={`card-evento${insc ? " inscrita" : ""}`} aria-pressed={insc}
              onClick={() => { alterar((e) => { if (insc) delete e.eventos[ev.id]; else e.eventos[ev.id] = true; }); avisar(insc ? "Inscrição cancelada." : "Inscrição feita (simulado na demo)."); }}>
              <small>{ev.tipo}</small><strong>{ev.titulo}</strong>
              <span className="card-evento__patro">{ev.patrocinio}</span>
              <span className="card-evento__data"><Icone nome="calendario" />{ev.data}</span>
              <span className="card-evento__estado">{insc ? "inscrita" : "inscrever-se"}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

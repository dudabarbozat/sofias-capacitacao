"use client";
/* Lista de conteúdos por formato e eventos patrocinados. */
import Link from "next/link";
import { Icone } from "../Icone";
import { FORMATOS } from "@/lib/formatos";
import { useAviso } from "../Aviso";
import { Carregando } from "./Carregando";
import { eventos, ordemTrilhas, trilhas } from "@/lib/conteudo";
import { alterar, moduloLiberado, trilhaAtual, useEstado } from "@/lib/estado";


export function Conteudos({ tipo }: { tipo: string }) {
  const estado = useEstado();
  const avisar = useAviso();
  const f = FORMATOS[tipo];
  if (!estado || !f) return <Carregando />;
  const voltar = <Link className="voltar" href="/"><Icone nome="voltar" /><span>início</span></Link>;

  if (tipo === "eventos") {
    return (
      <section className="tela">
        {voltar}
        <h1 className="titulo">{f.nome}</h1>
        <p className="lead">Encontros online oferecidos pelas empresas parceiras. Gratuitos para você.</p>
        <div className="grade-eventos">
          {eventos.map((ev) => {
            const insc = !!estado.eventos[ev.id];
            return (
              <button key={ev.id} type="button" className={`card-evento card-evento--largo${insc ? " inscrita" : ""}`} aria-pressed={insc}
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

  const t = trilhaAtual(estado);
  const fontes = t ? [t] : ordemTrilhas.map((k) => trilhas[k]);
  const itens = fontes.flatMap((tr) => tr.modulos.map((m, i) => {
    let titulo: string, meta: string;
    if (tipo === "podcasts") { titulo = m.podcast.titulo; meta = `${m.podcast.minutos} min · ${m.podcast.mb} MB`; }
    else if (tipo === "videos") { titulo = m.video.titulo; meta = `${m.video.minutos} min · ${m.video.mb} MB`; }
    else if (tipo === "artigos") { titulo = m.titulo; meta = `leitura de ${Math.max(3, Math.round(m.artigo.join(" ").split(" ").length / 60))} min`; }
    else { titulo = `Apostila: ${m.titulo}`; meta = `${8 + m.artigo.length * 4} páginas · PDF`; }
    return { id: m.id, titulo, meta, bloq: !moduloLiberado(estado, tr, i) };
  }));

  return (
    <section className="tela">
      {voltar}
      <h1 className="titulo">{f.nome}</h1>
      <p className="lead">{t ? `Da sua trilha: ${t.nome}.` : "De todas as trilhas."}</p>
      <ul className="lista-conteudo">
        {itens.map((x) => (
          <li key={x.id}>
            <Link href={`/modulo/${x.id}/`}>
              <span className="lista-conteudo__ic"><Icone nome={f.icone} /></span>
              <span className="lista-conteudo__txt"><strong>{x.titulo}</strong><small>{x.meta}{x.bloq ? " · bloqueado" : ""}</small></span>
              <Icone nome="chevron" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

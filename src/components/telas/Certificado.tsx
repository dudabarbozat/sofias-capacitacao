"use client";
/* Certificado de conclusão na identidade dos slides, pronto para imprimir. */
import Link from "next/link";
import { useEffect } from "react";
import { Icone } from "../Icone";
import { useAviso } from "../Aviso";
import { Carregando } from "./Carregando";
import { SemTrilha } from "./Estudos";
import { xpRegras as R } from "@/lib/conteudo";
import { alterar, ganharXp, progressoModulo, trilhaAtual, trilhaConcluida, useEstado } from "@/lib/estado";
import { caminho } from "@/lib/base";

function codigoCert(txt: string): string {
  let h = 2166136261;
  for (let i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 16777619); }
  const s = (h >>> 0).toString(36).toUpperCase().padStart(7, "0");
  return `SOF-${s.slice(0, 4)}-${s.slice(4, 7)}`;
}

function dataExtenso(iso: string): string {
  const [a, m, d] = iso.split("-");
  const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  return `${Number(d)} de ${meses[Number(m) - 1]} de ${a}`;
}

export function Certificado() {
  const estado = useEstado();
  const avisar = useAviso();
  const t = estado ? trilhaAtual(estado) : null;
  const concluida = estado ? trilhaConcluida(estado) : false;

  useEffect(() => {
    if (!estado || !t || !concluida) return;
    if (!estado.certificado || estado.certificado.trilhaId !== t.id) {
      const h = new Date();
      const iso = `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, "0")}-${String(h.getDate()).padStart(2, "0")}`;
      alterar((e) => { e.certificado = { trilhaId: t.id, data: iso, nome: e.perfil.nome }; });
    }
  }, [estado, t, concluida]);

  if (!estado) return <Carregando />;
  if (!t) return <SemTrilha />;

  if (!concluida) {
    return (
      <section className="tela">
        <p className="sobrelinha">Certificado</p>
        <h1 className="titulo">Falta pouco</h1>
        <p className="lead">O certificado de {t.nome} é emitido quando os {t.modulos.length} módulos estiverem concluídos.</p>
        <ul className="checklist cartao">
          {t.modulos.map((m) => {
            const p = progressoModulo(estado, m.id);
            return (
              <li key={m.id} className={p.concluido ? "ok" : undefined}>
                {p.concluido ? <Icone nome="check" /> : <span className="ponto" />}
                <span>{m.titulo}<small>{p.etapas} de 3 etapas</small></span>
              </li>
            );
          })}
        </ul>
        <Link className="botao botao--primario" href="/estudos/">Voltar aos estudos <Icone nome="seta" /></Link>
        <div className="atalho-demo">
          <p className="nota">Para avaliar a demo sem fazer tudo:</p>
          <button type="button" className="link" onClick={() => {
            let ganho = 0;
            alterar((e) => {
              t.modulos.forEach((m) => {
                const p = e.progresso[m.id] ?? {};
                if (!p.artigo) { p.artigo = true; ganho += R.artigo; }
                if (!p.cards) { p.cards = true; ganho += R.cards; }
                if (!p.quiz) { p.quiz = { acertos: m.quiz.length, total: m.quiz.length }; ganho += m.quiz.length * R.acerto + R.quizCompleto; }
                e.progresso[m.id] = p;
              });
            });
            const novo = ganharXp(ganho);
            if (novo) avisar(`Você subiu para o nível ${novo.n}: ${novo.nome}.`, "destaque");
          }}>Concluir a trilha automaticamente</button>
        </div>
      </section>
    );
  }

  const c = estado.certificado;
  if (!c) return <Carregando />;
  const codigo = codigoCert(`${c.nome}|${t.id}|${c.data}`);

  return (
    <section className="tela tela--cert">
      <div className="nao-imprime">
        <p className="sobrelinha">Certificado</p>
        <h1 className="titulo">Trilha concluída</h1>
        <div className="campo">
          <label htmlFor="nome-cert">Nome no certificado</label>
          <input id="nome-cert" maxLength={60} autoComplete="name" value={c.nome}
            onChange={(ev) => { const v = ev.target.value; alterar((e) => { if (e.certificado) e.certificado.nome = v; }); }}
            onBlur={(ev) => { if (!ev.target.value.trim()) alterar((e) => { if (e.certificado) e.certificado.nome = e.perfil.nome; }); }} />
        </div>
      </div>
      <article className="certificado" aria-label="Certificado de conclusão">
        <span className="certificado__arco certificado__arco--a" aria-hidden="true" />
        <span className="certificado__arco certificado__arco--b" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="certificado__logo" src={caminho("/img/logo-sofias.png")} alt="Sofias" width={120} height={99} />
        <p className="certificado__tipo">Certificado de conclusão</p>
        <p className="certificado__texto">Certificamos que</p>
        <p className="certificado__nome">{c.nome || estado.perfil.nome}</p>
        <p className="certificado__texto">concluiu a trilha <strong>{t.nome}</strong>, oferecida por {t.parceira}, com carga horária de {t.cargaHoras} horas.</p>
        <ul className="certificado__modulos">{t.modulos.map((m) => <li key={m.id}>{m.titulo}</li>)}</ul>
        <div className="certificado__rodape">
          <div><small>Emitido em</small>{dataExtenso(c.data)}</div>
          <div><small>Código de verificação</small><span>{codigo}</span></div>
        </div>
        <p className="certificado__nota">Verificação pública simulada na demo.</p>
      </article>
      <div className="nao-imprime acoes-cert">
        <button type="button" className="botao botao--primario" onClick={() => window.print()}><Icone nome="imprimir" />Imprimir ou salvar em PDF</button>
        <Link className="botao botao--fantasma" href="/estudos/">Voltar aos estudos</Link>
      </div>
    </section>
  );
}

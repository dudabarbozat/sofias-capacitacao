"use client";
/* Teste vocacional e psicocognitivo: uma pergunta por vez. */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icone } from "../Icone";
import { Carregando } from "./Carregando";
import { teste } from "@/lib/conteudo";
import { alterar, useEstado } from "@/lib/estado";

const TIPOS = { vocacional: "vocacional", "raciocínio": "raciocínio", rotina: "sua rotina" } as const;

export function Teste() {
  const estado = useEstado();
  const router = useRouter();
  const [respostas, setRespostas] = useState<number[]>([]);
  const [atual, setAtual] = useState(0);
  const enunciado = useRef<HTMLSpanElement>(null);
  const primeiro = useRef(true);

  useEffect(() => { if (estado && !estado.perfil.nome) router.replace("/"); }, [estado, router]);
  useEffect(() => { if (primeiro.current) { primeiro.current = false; return; } enunciado.current?.focus(); }, [atual]);

  if (!estado || !estado.perfil.nome) return <Carregando />;
  const p = teste[atual]!;
  const total = teste.length;
  const marcada = respostas[atual];

  return (
    <section className="tela tela--teste">
      <h1 className="sr-only">Teste vocacional</h1>
      <div className="teste-topo">
        <Link className="voltar" href="/"><Icone nome="voltar" /><span>sair</span></Link>
        <span className="contador">{atual + 1} de {total}</span>
      </div>
      <div className="cartao-progresso">
        <span className="cartao-progresso__txt">teste vocacional</span>
        <span className="cartao-progresso__pct">{Math.round((atual / total) * 100)}%</span>
        <span className="progresso" role="progressbar" aria-label="Progresso do teste" aria-valuemin={0} aria-valuemax={total} aria-valuenow={atual + 1}>
          <span style={{ width: `${((atual + 1) / total) * 100}%` }} />
        </span>
      </div>
      <form className="pergunta" onSubmit={(ev) => {
        ev.preventDefault();
        if (marcada == null) return;
        if (atual < total - 1) { setAtual(atual + 1); return; }
        alterar((e) => { e.teste = { respostas: respostas.slice(0, total), explicacao: null }; });
        router.push("/resultado/");
      }}>
        <fieldset>
          <legend>
            <span className="etiqueta">{TIPOS[p.tipo]}</span>
            <span className="titulo titulo--pergunta" tabIndex={-1} ref={enunciado}>{p.texto}</span>
          </legend>
          <div className="opcoes">
            {p.opcoes.map((o, k) => (
              <label key={`${atual}-${k}`} className="opcao">
                <input type="radio" name={`resp-${atual}`} value={k} checked={marcada === k}
                  onChange={() => setRespostas((r) => { const n = r.slice(); n[atual] = k; return n; })} />
                <span>{o.texto}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="teste-acoes">
          {atual > 0 ? <button type="button" className="botao botao--fantasma" onClick={() => setAtual(atual - 1)}>Anterior</button> : <span />}
          <button type="submit" className="botao botao--primario" disabled={marcada == null}>{atual === total - 1 ? "Ver resultado" : "Próxima"}</button>
        </div>
      </form>
    </section>
  );
}

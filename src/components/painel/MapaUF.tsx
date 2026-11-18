"use client";
/* Mapa do Brasil por UF com a malha oficial do IBGE, colorido pela aderência. */
import { useCallback, useEffect, useMemo, useState } from "react";
import { carregarMalhaUF, type FeatureUF } from "@/lib/ibge";
import { UFS, type DadoUF, type Regiao } from "@/lib/empresas";
import s from "./Painel.module.css";

export const TONS = ["#e3d6f2", "#c0a6e0", "#8a63b8", "#5b2a92", "#2c0556"];
export const FAIXAS = [0, 45, 55, 65, 75];
export function tomDe(aderencia: number): string {
  let i = 0;
  FAIXAS.forEach((f, k) => { if (aderencia >= f) i = k; });
  return TONS[i]!;
}

const K = 6;
const COS = Math.cos((15 * Math.PI) / 180);
function projetar([lon, lat]: [number, number]): [number, number] { return [(lon + 74.5) * K * COS, (5.6 - lat) * K]; }

function caminhoDe(f: FeatureUF): string {
  return f.poligonos.map((poli) => poli.map((anel) => "M" + anel.map((pt) => projetar(pt).map((n) => n.toFixed(1)).join(" ")).join("L") + "Z").join("")).join("");
}

export function MapaUF({ dados, regiao }: { dados: DadoUF[]; regiao: Regiao | "todas" }) {
  const [malha, setMalha] = useState<FeatureUF[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [foco, setFoco] = useState<string | null>(null);

  const carregar = useCallback(() => {
    setErro(null); setMalha(null);
    carregarMalhaUF().then(setMalha).catch((e: Error) => setErro(e.message));
  }, []);
  useEffect(() => { carregar(); }, [carregar]);

  const caminhos = useMemo(() => (malha ?? []).map((f) => {
    const uf = UFS.find((u) => String(u.id) === f.codarea);
    return uf ? { sigla: uf.sigla, d: caminhoDe(f) } : null;
  }).filter((x): x is { sigla: string; d: string } => !!x), [malha]);

  const porSigla = useMemo(() => new Map(dados.map((d) => [d.sigla, d])), [dados]);
  const info = foco ? porSigla.get(foco) : null;

  if (erro) {
    return (
      <div className="estado-erro" role="alert">
        <p>Não foi possível carregar a malha do IBGE ({erro}). Os números continuam na tabela abaixo.</p>
        <button type="button" className="botao botao--fantasma" onClick={carregar}>Tentar de novo</button>
      </div>
    );
  }
  if (!malha) return <span className={`esqueleto ${s.mapaEsqueleto}`} role="status" aria-label="Carregando mapa do IBGE" />;

  return (
    <div className={s.mapaCaixa}>
      <svg className={s.mapa} viewBox={`0 0 ${(40.5 * K * COS).toFixed(0)} ${(40 * K).toFixed(0)}`} role="group" aria-label="Mapa do Brasil por estado, cor pela aderência">
        {caminhos.map((c) => {
          const d = porSigla.get(c.sigla);
          if (!d) return null;
          const apagado = regiao !== "todas" && d.regiao !== regiao;
          return (
            <path key={c.sigla} d={c.d} fill={tomDe(d.aderencia)} className={`${s.uf}${apagado ? ` ${s.ufApagada}` : ""}${foco === c.sigla ? ` ${s.ufFoco}` : ""}`}
              tabIndex={apagado ? -1 : 0} role="img" aria-label={`${d.nome}: aderência de ${d.aderencia}%, ${d.ativas} usuárias ativas`}
              onMouseEnter={() => setFoco(c.sigla)} onMouseLeave={() => setFoco(null)} onFocus={() => setFoco(c.sigla)} onBlur={() => setFoco(null)} />
          );
        })}
      </svg>
      <div className={s.mapaInfo} aria-live="polite">
        {info ? (
          <><strong>{info.nome}</strong><span>{info.aderencia}% de aderência</span><span>{info.ativas} ativas de {info.inscritas} inscritas</span></>
        ) : <span className={s.mapaDica}>Passe o mouse ou use Tab para ver cada estado.</span>}
      </div>
      <ul className={s.legenda} aria-label="Legenda de aderência">
        {TONS.map((t, i) => <li key={t}><span style={{ background: t }} />{i === 0 ? `< ${FAIXAS[1]}%` : i === TONS.length - 1 ? `≥ ${FAIXAS[i]}%` : `${FAIXAS[i]}–${(FAIXAS[i + 1] ?? 100) - 1}%`}</li>)}
      </ul>
      <p className={s.fonte}>Malha: IBGE, API de malhas v3.</p>
    </div>
  );
}

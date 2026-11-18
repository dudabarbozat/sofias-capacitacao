"use client";
/* Estado da demo, persistido em localStorage. */
import { useSyncExternalStore } from "react";
import { niveis, ordemTrilhas, teste, trilhas, type Card, type Questao, type Trilha, type TrilhaId, type Nivel } from "./conteudo";
import type { Vaga } from "./empresas";

const CHAVE = "sofias.v2";

export interface Explicacao { trilha: TrilhaId; motivos: string[]; proximosPassos: string[] }
export interface Extras { cards: Card[]; quiz: Questao[] }
export interface Progresso { artigo?: boolean; cards?: boolean; quiz?: { acertos: number; total: number } | null }

export interface Estado {
  v: 2;
  perfil: { nome: string; uf: string; municipio: string };
  teste: { respostas: number[]; explicacao: Explicacao | null };
  trilhaId: TrilhaId | null;
  progresso: Record<string, Progresso>;
  xp: number;
  offline: Record<string, boolean>;
  certificado: { trilhaId: TrilhaId; data: string; nome: string } | null;
  vagasExtras: (Vaga & { empresa: string })[];
  eventos: Record<string, boolean>;
  orientacaoVista: boolean;
  extras: Record<string, Extras>;
}

function exemplo(): Estado {
  return {
    v: 2,
    perfil: { nome: "Clara", uf: "PE", municipio: "Recife" },
    teste: { respostas: [0, 0, 0, 1, 1, 2, 0, 0, 1, 1], explicacao: null },
    trilhaId: "A",
    progresso: { a1: { artigo: true, cards: true, quiz: { acertos: 2, total: 2 } }, a2: { artigo: true } },
    xp: 120,
    offline: {},
    certificado: null,
    vagasExtras: [],
    eventos: { e1: true },
    orientacaoVista: false,
    extras: {},
  };
}

function vazio(): Estado {
  return { ...exemplo(), perfil: { nome: "", uf: "", municipio: "" }, teste: { respostas: [], explicacao: null }, trilhaId: null, progresso: {}, xp: 0, eventos: {}, orientacaoVista: false };
}

let estado: Estado | null = null;
const ouvintes = new Set<() => void>();

function carregar(): Estado {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto) {
      const obj = JSON.parse(bruto) as Partial<Estado>;
      if (obj && obj.v === 2 && obj.perfil) return { ...vazio(), ...obj } as Estado;
    }
  } catch {
    /* sem armazenamento: segue com o exemplo em memória */
  }
  return exemplo();
}

function salvar(): void {
  try { if (estado) localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch { /* ignora */ }
}

function emitir(): void { ouvintes.forEach((f) => f()); }

export function obter(): Estado {
  if (!estado) estado = carregar();
  return estado;
}

/* Aplica uma alteração, salva e notifica. */
export function alterar(fn: (e: Estado) => void): void {
  const novo = structuredClone(obter());
  fn(novo);
  estado = novo;
  salvar();
  emitir();
}

export function restaurar(): void { estado = exemplo(); salvar(); emitir(); }
export function recomecar(): void { estado = vazio(); salvar(); emitir(); }

function inscrever(f: () => void): () => void {
  ouvintes.add(f);
  const aoArmazenar = (ev: StorageEvent) => { if (ev.key === CHAVE) { estado = carregar(); f(); } };
  window.addEventListener("storage", aoArmazenar);
  return () => { ouvintes.delete(f); window.removeEventListener("storage", aoArmazenar); };
}

/** Estado atual; null durante a pré-renderização e a hidratação. */
export function useEstado(): Estado | null {
  return useSyncExternalStore(inscrever, obter, () => null);
}

/* ---------- Regras ---------- */
export interface Resultado { pontos: Record<TrilhaId, number>; vencedora: TrilhaId; meta: number; offline: boolean; desempate: boolean }

export function calcularResultado(respostas: number[]): Resultado {
  const pontos: Record<TrilhaId, number> = { A: 0, D: 0, T: 0 };
  let meta = 30, offline = false;
  teste.forEach((p, i) => {
    const op = p.opcoes[respostas[i] ?? -1];
    if (!op) return;
    if (op.pontos) (Object.keys(op.pontos) as TrilhaId[]).forEach((k) => { pontos[k] += op.pontos?.[k] ?? 0; });
    if (op.meta) meta = op.meta;
    if (typeof op.offline === "boolean") offline = op.offline;
  });
  const max = Math.max(pontos.A, pontos.D, pontos.T);
  const empatadas = ordemTrilhas.filter((k) => pontos[k] === max);
  let vencedora: TrilhaId = empatadas[0] ?? "A";
  let desempate = false;
  if (empatadas.length > 1) {
    desempate = true;
    const op8 = teste[7]?.opcoes[respostas[7] ?? -1];
    const escolhida = op8?.pontos ? (Object.keys(op8.pontos)[0] as TrilhaId | undefined) : undefined;
    if (escolhida && empatadas.includes(escolhida)) vencedora = escolhida;
  }
  return { pontos, vencedora, meta, offline, desempate };
}

export function nivelDe(xp: number): { atual: Nivel; proximo: Nivel | null; pct: number } {
  let atual = niveis[0]!, proximo: Nivel | null = null;
  niveis.forEach((n, i) => { if (xp >= n.xp) { atual = n; proximo = niveis[i + 1] ?? null; } });
  const pct = proximo ? (xp - atual.xp) / ((proximo as Nivel).xp - atual.xp) : 1;
  return { atual, proximo, pct: Math.max(0, Math.min(1, pct)) };
}

export function progressoModulo(e: Estado, id: string) {
  const p = e.progresso[id] ?? {};
  const etapas = (p.artigo ? 1 : 0) + (p.cards ? 1 : 0) + (p.quiz ? 1 : 0);
  return { artigo: !!p.artigo, cards: !!p.cards, quiz: p.quiz ?? null, etapas, concluido: etapas === 3 };
}

export function trilhaAtual(e: Estado): Trilha | null { return e.trilhaId ? trilhas[e.trilhaId] : null; }

export function moduloLiberado(e: Estado, t: Trilha, idx: number): boolean {
  if (idx === 0) return true;
  const ant = t.modulos[idx - 1];
  return ant ? progressoModulo(e, ant.id).concluido : true;
}

export function trilhaConcluida(e: Estado): boolean {
  const t = trilhaAtual(e);
  return !!t && t.modulos.every((m) => progressoModulo(e, m.id).concluido);
}

/** Soma XP; devolve o novo nível se houve subida. */
export function ganharXp(qtd: number): Nivel | null {
  const antes = nivelDe(obter().xp).atual.n;
  alterar((e) => { e.xp += qtd; });
  const depois = nivelDe(obter().xp).atual;
  return depois.n > antes ? depois : null;
}

export function marcarEtapa(modId: string, etapa: keyof Progresso, valor: Progresso[keyof Progresso]): void {
  alterar((e) => {
    const p: Progresso = e.progresso[modId] ?? {};
    (p as Record<string, unknown>)[etapa] = valor;
    e.progresso[modId] = p;
  });
}

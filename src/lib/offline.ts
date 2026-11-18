"use client";
/* Offline real: o service worker guarda o app; aqui a usuária baixa módulos para a Cache Storage. */
import { useSyncExternalStore } from "react";
import { BASE } from "./base";

export const CACHE_MODULOS = "sofias-modulos-v1";

export function suportaOffline(): boolean {
  return typeof window !== "undefined" && "caches" in window && "serviceWorker" in navigator;
}

function urlsDoModulo(id: string): string[] {
  return [`${BASE}/modulo/${id}/`, `${BASE}/modulo/${id}/index.txt`];
}

/* Baixa a página do módulo, o payload de navegação e os scripts e estilos que ela usa. */
export async function baixarModulo(id: string, aoProgredir?: (pct: number) => void): Promise<void> {
  if (!suportaOffline()) throw new Error("Este navegador não permite guardar conteúdo offline.");
  const cache = await caches.open(CACHE_MODULOS);
  const [pagina, ...resto] = urlsDoModulo(id);
  const res = await fetch(pagina!, { cache: "no-cache" });
  if (!res.ok) throw new Error("Não foi possível baixar o módulo agora.");
  const html = await res.clone().text();
  await cache.put(pagina!, res);
  const assets = Array.from(new Set(Array.from(html.matchAll(/(?:src|href)="([^"]*\/_next\/static\/[^"]+)"/g)).map((m) => m[1]!)));
  const fila = [...resto, ...assets];
  let feitos = 0;
  for (const url of fila) {
    try {
      const r = await fetch(url);
      if (r.ok) await cache.put(url, r);
    } catch { /* um asset opcional não deve impedir o download */ }
    feitos++;
    aoProgredir?.(Math.round((feitos / fila.length) * 100));
  }
}

export async function removerModulo(id: string): Promise<void> {
  if (!suportaOffline()) return;
  const cache = await caches.open(CACHE_MODULOS);
  await Promise.all(urlsDoModulo(id).map((u) => cache.delete(u)));
}

function inscrever(f: () => void): () => void {
  window.addEventListener("online", f);
  window.addEventListener("offline", f);
  return () => { window.removeEventListener("online", f); window.removeEventListener("offline", f); };
}

/** true/false no navegador; true na pré-renderização. */
export function useOnline(): boolean {
  return useSyncExternalStore(inscrever, () => navigator.onLine, () => true);
}

export function registrarServiceWorker(): void {
  if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register(`${BASE}/sw.js`, { scope: `${BASE}/` }).catch(() => { /* sem SW, o app segue online */ });
}

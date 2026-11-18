/* API de localidades e malhas do IBGE (pública, sem chave, com CORS liberado). */
import { UFS } from "./empresas";

const RAIZ = "https://servicodados.ibge.gov.br/api";

export class ErroRede extends Error {}

async function buscarJSON<T>(url: string, ms = 12000): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new ErroRede(`O serviço do IBGE respondeu ${res.status}.`);
    return (await res.json()) as T;
  } catch (e) {
    if (e instanceof ErroRede) throw e;
    throw new ErroRede(ctrl.signal.aborted ? "O IBGE demorou para responder." : "Não foi possível falar com o IBGE.");
  } finally {
    clearTimeout(timer);
  }
}

export interface UFIbge { id: number; sigla: string; nome: string }

let cacheUFs: UFIbge[] | null = null;
export async function listarUFs(): Promise<{ ufs: UFIbge[]; reserva: boolean }> {
  if (cacheUFs) return { ufs: cacheUFs, reserva: false };
  try {
    const dados = await buscarJSON<UFIbge[]>(`${RAIZ}/v1/localidades/estados?orderBy=nome`);
    cacheUFs = dados.map((u) => ({ id: u.id, sigla: u.sigla, nome: u.nome }));
    return { ufs: cacheUFs, reserva: false };
  } catch {
    return { ufs: UFS.map((u) => ({ id: u.id, sigla: u.sigla, nome: u.nome })), reserva: true };
  }
}

const cacheMun = new Map<string, string[]>();
export async function listarMunicipios(uf: string): Promise<string[]> {
  const salvo = cacheMun.get(uf);
  if (salvo) return salvo;
  const dados = await buscarJSON<{ nome: string }[]>(`${RAIZ}/v1/localidades/estados/${encodeURIComponent(uf)}/municipios?orderBy=nome`);
  const nomes = dados.map((m) => m.nome);
  cacheMun.set(uf, nomes);
  return nomes;
}

export type Anel = [number, number][];
export interface FeatureUF { codarea: string; poligonos: Anel[][] }

let cacheMalha: FeatureUF[] | null = null;
interface GeoJSON { features: { properties: { codarea: string }; geometry: { type: "Polygon" | "MultiPolygon"; coordinates: unknown } }[] }

export async function carregarMalhaUF(): Promise<FeatureUF[]> {
  if (cacheMalha) return cacheMalha;
  const geo = await buscarJSON<GeoJSON>(`${RAIZ}/v3/malhas/paises/BR?intrarregiao=UF&formato=application/vnd.geo+json&qualidade=minima`, 20000);
  if (!geo || !Array.isArray(geo.features) || geo.features.length === 0) throw new ErroRede("A malha do IBGE veio vazia.");
  cacheMalha = geo.features.map((f) => ({
    codarea: String(f.properties.codarea),
    poligonos: f.geometry.type === "Polygon" ? [f.geometry.coordinates as Anel[]] : (f.geometry.coordinates as Anel[][]),
  }));
  return cacheMalha;
}

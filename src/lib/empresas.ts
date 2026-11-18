/* Dados fictícios do painel das empresas parceiras, gerados de forma determinística. */
import { trilhas, type TrilhaId } from "./conteudo";

export type Regiao = "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";
export const regioes: Regiao[] = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

/* Unidades da federação com o código do IBGE (usado para casar com a malha). Serve também de reserva se a API cair. */
export interface UF { id: number; sigla: string; nome: string; regiao: Regiao }
export const UFS: UF[] = [
  { id: 12, sigla: "AC", nome: "Acre", regiao: "Norte" },
  { id: 27, sigla: "AL", nome: "Alagoas", regiao: "Nordeste" },
  { id: 16, sigla: "AP", nome: "Amapá", regiao: "Norte" },
  { id: 13, sigla: "AM", nome: "Amazonas", regiao: "Norte" },
  { id: 29, sigla: "BA", nome: "Bahia", regiao: "Nordeste" },
  { id: 23, sigla: "CE", nome: "Ceará", regiao: "Nordeste" },
  { id: 53, sigla: "DF", nome: "Distrito Federal", regiao: "Centro-Oeste" },
  { id: 32, sigla: "ES", nome: "Espírito Santo", regiao: "Sudeste" },
  { id: 52, sigla: "GO", nome: "Goiás", regiao: "Centro-Oeste" },
  { id: 21, sigla: "MA", nome: "Maranhão", regiao: "Nordeste" },
  { id: 51, sigla: "MT", nome: "Mato Grosso", regiao: "Centro-Oeste" },
  { id: 50, sigla: "MS", nome: "Mato Grosso do Sul", regiao: "Centro-Oeste" },
  { id: 31, sigla: "MG", nome: "Minas Gerais", regiao: "Sudeste" },
  { id: 15, sigla: "PA", nome: "Pará", regiao: "Norte" },
  { id: 25, sigla: "PB", nome: "Paraíba", regiao: "Nordeste" },
  { id: 41, sigla: "PR", nome: "Paraná", regiao: "Sul" },
  { id: 26, sigla: "PE", nome: "Pernambuco", regiao: "Nordeste" },
  { id: 22, sigla: "PI", nome: "Piauí", regiao: "Nordeste" },
  { id: 33, sigla: "RJ", nome: "Rio de Janeiro", regiao: "Sudeste" },
  { id: 24, sigla: "RN", nome: "Rio Grande do Norte", regiao: "Nordeste" },
  { id: 43, sigla: "RS", nome: "Rio Grande do Sul", regiao: "Sul" },
  { id: 11, sigla: "RO", nome: "Rondônia", regiao: "Norte" },
  { id: 14, sigla: "RR", nome: "Roraima", regiao: "Norte" },
  { id: 42, sigla: "SC", nome: "Santa Catarina", regiao: "Sul" },
  { id: 35, sigla: "SP", nome: "São Paulo", regiao: "Sudeste" },
  { id: 28, sigla: "SE", nome: "Sergipe", regiao: "Nordeste" },
  { id: 17, sigla: "TO", nome: "Tocantins", regiao: "Norte" },
];

/* Peso aproximado de população jovem por UF, só para a distribuição fictícia parecer plausível. */
const PESO: Record<string, number> = { SP: 22, MG: 10, RJ: 8, BA: 7, PR: 5.5, RS: 5.2, PE: 4.6, CE: 4.4, PA: 4.2, SC: 3.6, MA: 3.4, GO: 3.4, AM: 2.1, ES: 1.9, PB: 1.9, RN: 1.7, AL: 1.6, MT: 1.7, PI: 1.6, DF: 1.5, MS: 1.3, SE: 1.1, RO: 0.8, TO: 0.7, AC: 0.4, AP: 0.4, RR: 0.3 };

function semente(n: number): () => number {
  let s = n | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface DadoUF { sigla: string; nome: string; regiao: Regiao; inscritas: number; ativas: number; aderencia: number }
export interface Jornada { id: string; uf: string; regiao: Regiao; etapa: string; concluiu: boolean; xp: number; acesso: string; dias: number }
export interface Vaga { cargo: string; cidade: string; modalidade: "Presencial" | "Híbrido" | "Remoto"; aptas: number }
export interface DadosEmpresa {
  trilhaId: TrilhaId;
  ultimos30: number[];
  meses: number[];
  minutosDia: number;
  duracaoDias: number;
  conclusao: number;
  porUF: DadoUF[];
  jornadas: Jornada[];
}
export interface Empresa { id: string; nome: string; setor: string; dados: DadosEmpresa; vagas: Vaga[] }

function gerar(trilhaId: TrilhaId, s: number, base: number): DadosEmpresa {
  const r = semente(s);
  const ultimos30: number[] = [];
  let v = base * 0.82;
  for (let i = 0; i < 30; i++) {
    const dia = (i + 3) % 7;
    const fds = dia === 0 || dia === 6 ? 0.93 : 1;
    v = v + base * 0.008 + (r() - 0.45) * base * 0.03;
    ultimos30.push(Math.round(v * fds));
  }
  const meses: number[] = [];
  let vm = base * 0.7;
  for (let k = 0; k < 7; k++) { vm = vm + base * 0.05 + (r() - 0.4) * base * 0.08; meses.push(Math.round(vm)); }
  const totalPeso = Object.values(PESO).reduce((a, b) => a + b, 0);
  const inscritasTotal = base * 2.4;
  const porUF: DadoUF[] = UFS.map((u) => {
    const inscritas = Math.max(8, Math.round((inscritasTotal * (PESO[u.sigla] ?? 1)) / totalPeso * (0.7 + r() * 0.6)));
    const aderencia = Math.round(34 + r() * 46);
    return { sigla: u.sigla, nome: u.nome, regiao: u.regiao, inscritas, ativas: Math.round((inscritas * aderencia) / 100), aderencia };
  });
  const modulos = trilhas[trilhaId].modulos;
  const acessos: [string, number][] = [["hoje", 0], ["hoje", 0], ["ontem", 1], ["há 2 dias", 2], ["há 3 dias", 3], ["há 5 dias", 5], ["há 8 dias", 8], ["há 12 dias", 12], ["há 20 dias", 20], ["há 26 dias", 26]];
  const cod = 4100 + Math.floor(r() * 800);
  const jornadas: Jornada[] = acessos.map(([acesso, dias], j) => {
    const m = Math.floor(r() * (modulos.length + 1));
    const uf = UFS[Math.floor(r() * UFS.length)] ?? UFS[0]!;
    const concluiu = m >= modulos.length;
    return { id: `Usuária #${cod + j * 37}`, uf: uf.sigla, regiao: uf.regiao, etapa: concluiu ? "Trilha concluída" : `Módulo ${m + 1} de ${modulos.length}`, concluiu, xp: Math.round(m * 95 + r() * 40), acesso, dias };
  });
  return {
    trilhaId,
    ultimos30,
    meses,
    minutosDia: Math.round(95 + r() * 60),
    duracaoDias: Math.round(17 + r() * 10),
    conclusao: Math.round(31 + r() * 18),
    porUF,
    jornadas,
  };
}

export const empresas: Empresa[] = [
  {
    id: "pontocerto", nome: trilhas.A.parceira, setor: "Varejo", dados: gerar("A", 11, 3100),
    vagas: [
      { cargo: "Atendente de loja", cidade: "Recife, PE", modalidade: "Presencial", aptas: 14 },
      { cargo: "Operadora de caixa", cidade: "Salvador, BA", modalidade: "Presencial", aptas: 9 },
      { cargo: "Vendedora interna", cidade: "Belo Horizonte, MG", modalidade: "Híbrido", aptas: 6 },
    ],
  },
  {
    id: "ipe", nome: trilhas.D.parceira, setor: "Serviços contábeis", dados: gerar("D", 23, 1900),
    vagas: [
      { cargo: "Auxiliar administrativa", cidade: "Goiânia, GO", modalidade: "Presencial", aptas: 8 },
      { cargo: "Assistente de contas a pagar", cidade: "Remoto", modalidade: "Remoto", aptas: 5 },
    ],
  },
  {
    id: "nuvemsul", nome: trilhas.T.parceira, setor: "Tecnologia", dados: gerar("T", 37, 2400),
    vagas: [
      { cargo: "Suporte técnico júnior", cidade: "Porto Alegre, RS", modalidade: "Híbrido", aptas: 11 },
      { cargo: "Help desk (1º nível)", cidade: "Remoto", modalidade: "Remoto", aptas: 7 },
      { cargo: "Técnica de campo", cidade: "Curitiba, PR", modalidade: "Presencial", aptas: 3 },
    ],
  },
];

export function regiaoDaUF(sigla: string): Regiao | null {
  return UFS.find((u) => u.sigla === sigla)?.regiao ?? null;
}

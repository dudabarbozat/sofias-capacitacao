/* Formatos de conteúdo listados em /conteudos/<formato>. */
import type { NomeIcone } from "@/components/Icone";

export const FORMATOS: Record<string, { nome: string; icone: NomeIcone }> = {
  podcasts: { nome: "Podcasts", icone: "podcast" },
  livros: { nome: "Livros e apostilas", icone: "livro" },
  artigos: { nome: "Artigos", icone: "artigo" },
  videos: { nome: "Vídeos", icone: "video" },
  eventos: { nome: "Eventos patrocinados", icone: "calendario" },
};

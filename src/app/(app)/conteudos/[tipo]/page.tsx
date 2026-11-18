import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Conteudos } from "@/components/telas/Conteudos";
import { FORMATOS } from "@/lib/formatos";

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(FORMATOS).map((tipo) => ({ tipo }));
}

export async function generateMetadata({ params }: { params: Promise<{ tipo: string }> }): Promise<Metadata> {
  const { tipo } = await params;
  return { title: FORMATOS[tipo]?.nome ?? "Conteúdos" };
}

export default async function Pagina({ params }: { params: Promise<{ tipo: string }> }) {
  const { tipo } = await params;
  if (!FORMATOS[tipo]) notFound();
  return <Conteudos tipo={tipo} />;
}

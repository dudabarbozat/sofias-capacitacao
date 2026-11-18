import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModuloTela } from "@/components/telas/ModuloTela";
import { acharModulo, todosModulos } from "@/lib/conteudo";

export const dynamicParams = false;
export function generateStaticParams() {
  return todosModulos().map((x) => ({ id: x.m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: acharModulo(id)?.m.titulo ?? "Módulo" };
}

export default async function Pagina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!acharModulo(id)) notFound();
  return <ModuloTela id={id} />;
}

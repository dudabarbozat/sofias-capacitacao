"use client";
/* Página servida pelo service worker quando não há internet e a página pedida não foi baixada. */
import Link from "next/link";
import { Icone } from "../Icone";
import { acharModulo } from "@/lib/conteudo";
import { useEstado } from "@/lib/estado";

export function SemInternet() {
  const estado = useEstado();
  const baixados = estado ? Object.keys(estado.offline).map((id) => acharModulo(id)).filter((x) => !!x) : [];
  return (
    <section className="tela">
      <h1 className="titulo">Você está sem internet</h1>
      <p className="lead">Esta página não foi baixada. Os módulos salvos no aparelho continuam disponíveis.</p>
      {baixados.length ? (
        <ul className="lista-conteudo">
          {baixados.map((x) => (
            <li key={x!.m.id}><Link href={`/modulo/${x!.m.id}/`}><span className="lista-conteudo__ic"><Icone nome="offline" /></span><span className="lista-conteudo__txt"><strong>{x!.m.titulo}</strong><small>{x!.t.nome}</small></span><Icone nome="chevron" /></Link></li>
          ))}
        </ul>
      ) : <p className="estado-vazio">Nenhum módulo baixado ainda. Quando tiver internet, use "baixar" na tela de estudos.</p>}
    </section>
  );
}

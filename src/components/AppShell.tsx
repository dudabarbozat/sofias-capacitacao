"use client";
/* Moldura do app da usuária: topo, conteúdo, barra inferior e rodapé da demo. */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { Icone, type NomeIcone } from "./Icone";
import { useAviso } from "./Aviso";
import { caminho } from "@/lib/base";
import { recomecar, restaurar, useEstado } from "@/lib/estado";
import { registrarServiceWorker, useOnline } from "@/lib/offline";
import s from "./AppShell.module.css";

const ABAS: { href: string; rotulo: string; icone: NomeIcone; ativo: (p: string) => boolean }[] = [
  { href: "/", rotulo: "início", icone: "casa", ativo: (p) => p === "/" || p.startsWith("/conteudos") || p.startsWith("/teste") || p.startsWith("/resultado") },
  { href: "/estudos/", rotulo: "estudos", icone: "livro", ativo: (p) => p.startsWith("/estudos") || p.startsWith("/modulo") },
  { href: "/certificado/", rotulo: "certificado", icone: "marcador", ativo: (p) => p.startsWith("/certificado") },
];

export function AppShell({ children }: { children: ReactNode }) {
  const estado = useEstado();
  const online = useOnline();
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const avisar = useAviso();
  const menu = useRef<HTMLDetailsElement>(null);
  const semConta = !!estado && !estado.perfil.nome;

  useEffect(() => { registrarServiceWorker(); }, []);
  useEffect(() => { if (menu.current) menu.current.open = false; }, [pathname]);
  useEffect(() => {
    const fechar = (ev: MouseEvent) => { if (menu.current?.open && !menu.current.contains(ev.target as Node)) menu.current.open = false; };
    document.addEventListener("click", fechar);
    return () => document.removeEventListener("click", fechar);
  }, []);

  const baixados = estado ? Object.keys(estado.offline).length : 0;

  return (
    <>
      <a className="pular" href="#conteudo">Pular para o conteúdo</a>
      <aside className={s.lateral} aria-label="Sobre o protótipo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={caminho("/img/logo-sofias.png")} alt="Sofias" width={942} height={776} className={s.lateralLogo} />
        <p>PWA de capacitação online e offline para jovens mulheres, com teste vocacional, trilha gamificada, certificado e painel para empresas parceiras.</p>
        <p><b>Para quem é:</b> jovens mulheres de 15 a 25 anos fora da escola e do mercado de trabalho, e empresas que buscam candidatas.</p>
        <ul className={s.lateralLista}>
          <li><Icone nome="teste" /><span><b>Teste vocacional</b> com a área recomendada.</span></li>
          <li><Icone nome="trilha" /><span><b>Trilha gamificada</b> com níveis e XP.</span></li>
          <li><Icone nome="offline" /><span><b>Uso offline:</b> app instalável e módulos baixados.</span></li>
          <li><Icone nome="certificado" /><span><b>Certificado</b> com código de verificação.</span></li>
        </ul>
        <div className={s.lateralLinks}>
          <a className="botao botao--primario" href="https://github.com/dudabarbozat/sofias-capacitacao" target="_blank" rel="noreferrer"><Icone nome="github" />Ver o código no GitHub</a>
          <Link className="botao botao--fantasma" href="/empresa/"><Icone nome="empresa" />Painel da empresa</Link>
        </div>
        <p className={s.lateralNota}>Projeto de pitch em equipe, reconstruído em 2026 como protótipo navegável.</p>
      </aside>
      <div className={s.app}>
        <header className={s.topo}>
          <Link className={s.logo} href="/" aria-label="Sofias, início">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={caminho("/img/simbolo-sofias.png")} alt="" width={30} height={35} />
          </Link>
          <div className={s.acoes}>
            {estado && !semConta && (
              <span className={online ? s.status : `${s.status} ${s.statusOff}`} title={online ? `${baixados} módulo(s) baixado(s)` : "Sem internet: só os módulos baixados abrem"}>
                <Icone nome={online ? "offline" : "semRede"} />
                <span>{online ? `${baixados} offline` : "sem internet"}</span>
              </span>
            )}
            <details className={s.menu} ref={menu}>
              <summary aria-label="Menu da conta"><Icone nome="usuario" /></summary>
              <div className={s.menuLista}>
                <p className={s.menuNome}>{estado?.perfil.nome ? `Olá, ${estado.perfil.nome}` : "Sem conta"}</p>
                <Link href="/teste/"><Icone nome="teste" />Refazer o teste</Link>
                <Link href="/empresa/"><Icone nome="empresa" />Painel da empresa</Link>
                <button type="button" onClick={() => {
                  if (!confirm("Apagar seu progresso e começar do zero?")) return;
                  recomecar(); router.push("/");
                }}><Icone nome="restaurar" />Começar do zero</button>
              </div>
            </details>
          </div>
        </header>

        {!online && (
          <p className={s.faixaOffline} role="status"><Icone nome="semRede" />Você está sem internet. Os módulos baixados continuam disponíveis.</p>
        )}

        <main id="conteudo" tabIndex={-1} className={s.main}>{children}</main>

        {!semConta && (
          <nav className={s.abas} aria-label="Navegação principal">
            {ABAS.map((a) => {
              const ativo = a.ativo(pathname);
              return (
                <Link key={a.href} href={a.href} aria-current={ativo ? "page" : undefined} className={ativo ? s.abaAtiva : undefined}>
                  <Icone nome={a.icone} />
                  <span className={ativo ? undefined : "sr-only"}>{a.rotulo}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
      <footer className="rodape-demo">
        <span>Protótipo com dados fictícios.</span>
        <Link href="/empresa/" className="link">Painel da empresa</Link>
        <button type="button" className="link" onClick={() => {
          if (!confirm("Restaurar os dados de exemplo? Seu progresso na demo será substituído.")) return;
          restaurar(); avisar("Dados de exemplo restaurados."); router.push("/");
        }}>Restaurar dados de exemplo</button>
      </footer>
    </>
  );
}

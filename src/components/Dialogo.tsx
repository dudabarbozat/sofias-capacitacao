"use client";
/* Diálogo modal nativo: o navegador prende o foco e o Esc fecha. */
import { useEffect, useRef, type ReactNode } from "react";

export function Dialogo({ aberto, aoFechar, titulo, children, idTitulo = "dialogo-titulo" }: { aberto: boolean; aoFechar: () => void; titulo: string; children: ReactNode; idTitulo?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (aberto && !d.open) d.showModal();
    if (!aberto && d.open) d.close();
  }, [aberto]);
  return (
    <dialog ref={ref} className="folha" aria-labelledby={idTitulo} onCancel={(e) => { e.preventDefault(); aoFechar(); }} onClose={aoFechar}
      onClick={(e) => { if (e.target === ref.current) aoFechar(); }}>
      <div className="folha__corpo">
        <div className="folha__cab">
          <h2 className="subtitulo" id={idTitulo}>{titulo}</h2>
          <button type="button" className="folha__fechar" onClick={aoFechar} aria-label="Fechar">
            <svg className="ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}

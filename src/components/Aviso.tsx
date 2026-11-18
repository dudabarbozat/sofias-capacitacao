"use client";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type Tipo = "padrao" | "destaque" | "erro";
interface Item { id: number; texto: string; tipo: Tipo }
const Ctx = createContext<(texto: string, tipo?: Tipo) => void>(() => {});

export function useAviso() { return useContext(Ctx); }

export function AvisoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<Item[]>([]);
  const avisar = useCallback((texto: string, tipo: Tipo = "padrao") => {
    const id = Date.now() + Math.random();
    setItens((l) => [...l.slice(-2), { id, texto, tipo }]);
    setTimeout(() => setItens((l) => l.filter((i) => i.id !== id)), 3200);
  }, []);
  return (
    <Ctx.Provider value={avisar}>
      {children}
      <div className="avisos" role="status" aria-live="polite">
        {itens.map((i) => <div key={i.id} className={`aviso aviso--${i.tipo}`}>{i.texto}</div>)}
      </div>
    </Ctx.Provider>
  );
}

/* Esqueleto exibido enquanto o estado salvo no navegador é lido. */
export function Carregando({ rotulo = "Carregando" }: { rotulo?: string }) {
  return (
    <div className="tela" role="status" aria-label={rotulo}>
      <span className="esqueleto" style={{ width: "55%", height: 34, margin: "12px 0 20px" }} />
      <span className="esqueleto" style={{ height: 54, marginBottom: 22 }} />
      <span className="esqueleto" style={{ width: "40%", height: 22, marginBottom: 14 }} />
      <div style={{ display: "flex", gap: 10 }}>
        <span className="esqueleto" style={{ width: 116, height: 146 }} />
        <span className="esqueleto" style={{ width: 116, height: 146 }} />
        <span className="esqueleto" style={{ width: 116, height: 146 }} />
      </div>
    </div>
  );
}

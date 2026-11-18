/* Exportação CSV no formato que o Excel em português abre direto (separador ";" e BOM UTF-8). */
export function paraCSV(cabecalho: string[], linhas: (string | number)[][]): string {
  const cel = (v: string | number) => {
    const s = String(v);
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cabecalho, ...linhas].map((l) => l.map(cel).join(";")).join("\r\n");
}

export function baixarCSV(nome: string, cabecalho: string[], linhas: (string | number)[][]): void {
  const blob = new Blob(["﻿" + paraCSV(cabecalho, linhas)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

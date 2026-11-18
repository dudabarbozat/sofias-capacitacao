/* Prefixo de publicação (GitHub Pages usa /<repo>). Todo caminho de asset passa por aqui. */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function caminho(p: string): string {
  return `${BASE}${p.startsWith("/") ? p : `/${p}`}`;
}

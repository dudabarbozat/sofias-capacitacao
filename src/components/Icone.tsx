/* Ícones e ilustrações em SVG inline (traço 1.8, cantos arredondados). */
const ICONES = {
  inicio: '<path d="M4 11.5 12 5l8 6.5"/><path d="M6.5 10v9h11v-9"/>',
  teste: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5h6v2.5H9z"/><path d="m9 13 2 2 4-4"/>',
  trilha: '<path d="M5 19c0-4 3-4 7-4s7 0 7-4-3-4-7-4"/><circle cx="5" cy="19" r="1.6"/><circle cx="12" cy="7" r="1.6"/>',
  certificado: '<rect x="3.5" y="5" width="17" height="12" rx="1.5"/><path d="M7 9h10M7 12.5h6"/><path d="m15 15 0 5 2-1.2 2 1.2v-5"/>',
  empresa: '<path d="M4 20V8l6-3v15"/><path d="M10 20V10h10v10"/><path d="M13 13h1M16.5 13h1M13 16.5h1M16.5 16.5h1M3 20h18"/>',
  voltar: '<path d="M15 5 8 12l7 7"/>',
  seta: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  cadeado: '<rect x="5.5" y="10.5" width="13" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  baixar: '<path d="M12 4v11M7 10.5l5 5 5-5"/><path d="M5 19.5h14"/>',
  offline: '<path d="M12 4v10M8 10l4 4 4-4"/><path d="M5 17.5c0 1.4 1.1 2.5 2.5 2.5h9c1.4 0 2.5-1.1 2.5-2.5"/>',
  semRede: '<path d="M3 3l18 18"/><path d="M8.5 16.2a5 5 0 0 1 7 0M5 12.6a10 10 0 0 1 4-2.3M19 12.6a10 10 0 0 0-3.2-2M2 9a15 15 0 0 1 5-2.9M22 9a15 15 0 0 0-9.5-3.8"/><circle cx="12" cy="19.5" r=".6" fill="currentColor"/>',
  play: '<path d="M8 5.5v13l10.5-6.5z"/>',
  pausa: '<path d="M8.5 5.5v13M15.5 5.5v13"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10.5 5-3v9l-5-3"/>',
  podcast: '<rect x="9" y="3.5" width="6" height="10" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
  artigo: '<path d="M6 3.5h8.5L18 7v13.5H6z"/><path d="M9 11h6M9 14.5h6M9 18h4"/>',
  cartas: '<rect x="3.5" y="7" width="12" height="13" rx="2"/><path d="M8.5 7V5.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-3"/>',
  quiz: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2-2.4 3.5"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
  estrela: '<path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.4l-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z"/>',
  relogio: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  imprimir: '<path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="7" rx="1.5"/><path d="M7 14h10v6H7z"/>',
  restaurar: '<path d="M4.5 12a7.5 7.5 0 1 0 2.3-5.4"/><path d="M4.5 4.5v4h4"/>',
  mapa: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  mais: '<path d="M12 5v14M5 12h14"/>',
  usuarias: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0"/><path d="M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17.5 14.3a5.5 5.5 0 0 1 3 5.2"/>',
  vaga: '<rect x="3.5" y="7.5" width="17" height="12" rx="2"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 12.5h17"/>',
  fechar: '<path d="M6 6l12 12M18 6 6 18"/>',
  lupa: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
  usuario: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
  prancheta: '<rect x="5.5" y="4.5" width="13" height="16" rx="2.5"/><path d="M9 4.5V3.5h6v1"/>',
  pranchetaOk: '<rect x="5.5" y="4.5" width="13" height="16" rx="2.5"/><path d="M9 4.5V3.5h6v1"/><path d="m9 12.5 2.2 2.2 4-4.2"/>',
  calendario: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  casa: '<path d="M4.5 10.5 12 4l7.5 6.5V20h-5v-6h-5v6h-5z"/>',
  livro: '<path d="M12 6.5C10 5 7 4.5 3.5 4.8v13.5c3.5-.3 6.5.2 8.5 1.7 2-1.5 5-2 8.5-1.7V4.8C17 4.5 14 5 12 6.5z"/><path d="M12 6.5V20"/>',
  marcador: '<path d="M6.5 3.5h11v17L12 16.5l-5.5 4z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  local: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><circle cx="12" cy="7.8" r=".7" fill="currentColor"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  chevronBaixo: '<path d="m6 9 6 6 6-6"/>',
  painel: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  pizza: '<path d="M12 3.5v8.5h8.5A8.5 8.5 0 1 1 12 3.5z"/><path d="M15 3.9A8.5 8.5 0 0 1 20.1 9H15z"/>',
  globo: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"/>',
  conversa: '<path d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8.5A1.5 1.5 0 0 1 19 17H10l-4.5 3.5V17H5a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 5 5.5z"/>',
  filtro: '<path d="M4 5h16l-6.2 7.4V19l-3.6-1.8v-4.8z"/>',
  alerta: '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.5"/><circle cx="12" cy="17" r=".6" fill="currentColor"/>',
  wifi: '<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.3a9.5 9.5 0 0 1 13 0M8.6 15.6a5 5 0 0 1 6.8 0"/><circle cx="12" cy="19" r=".8" fill="currentColor"/>',
  lixo: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
} as const;

export type NomeIcone = keyof typeof ICONES;

export function Icone({ nome, className, tamanho }: { nome: NomeIcone; className?: string; tamanho?: number }) {
  return (
    <svg
      className={className ? `ic ${className}` : "ic"}
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: ICONES[nome] }}
    />
  );
}

const ILUSTRACOES = {
  lampada: '<circle cx="62" cy="36" r="24" fill="#ffc759"/><path d="M54 62h16v8H54zM56 72h12v5H56z" fill="#a699b4"/><path d="M55 44c0-6 3.5-9 7-9s7 3 7 9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M62 35v-9" stroke="#fff" stroke-width="3" stroke-linecap="round"/><rect x="10" y="44" width="30" height="22" rx="5" fill="#fff"/><path d="M17 60V54M24 60V50M31 60V56" stroke="#7231b8" stroke-width="3" stroke-linecap="round"/><circle cx="88" cy="16" r="5" fill="#ebe2fe"/>',
  conversa: '<rect x="8" y="14" width="46" height="30" rx="8" fill="#fff"/><path d="M18 44l-4 10 14-10z" fill="#fff"/><circle cx="22" cy="29" r="3" fill="#7231b8"/><circle cx="31" cy="29" r="3" fill="#7231b8"/><circle cx="40" cy="29" r="3" fill="#7231b8"/><rect x="46" y="40" width="44" height="26" rx="8" fill="#ffc759"/><path d="M80 66l6 9-14-9z" fill="#ffc759"/><path d="M55 50h26M55 57h16" stroke="#310f55" stroke-width="3" stroke-linecap="round"/>',
  grafico: '<rect x="10" y="12" width="60" height="50" rx="6" fill="#fff"/><path d="M22 52V38M34 52V28M46 52V34M58 52V22" stroke="#7231b8" stroke-width="6" stroke-linecap="round"/><circle cx="78" cy="58" r="18" fill="#a699b4"/><path d="M78 58V40a18 18 0 0 1 18 18z" fill="#ffc759"/>',
  blocos: '<rect x="10" y="30" width="26" height="26" rx="5" fill="#a699b4"/><rect x="40" y="16" width="26" height="26" rx="5" fill="#ffc759"/><rect x="40" y="46" width="26" height="26" rx="5" fill="#fff"/><rect x="70" y="38" width="22" height="22" rx="5" fill="#ebe2fe"/><text x="23" y="49" font-family="Montserrat,sans-serif" font-weight="700" font-size="15" fill="#fff" text-anchor="middle">A</text><text x="53" y="35" font-family="Montserrat,sans-serif" font-weight="700" font-size="15" fill="#310f55" text-anchor="middle">B</text><text x="53" y="65" font-family="Montserrat,sans-serif" font-weight="700" font-size="15" fill="#7231b8" text-anchor="middle">C</text><text x="81" y="54" font-family="Montserrat,sans-serif" font-weight="700" font-size="13" fill="#7231b8" text-anchor="middle">D</text>',
  engrenagem: '<g fill="#a699b4"><rect x="33.5" y="18.8" width="9" height="10.8" rx="1.5" transform="rotate(0 38 46)"/><rect x="33.5" y="18.8" width="9" height="10.8" rx="1.5" transform="rotate(45 38 46)"/><rect x="33.5" y="18.8" width="9" height="10.8" rx="1.5" transform="rotate(90 38 46)"/><rect x="33.5" y="18.8" width="9" height="10.8" rx="1.5" transform="rotate(135 38 46)"/><rect x="33.5" y="18.8" width="9" height="10.8" rx="1.5" transform="rotate(180 38 46)"/><rect x="33.5" y="18.8" width="9" height="10.8" rx="1.5" transform="rotate(225 38 46)"/><rect x="33.5" y="18.8" width="9" height="10.8" rx="1.5" transform="rotate(270 38 46)"/><rect x="33.5" y="18.8" width="9" height="10.8" rx="1.5" transform="rotate(315 38 46)"/><circle cx="38" cy="46" r="20"/></g><circle cx="38" cy="46" r="8" fill="#7231b8"/><g fill="#ffc759"><rect x="73" y="8.2" width="6" height="7.2" rx="1.5" transform="rotate(0 76 24)"/><rect x="73" y="8.2" width="6" height="7.2" rx="1.5" transform="rotate(45 76 24)"/><rect x="73" y="8.2" width="6" height="7.2" rx="1.5" transform="rotate(90 76 24)"/><rect x="73" y="8.2" width="6" height="7.2" rx="1.5" transform="rotate(135 76 24)"/><rect x="73" y="8.2" width="6" height="7.2" rx="1.5" transform="rotate(180 76 24)"/><rect x="73" y="8.2" width="6" height="7.2" rx="1.5" transform="rotate(225 76 24)"/><rect x="73" y="8.2" width="6" height="7.2" rx="1.5" transform="rotate(270 76 24)"/><rect x="73" y="8.2" width="6" height="7.2" rx="1.5" transform="rotate(315 76 24)"/><circle cx="76" cy="24" r="11"/></g><circle cx="76" cy="24" r="4.4" fill="#7231b8"/><circle cx="86" cy="64" r="5" fill="#fff"/>',
  escudo: '<path d="M50 10l30 10v20c0 18-13 30-30 36-17-6-30-18-30-36V20z" fill="#fff"/><path d="m37 42 9 9 18-19" stroke="#7231b8" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="86" cy="64" r="9" fill="#ffc759"/><circle cx="14" cy="66" r="5" fill="#a699b4"/>',
} as const;

export type NomeIlustracao = keyof typeof ILUSTRACOES;

export function Ilustracao({ nome, className }: { nome: NomeIlustracao; className?: string }) {
  return <svg className={className} viewBox="0 0 100 82" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: ILUSTRACOES[nome] }} />;
}

"use client";
/* Linha de usuárias ativas (mockup "Visão atual"), com marcador amarelo e linha guia tracejada. */
import { useEffect, useMemo, useRef } from "react";
import { CategoryScale, Chart as ChartJS, Filler, LinearScale, LineElement, PointElement, Tooltip, type Chart, type Plugin } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const guia: Plugin<"line"> = {
  id: "guia",
  afterDatasetsDraw(c) {
    const at = c.tooltip?.getActiveElements() ?? [];
    const p = at[0]?.element;
    if (!p) return;
    const ctx = c.ctx;
    ctx.save();
    ctx.setLineDash([3, 3]); ctx.strokeStyle = "#17003d"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, c.chartArea.bottom); ctx.stroke();
    ctx.setLineDash([]); ctx.fillStyle = "#ffc346"; ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.restore();
  },
};

const fmt = (n: number) => n.toLocaleString("pt-BR");

export function GraficoVisao({ rotulos, valores, descricao }: { rotulos: string[]; valores: number[]; descricao: string }) {
  const ref = useRef<Chart<"line"> | null>(null);
  const fontes = useMemo(() => {
    if (typeof window === "undefined") return { poppins: "sans-serif", montserrat: "sans-serif" };
    const cs = getComputedStyle(document.documentElement);
    return { poppins: cs.getPropertyValue("--font-poppins").trim() || "sans-serif", montserrat: cs.getPropertyValue("--font-montserrat").trim() || "sans-serif" };
  }, []);
  const min = Math.min(...valores), max = Math.max(...valores);

  useEffect(() => {
    const g = ref.current;
    if (!g) return;
    const idx = valores.length - 1;
    const pt = g.getDatasetMeta(0).data[idx];
    if (!pt) return;
    g.setActiveElements([{ datasetIndex: 0, index: idx }]);
    g.tooltip?.setActiveElements([{ datasetIndex: 0, index: idx }], { x: pt.x, y: pt.y });
    g.update("none");
  }, [valores]);

  return (
    <Line
      ref={ref}
      aria-label={descricao}
      role="img"
      data={{ labels: rotulos, datasets: [{ data: valores, borderColor: "#17003d", borderWidth: 3, tension: 0.42, pointRadius: 0, pointHitRadius: 12, fill: true, backgroundColor: "rgba(124, 79, 179, 0.07)" }] }}
      plugins={[guia]}
      options={{
        maintainAspectRatio: false,
        animation: false,
        interaction: { mode: "index", intersect: false },
        layout: { padding: { top: 70 } },
        plugins: {
          tooltip: {
            backgroundColor: "#ffffff", titleColor: "#5d5470", bodyColor: "#17003d", borderColor: "rgba(23,0,61,.06)", borderWidth: 1,
            titleFont: { family: fontes.poppins, size: 11, weight: 500 }, bodyFont: { family: fontes.poppins, size: 15, weight: 600 },
            padding: 12, cornerRadius: 10, displayColors: false, caretSize: 0, yAlign: "bottom",
            callbacks: { label: (c) => `${fmt(c.parsed.y ?? 0)} usuárias ativas` },
          },
        },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { color: "#4e138b", font: { family: fontes.montserrat, weight: 700, size: 11 }, maxRotation: 0, autoSkipPadding: 18 } },
          y: {
            suggestedMin: Math.floor((min * 0.6) / 1000) * 1000, suggestedMax: Math.ceil((max * 1.1) / 1000) * 1000,
            grid: { color: "rgba(78, 19, 139, 0.12)" }, border: { display: false },
            ticks: { color: "#4e138b", font: { family: fontes.montserrat, weight: 700, size: 11 }, maxTicksLimit: 5, callback: (v) => (Number(v) >= 1000 ? `${(Number(v) / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil` : String(v)) },
          },
        },
      }}
    />
  );
}

"use client";
/* Tela "Escolha uma área para criar conta" (mockup do pitch) com cadastro e localização reais do IBGE. */
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { Icone, Ilustracao } from "../Icone";
import { Dialogo } from "../Dialogo";
import { useAviso } from "../Aviso";
import { ilustracaoArea, ordemTrilhas, trilhas, type TrilhaId } from "@/lib/conteudo";
import { alterar, restaurar, type Estado } from "@/lib/estado";
import { listarMunicipios, listarUFs, type UFIbge } from "@/lib/ibge";

type Destino = TrilhaId | "teste" | null;

export function Cadastro({ estado }: { estado: Estado }) {
  const router = useRouter();
  const avisar = useAviso();
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const [destino, setDestino] = useState<Destino>(null);

  const areas = useMemo(() => ordemTrilhas.filter((k) => {
    const q = busca.trim().toLowerCase();
    return !q || `${trilhas[k].nome} ${trilhas[k].descricao}`.toLowerCase().includes(q);
  }), [busca]);

  function abrir(d: Destino) { setDestino(d); setAberto(true); }

  return (
    <section className="tela tela--cadastro">
      <p className="ja-tem-conta">Já tem conta? <button type="button" className="link-forte" onClick={() => { restaurar(); avisar("Entrou com a conta de exemplo."); }}>acessar</button></p>
      <h1 className="titulo">Escolha uma área para criar conta</h1>
      <form className="busca" role="search" onSubmit={(e) => e.preventDefault()}>
        <label className="sr-only" htmlFor="busca-area">Procurar por áreas</label>
        <span className="busca__campo"><Icone nome="lupa" /><input id="busca-area" type="search" placeholder="procurar por áreas..." autoComplete="off" value={busca} onChange={(e) => setBusca(e.target.value)} /></span>
        <button type="submit" className="busca__botao" aria-label="Procurar"><Icone nome="seta" /></button>
      </form>
      <div className="carrossel" aria-live="polite">
        {areas.map((k) => (
          <button key={k} type="button" className="card-roxo card-roxo--area" onClick={() => abrir(k)}>
            <span className="card-roxo__txt">{trilhas[k].nome}</span>
            <Ilustracao nome={ilustracaoArea[k]} className="ilus" />
          </button>
        ))}
      </div>
      {areas.length === 0 && <p className="estado-vazio">Nenhuma área com esse termo. Tente "vendas", "planilhas" ou "suporte".</p>}

      <button type="button" className="card-teste" onClick={() => abrir("teste")}>
        <span><strong>Em dúvida?</strong><small>Faça um teste</small></span>
        <Ilustracao nome="engrenagem" className="ilus" />
      </button>

      <button type="button" className="barra-local barra-local--botao" onClick={() => abrir(null)}>
        <span className="barra-local__ic"><Icone nome="local" /></span>
        <span className="barra-local__txt">
          <strong>Escolha a sua localização</strong>
          <small>{estado.perfil.municipio ? `${estado.perfil.municipio}, ${estado.perfil.uf}` : "vamos oferecer conteúdos melhores para você"}</small>
        </span>
        <span className="barra-local__seta"><Icone nome="chevron" /></span>
      </button>

      <Dialogo aberto={aberto} aoFechar={() => setAberto(false)} titulo="Criar conta" idTitulo="titulo-cadastro">
        {aberto && (
          <FormCadastro
            destino={destino}
            aoConcluir={(dados) => {
              alterar((e) => {
                e.perfil = dados;
                if (destino && destino !== "teste") { e.trilhaId = destino; e.certificado = null; }
              });
              setAberto(false);
              router.push(destino === "teste" || destino === null ? "/teste/" : "/estudos/");
            }}
          />
        )}
      </Dialogo>
    </section>
  );
}

function FormCadastro({ destino, aoConcluir }: { destino: Destino; aoConcluir: (d: { nome: string; uf: string; municipio: string }) => void }) {
  const id = useId();
  const [nome, setNome] = useState("");
  const [uf, setUf] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [ufs, setUfs] = useState<UFIbge[] | null>(null);
  const [reserva, setReserva] = useState(false);
  const [municipios, setMunicipios] = useState<string[] | null>(null);
  const [estadoMun, setEstadoMun] = useState<"ocioso" | "carregando" | "erro" | "ok">("ocioso");
  const [tentativa, setTentativa] = useState(0);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [tocado, setTocado] = useState(false);

  useEffect(() => { listarUFs().then((r) => { setUfs(r.ufs); setReserva(r.reserva); }); }, []);

  useEffect(() => {
    if (!uf) { setMunicipios(null); setEstadoMun("ocioso"); return; }
    let vivo = true;
    setEstadoMun("carregando");
    listarMunicipios(uf)
      .then((l) => { if (vivo) { setMunicipios(l); setEstadoMun("ok"); } })
      .catch(() => { if (vivo) { setMunicipios(null); setEstadoMun("erro"); } });
    return () => { vivo = false; };
  }, [uf, tentativa]);

  function validar(): Record<string, string> {
    const e: Record<string, string> = {};
    if (nome.trim().length < 2) e.nome = "Escreva como quer ser chamada (pelo menos 2 letras).";
    if (!uf) e.uf = "Escolha o estado.";
    if (!municipio.trim()) e.municipio = "Escolha o município.";
    else if (municipios && !municipios.some((m) => m.toLowerCase() === municipio.trim().toLowerCase())) e.municipio = "Escolha um município da lista.";
    return e;
  }

  useEffect(() => { if (tocado) setErros(validar()); }, [nome, uf, municipio, municipios]); // eslint-disable-line react-hooks/exhaustive-deps

  const contexto = destino === "teste" || destino === null ? "Depois do cadastro você faz o teste vocacional (3 minutos)." : `Área escolhida: ${trilhas[destino].nome}.`;

  return (
    <form noValidate onSubmit={(ev) => {
      ev.preventDefault();
      setTocado(true);
      const e = validar();
      setErros(e);
      if (Object.keys(e).length) {
        const primeiro = Object.keys(e)[0];
        document.getElementById(`${id}-${primeiro}`)?.focus();
        return;
      }
      const certo = municipios?.find((m) => m.toLowerCase() === municipio.trim().toLowerCase()) ?? municipio.trim();
      aoConcluir({ nome: nome.trim(), uf, municipio: certo });
    }}>
      <p className="nota" style={{ marginTop: 0 }}>{contexto}</p>
      <div className={`campo${erros.nome ? " campo--erro" : ""}`} style={{ marginTop: 12 }}>
        <label htmlFor={`${id}-nome`}>Como você quer ser chamada?</label>
        <input id={`${id}-nome`} autoComplete="given-name" maxLength={40} value={nome} onChange={(e) => setNome(e.target.value)} onBlur={() => setTocado(true)}
          aria-invalid={!!erros.nome} aria-describedby={erros.nome ? `${id}-erro-nome` : undefined} />
        {erros.nome && <p className="erro" id={`${id}-erro-nome`}>{erros.nome}</p>}
      </div>
      <div className={`campo${erros.uf ? " campo--erro" : ""}`}>
        <label htmlFor={`${id}-uf`}>Estado</label>
        {ufs === null ? (
          <span className="esqueleto" style={{ height: 48 }} aria-label="Carregando estados do IBGE" role="status" />
        ) : (
          <select id={`${id}-uf`} value={uf} onChange={(e) => { setUf(e.target.value); setMunicipio(""); }} aria-invalid={!!erros.uf} aria-describedby={`${id}-fonte-uf${erros.uf ? ` ${id}-erro-uf` : ""}`}>
            <option value="">Selecione</option>
            {ufs.map((u) => <option key={u.sigla} value={u.sigla}>{u.nome}</option>)}
          </select>
        )}
        <p className="campo__dica" id={`${id}-fonte-uf`}>{reserva ? "IBGE indisponível: usando a lista de estados guardada no app." : "Lista oficial do IBGE."}</p>
        {erros.uf && <p className="erro" id={`${id}-erro-uf`}>{erros.uf}</p>}
      </div>
      <div className={`campo${erros.municipio ? " campo--erro" : ""}`}>
        <label htmlFor={`${id}-municipio`}>Município</label>
        <input id={`${id}-municipio`} list={`${id}-lista-mun`} autoComplete="off" value={municipio} onChange={(e) => setMunicipio(e.target.value)}
          disabled={!uf || estadoMun === "carregando"}
          placeholder={!uf ? "Escolha o estado primeiro" : estadoMun === "carregando" ? "Carregando municípios..." : "Digite para buscar"}
          aria-invalid={!!erros.municipio} aria-describedby={erros.municipio ? `${id}-erro-municipio` : undefined} />
        {municipios && <datalist id={`${id}-lista-mun`}>{municipios.map((m) => <option key={m} value={m} />)}</datalist>}
        {estadoMun === "ok" && municipios && <p className="campo__dica">{municipios.length} municípios em {uf}, segundo o IBGE.</p>}
        {estadoMun === "erro" && (
          <div className="estado-erro" role="alert">
            <p>Não carregamos os municípios do IBGE. Você pode digitar o nome ou tentar de novo.</p>
            <button type="button" className="botao botao--fantasma" onClick={() => setTentativa((n) => n + 1)}>Tentar de novo</button>
          </div>
        )}
        {erros.municipio && <p className="erro" id={`${id}-erro-municipio`}>{erros.municipio}</p>}
      </div>
      <button type="submit" className="botao botao--primario botao--largo">Criar conta</button>
      <p className="nota">Na demo, seus dados ficam só neste navegador.</p>
    </form>
  );
}

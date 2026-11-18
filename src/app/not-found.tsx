import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <main style={{ maxWidth: 400, margin: "60px auto", padding: 20 }}>
      <h1 className="titulo">Página não encontrada</h1>
      <p className="lead">O endereço pode ter mudado.</p>
      <Link className="botao botao--primario" href="/">Ir para o início</Link>
    </main>
  );
}

import type { Metadata } from "next";
import { Painel } from "@/components/painel/Painel";

export const metadata: Metadata = { title: "Painel da empresa" };
export default function Pagina() { return <Painel />; }

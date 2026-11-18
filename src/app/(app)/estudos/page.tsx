import type { Metadata } from "next";
import { Estudos } from "@/components/telas/Estudos";

export const metadata: Metadata = { title: "Estudos" };
export default function Pagina() { return <Estudos />; }

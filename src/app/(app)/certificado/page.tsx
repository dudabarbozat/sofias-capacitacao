import type { Metadata } from "next";
import { Certificado } from "@/components/telas/Certificado";

export const metadata: Metadata = { title: "Certificado" };
export default function Pagina() { return <Certificado />; }

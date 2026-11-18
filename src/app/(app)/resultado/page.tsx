import type { Metadata } from "next";
import { Resultado } from "@/components/telas/Resultado";

export const metadata: Metadata = { title: "Resultado do teste" };
export default function Pagina() { return <Resultado />; }

import type { Metadata } from "next";
import { SemInternet } from "@/components/telas/SemInternet";

export const metadata: Metadata = { title: "Sem internet" };
export default function Pagina() { return <SemInternet />; }

import { JetBrains_Mono } from "next/font/google";
import "@/components/solusi/toko.css";
import "@/components/solusi/detail/detail.css";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export default function SolusiLayout({ children }: { children: React.ReactNode }) {
  return <div className={mono.variable}>{children}</div>;
}

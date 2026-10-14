import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Green Farm — Kebun Kecil, Dunia Baru",
  description: "Prototipe visual orisinal untuk game Green Farm berbasis web.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

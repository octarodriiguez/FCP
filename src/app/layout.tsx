import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "AFTER DARK — Drop 001", description: "Limited edition merch drop" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

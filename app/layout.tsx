import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "@/lib/util/SmoothScrolling";
import Nav from "./components/nav";
import Grid from "./components/grid";
import { getData } from "@/lib/util/sanity";
import WorkGrid from "./components/workGrid";



export const metadata: Metadata = {
  title: "Index Films",
  description: "A creative production company built for cinematic commercial work",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en"
    >

      <SmoothScrolling>

        <body className="min-h-screen w-screen  bg-(--black)">
          <Grid />
          <Nav />
          {children}
        </body>
      </SmoothScrolling>
    </html>
  );
}

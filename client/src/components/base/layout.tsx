import { ReactNode } from "react";
import { Navbar } from "./navbar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <Navbar />
      {children}
    </div>
  );
}

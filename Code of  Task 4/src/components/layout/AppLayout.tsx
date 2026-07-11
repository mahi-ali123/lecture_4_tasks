import React from "react";
import { Navbar } from "./Navbar";
import { Outlet } from "react-router";

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t border-border/40">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by AI Studio. Increase Your Clicks with AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

import { useState } from "react";
import { SearchProvider } from "../../contexts/SearchContext";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { HistoryPanel } from "../history/HistoryPanel";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <SearchProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-slate-200/40 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex w-full flex-col lg:pl-72">
          <TopBar
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            onToggleHistory={() => setHistoryOpen((prev) => !prev)}
          />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
        <HistoryPanel open={historyOpen} onClose={() => setHistoryOpen(false)} />
      </div>
    </SearchProvider>
  );
};


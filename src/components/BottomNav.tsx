import { Screen } from "@/src/types";
import { LayoutDashboard, ReceiptText, Users, Settings } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const tabs: { screen: Screen; label: string; icon: any }[] = [
    { screen: 'dashboard', label: 'Tablero', icon: LayoutDashboard },
    { screen: 'history', label: 'Facturas', icon: ReceiptText },
    { screen: 'help', label: 'Clientes', icon: Users }, // The mockup says "Clientes" but links to Help in some views? No, dashboard matches dashboard, history matches history.
    { screen: 'profile', label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-[max(0.5rem,env(safe-area-inset-bottom))] left-1/2 z-50 w-[calc(100%-1rem)] max-w-md -translate-x-1/2 flex justify-around items-center px-2 py-2 bg-surface-container-lowest shadow-[0_-4px_12px_rgba(0,0,0,0.05)] rounded-2xl border border-surface-container-high md:hidden">
      {tabs.map((tab) => {
        const isActive = currentScreen === tab.screen;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.screen}
            onClick={() => onNavigate(tab.screen)}
            className={cn(
              "flex flex-col items-center justify-center transition-all px-4 py-1 rounded-xl",
              isActive 
                ? "bg-primary-container text-on-primary-container rounded-full" 
                : "text-on-surface-variant hover:bg-surface-container-high"
            )}
          >
            <Icon size={20} className={cn("mb-1", isActive && "fill-current")} />
            <span className="font-label-md text-label-md">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

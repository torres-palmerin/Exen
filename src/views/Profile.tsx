import { motion } from "motion/react";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  Upload, 
  History as HistoryIcon,
} from "lucide-react";
import { Screen, FiscalProfile } from "@/src/types";

interface ProfileProps {
  onNavigate: (screen: Screen) => void;
}

export function Profile({ onNavigate }: ProfileProps) {
  const profile: FiscalProfile = {
    rfc: 'XAXX010101000',
    regime: 'Régimen Simplificado de Confianza (RESICO)',
    cp: '11000',
    activity: 'Servicios de diseño de sistemas de cómputo y servicios relacionados'
  };

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen pt-[72px] pb-[100px]">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md flex justify-between items-center px-margin-mobile py-base max-w-full">
        <div className="flex items-center gap-sm">
          <img 
            alt="User profile" 
            className="w-10 h-10 rounded-full object-cover shadow-sm" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5Vp7Soc1nitfNwYVj8B_UcINLCVrEDTVYmEJAAdvseJrZDRzDj93xAeM3ukvOe-dIkEKxQy0rAfawCUk-NtGHZzCXK1VPODmZ-AMAyiPXGiAnteQVUsUFueT5rL1bNoOiHFnlwBT-XzFaT3VKyh5DXMVtoegNBY6QP1ax1r2HJ-7J6f__n-sgrpa6CmpcCCwRRDgiVxfrx4SZ5jTfB2ZOPX1ooRKlK4jxxK6QPH3AqIXEjB1nnO3BxplyWokdPPOMuZR1DP6sAfQ" 
          />
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0e_3kg4f_7ecUIOAvKVaGzQiXE1MY63k1ZdZT8piiqUb3uL-dlGBGAs2HZ9se29p_gk-yzLDlu70U_SuVX2b-gdo7aZXdk4Xc-dEwpvoKcHN5F7CiccG0IS2qcxfUDWKhWfKgX6YRTJ0qC9FI5APcGDY_SbfHlvOs0eq7-v6IcYIZV0fu7xhYEXlMpjq9d3OLT9NU9pszHu4hJV-mYqYB7UU0oAkRi2h_olV_G-H0zcxkktIHaIn9Oh9L2Lc8ipnqO89JG563OvfXWQ" 
            alt="EXEN Logo" 
            className="h-8 w-auto object-contain" 
          />
        </div>
        <button className="text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95 w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low">
          <Bell size={24} />
        </button>
      </header>

      <main className="px-margin-mobile flex flex-col gap-lg mt-sm max-w-2xl mx-auto">
        <section className="flex flex-col gap-xs">
          <div className="inline-flex items-center gap-1.5 bg-primary-fixed-dim/30 px-3 py-1 rounded-full w-fit mb-2">
            <Sparkles size={16} className="text-primary fill-current" />
            <span className="font-label-md text-label-md text-primary">Datos verificados por IA</span>
          </div>
          <h2 className="font-headline-xl text-headline-xl text-on-background">Perfil Fiscal</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Información extraída de tu última Constancia de Situación Fiscal.</p>
        </section>

        {/* Fiscal Data Card */}
        <motion.div
           initial={{ y: 10, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
        >
          <Card className="p-0 border-[0.5px] border-surface-container-high relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-inverse-primary opacity-80"></div>
            <div className="flex flex-col p-md">
              <div className="py-sm border-b border-surface-container-high flex flex-col gap-1">
                <span className="font-label-md text-label-md text-on-surface-variant">RFC</span>
                <div className="flex items-center justify-between">
                  <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-background font-semibold tracking-wide">{profile.rfc}</span>
                  <CheckCircle2 size={20} className="text-secondary-fixed-dim fill-current" />
                </div>
              </div>
              <div className="py-sm border-b border-surface-container-high flex flex-col gap-1">
                <span className="font-label-md text-label-md text-on-surface-variant">Régimen</span>
                <span className="font-body-md text-body-md text-on-background">{profile.regime}</span>
              </div>
              <div className="py-sm border-b border-surface-container-high flex flex-col gap-1">
                <span className="font-label-md text-label-md text-on-surface-variant">Código Postal</span>
                <span className="font-body-md text-body-md text-on-background">{profile.cp}</span>
              </div>
              <div className="pt-sm flex flex-col gap-1">
                <span className="font-label-md text-label-md text-on-surface-variant">Actividad Económica</span>
                <span className="font-body-md text-body-md text-on-background leading-tight">{profile.activity}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        <section className="flex flex-col gap-md">
          <Button 
            className="w-full flex gap-sm rounded-xl py-4"
            onClick={() => onNavigate('onboarding_1')}
          >
            <Upload size={20} />
            Reemplazar constancia
          </Button>
          <Button 
            variant="secondary" 
            className="w-full flex gap-sm rounded-xl py-4 text-primary"
          >
            <HistoryIcon size={20} />
            Historial de cambios
          </Button>

          <Button 
            variant="ghost" 
            className="mt-4 text-error hover:bg-error-container"
            onClick={() => onNavigate('splash')}
          >
            Cerrar sesión
          </Button>
        </section>
      </main>
    </div>
  );
}

import { motion } from "motion/react";
import { Button } from "@/src/components/ui/Button";
import { Sparkles } from "lucide-react";
import { Screen } from "@/src/types";

interface SplashProps {
  onNavigate: (screen: Screen) => void;
}

export function Splash({ onNavigate }: SplashProps) {
  return (
    <div className="bg-surface min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-margin-mobile">
      {/* Ambient Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[530px] bg-gradient-to-b from-surface-container-highest/60 to-transparent pointer-events-none z-0"></div>
      <div className="absolute -top-[20vw] -right-[20vw] w-[60vw] h-[60vw] rounded-full bg-primary-fixed-dim/40 blur-[80px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-full h-[353px] bg-gradient-to-t from-surface-container-high/40 to-transparent pointer-events-none z-0"></div>

      <main className="w-full max-w-[400px] flex flex-col items-center z-10 flex-grow pt-[132px]">
        {/* Logo Graphic */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative mb-lg"
        >
          <div className="w-48 aspect-[1024/261] bg-surface-container-lowest rounded-xl shadow-medium flex items-center justify-center relative z-10 border border-surface-container-highest/50 overflow-hidden px-4">
            <img 
              alt="EXEN Logo" 
              className="w-full h-auto object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJeGfAmN010cED1ZaKOWd-uhsYzKMthyNX4CYPYGSZwjFiKZ_yEdq5Ds9dMttPSXFvRONbrHv24oQ9tA6zNEPDz39N1aLDbILe_1qFCqigRuKjd0kmXSeWB8udE26FRhfOPkGJHfNF3O8EIFQ9-w9Fcbjbz02PgolKugYGcfVA0OSASNC6hpQCAcFxDycGHaGr6lSaGTcak5aiEfcRDwhRkaRiLJ07WLpYadA9tTwYB74JEdyAdQGmg357SFv5osKZGfW1S6QiypCCag" 
            />
          </div>
          {/* AI Sparkle Indicator */}
          <div className="absolute -top-2 -right-2 bg-surface-container-lowest rounded-full p-1.5 shadow-sm border border-surface-container-highest/50 z-20">
            <Sparkles size={20} className="text-tertiary-fixed-dim fill-current" />
          </div>
          {/* Decorative ring */}
          <div className="absolute inset-0 border border-primary-fixed rounded-xl scale-110 opacity-50 z-0"></div>
        </motion.div>

        {/* Typography */}
        <div className="text-center mb-xl w-full">
          <h1 className="font-headline-xl text-headline-xl text-on-background mb-base tracking-tight">EXEN</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[260px] mx-auto leading-relaxed">
            Asistente inteligente de facturación
          </p>
        </div>

        <div className="flex-grow"></div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full flex flex-col gap-sm pb-[70px]"
        >
          <Button 
            size="xl" 
            className="w-full rounded-[16px]"
            onClick={() => onNavigate('register')}
          >
            Crear cuenta
          </Button>
          <Button 
            variant="secondary" 
            size="xl" 
            className="w-full rounded-[16px]"
            onClick={() => onNavigate('login')}
          >
            Iniciar sesión
          </Button>
        </motion.div>
      </main>
    </div>
  );
}

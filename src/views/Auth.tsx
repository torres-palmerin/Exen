import { motion } from "motion/react";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Card } from "@/src/components/ui/Card";
import { User, Mail, Lock, BadgeCheck, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { Screen } from "@/src/types";

interface AuthProps {
  mode: 'register' | 'login';
  onNavigate: (screen: Screen) => void;
}

export function Auth({ mode, onNavigate }: AuthProps) {
  return (
    <div className="bg-surface text-on-background min-h-screen flex flex-col justify-center items-center p-margin-mobile relative overflow-x-hidden font-body-md">
      {/* Decorative Background Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-surface-container-highest rounded-full blur-[100px] opacity-60 pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-fixed rounded-full blur-[120px] opacity-40 pointer-events-none z-0"></div>

      <main className="w-full max-w-[480px] z-10 flex flex-col items-center">
        <header className="w-full flex justify-center items-center mb-lg">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile tracking-tight text-primary font-bold">EXEN</h1>
        </header>

        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="w-full"
        >
          <Card className="flex flex-col gap-md">
            <div className="text-center mb-sm">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
                {mode === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {mode === 'register' ? 'Ingresa tus datos para comenzar.' : 'Bienvenido de nuevo.'}
              </p>
            </div>

            <form className="flex flex-col gap-md">
              {mode === 'register' && (
                <Input 
                  label="Nombre completo" 
                  icon={<User size={20} />} 
                  placeholder="Ej. Juan Pérez" 
                />
              )}

              <Input 
                label="Correo electrónico" 
                icon={<Mail size={20} />} 
                type="email"
                defaultValue={mode === 'register' ? "juan.perez@empresa.com" : ""}
                rightIcon={mode === 'register' ? <CheckCircle2 size={20} className="text-secondary fill-current" /> : null}
              />

              <div className={mode === 'register' ? "grid grid-cols-1 md:grid-cols-2 gap-md" : "flex flex-col gap-md"}>
                <Input 
                  label="Contraseña" 
                  icon={<Lock size={20} />} 
                  type="password" 
                  placeholder="••••••••" 
                />
                {mode === 'register' && (
                  <Input 
                    label="Confirmar Contraseña" 
                    icon={<Lock size={20} />} 
                    type="password" 
                    placeholder="••••••••" 
                  />
                )}
              </div>

              {mode === 'register' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <Input 
                    label="RFC" 
                    icon={<BadgeCheck size={20} />} 
                    placeholder="ABCD123456XYZ" 
                    className="uppercase"
                  />
                  <Input 
                    label="Teléfono" 
                    icon={<Phone size={20} />} 
                    placeholder="(55) 1234 5678" 
                    type="tel"
                  />
                </div>
              )}

              <Button 
                className="mt-sm w-full py-md rounded-xl flex gap-xs"
                onClick={() => onNavigate('onboarding_1')}
                type="button"
              >
                {mode === 'register' ? 'Crear cuenta' : 'Entrar'}
                <ArrowRight size={20} />
              </Button>
            </form>

            <div className="mt-xs text-center border-t border-surface-container-high pt-md">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {mode === 'register' ? '¿Ya te registraste?' : '¿No tienes cuenta?'}
                <button 
                  className="font-label-lg text-label-lg text-primary hover:underline ml-xs"
                  onClick={() => onNavigate(mode === 'register' ? 'login' : 'register')}
                >
                  {mode === 'register' ? 'Iniciar sesión' : 'Regístrate'}
                </button>
              </p>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

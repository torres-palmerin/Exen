import { useState } from "react";
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
  const urlRegisterLambda = "https://bcnih2urf27erl3njbtsyrsifi0mwspk.lambda-url.us-east-2.on.aws/";
  const urlLoginLambda = "https://gugievxywht3ej7ekeupnc6hgm0wfkcd.lambda-url.us-east-2.on.aws/";

  const [emailState, setEmailState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const [confirmPasswordState, setConfirmPasswordState] = useState("");
  const [fullNameState, setFullNameState] = useState("");
  const [rfcState, setRfcState] = useState("");
  const [phoneState, setPhoneState] = useState("");
  const [loading, setLoading] = useState(false);

  const writeSessionState = (patch: Record<string, unknown>) => {
    const currentState = window.history.state && typeof window.history.state === 'object'
      ? window.history.state as Record<string, unknown>
      : {};

    window.history.replaceState(
      {
        ...currentState,
        ...patch,
      },
      "",
      window.location.href,
    );
  };

  const handleAuthSubmit = async (authMode: 'login' | 'register') => {
    const endpoint = authMode === 'login' ? urlLoginLambda : urlRegisterLambda;

    console.log('[Auth] submit iniciado', {
      mode: authMode,
      endpoint,
      email: emailState,
      hasPassword: Boolean(passwordState),
      hasConfirmPassword: Boolean(confirmPasswordState),
      hasFullName: Boolean(fullNameState),
      hasRfc: Boolean(rfcState),
      hasPhone: Boolean(phoneState),
    });

    if (authMode === 'register' && passwordState !== confirmPasswordState) {
      console.warn('[Auth] validación fallida: las contraseñas no coinciden');
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      setLoading(true);
      console.log('[Auth] enviando petición a Lambda', { endpoint, mode: authMode });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailState,
          password: passwordState,
          nombre_completo: fullNameState,
          rfc: rfcState,
          telefono: phoneState
        })
      });

      console.log('[Auth] respuesta recibida', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      });

      const data = await response.json();
      console.log('[Auth] payload de respuesta', data);

      if (!response.ok) {
        console.error('[Auth] la Lambda respondió con error', data);
        alert(data.error || 'No fue posible completar la autenticación');
        return;
      }

      if (data.success) {
        console.log('Autenticado con éxito, ID de usuario:', data.userId);

        writeSessionState({
          userId: data.userId ? String(data.userId) : undefined,
          userEmail: emailState,
        });

        if (authMode === 'register') {
          console.log('[Auth] registro exitoso, redirigiendo a login');
          window.alert('Todo salió bien. Ahora puedes iniciar sesión.');
          onNavigate('login');
          return;
        }

        console.log('[Auth] login exitoso, redirigiendo al dashboard');
        onNavigate('dashboard');
      } else if (data.error) {
        console.warn('[Auth] la Lambda respondió success=false', data.error);
        alert(data.error);
      } else {
        console.warn('[Auth] respuesta sin success ni error explícito');
      }
    } catch (err) {
      console.error('[Auth] fallo la conexión con el servicio de Auth:', err);
      alert('No se pudo conectar con el servicio de autenticación');
    } finally {
      console.log('[Auth] submit finalizado');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center px-4 py-3 relative overflow-x-hidden font-body-md bg-[linear-gradient(180deg,#fbfbff_0%,#f3f4fb_55%,#edf0f8_100%)] text-on-surface">
      <main className="w-full max-w-[330px] z-10 flex flex-col items-stretch gap-2">
        <header className="w-full flex justify-center items-center pt-1 pb-1">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile tracking-tight text-primary font-bold">EXEN</h1>
        </header>

        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="w-full"
        >
          <Card className="w-full flex flex-col gap-3 p-4 rounded-[12px] shadow-[0_8px_24px_rgba(15,23,42,0.08)] border border-surface-container-high/50 bg-surface-container-lowest">
            <div className="text-center mb-1 pt-1">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
                {mode === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {mode === 'register' ? 'Ingresa tus datos para comenzar.' : 'Bienvenido de nuevo.'}
              </p>
            </div>

            <form
              className="flex flex-col gap-2.5"
              onSubmit={(event) => {
                event.preventDefault();
                void handleAuthSubmit(mode);
              }}
            >
              {mode === 'register' && (
                <Input 
                  label="Nombre completo" 
                  icon={<User size={20} />} 
                  placeholder="Ej. Juan Pérez" 
                  className="py-3.5 text-[15px]"
                  value={fullNameState}
                  onChange={(event) => setFullNameState(event.target.value)}
                />
              )}

              <Input 
                label="Correo electrónico" 
                icon={<Mail size={20} />} 
                type="email"
                value={emailState}
                onChange={(event) => setEmailState(event.target.value)}
                className="py-3.5 text-[15px]"
              />

              <div className={mode === 'register' ? "grid grid-cols-1 gap-2.5" : "flex flex-col gap-2.5"}>
                <Input 
                  label="Contraseña" 
                  icon={<Lock size={20} />} 
                  type="password" 
                  placeholder="••••••••" 
                  className="py-3.5 text-[15px]"
                  value={passwordState}
                  onChange={(event) => setPasswordState(event.target.value)}
                />
                {mode === 'register' && (
                  <Input 
                    label="Confirmar Contraseña" 
                    icon={<Lock size={20} />} 
                    type="password" 
                    placeholder="••••••••" 
                    className="py-3.5 text-[15px]"
                    value={confirmPasswordState}
                    onChange={(event) => setConfirmPasswordState(event.target.value)}
                  />
                )}
              </div>

              {mode === 'register' && (
                <div className="grid grid-cols-1 gap-2.5">
                  <Input 
                    label="RFC" 
                    icon={<BadgeCheck size={20} />} 
                    placeholder="ABCD123456XYZ" 
                    className="uppercase py-3.5 text-[15px]"
                    value={rfcState}
                    onChange={(event) => setRfcState(event.target.value)}
                  />
                  <Input 
                    label="Teléfono" 
                    icon={<Phone size={20} />} 
                    placeholder="(55) 1234 5678" 
                    type="tel"
                    className="py-3.5 text-[15px]"
                    value={phoneState}
                    onChange={(event) => setPhoneState(event.target.value)}
                  />
                </div>
              )}

              <Button 
                className="mt-1 w-full py-3 rounded-[10px] flex gap-xs text-white"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Procesando...' : (mode === 'register' ? 'Crear cuenta' : 'Entrar')}
                <ArrowRight size={20} />
              </Button>
            </form>

            <div className="mt-1 text-center border-t border-surface-container-high pt-3">
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


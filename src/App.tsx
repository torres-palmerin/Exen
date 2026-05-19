/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Screen } from './types';
import { Splash } from './views/Splash';
import { Auth } from './views/Auth';
import { Dashboard } from './views/Dashboard';
import { History } from './views/History';
import { Profile } from './views/Profile';
import { BillingFlow } from './views/BillingFlow';
import { Help, Chat } from './views/Support';
import { BottomNav } from './components/BottomNav';

const conceptLambdaUrl = 'https://2qfuxxj3q7ilubmfyevab66jly0ewolt.lambda-url.us-east-2.on.aws/';
const readFiscalProfileUrl = 'https://6uszlsniryljwxtogksobjttw40auyij.lambda-url.us-east-2.on.aws/';

export default function App() {
  const initialScreen = (window.history.state?.screen as Screen | undefined) ?? 'splash';
  const [currentScreen, setCurrentScreen] = useState<Screen>(initialScreen);
  const [actividadReciente, setActividadReciente] = useState<any[]>([]);
  const [userRfc, setUserRfc] = useState<string>('');

  const readBrowserSessionState = () => {
    if (typeof window === 'undefined') return {} as Record<string, unknown>;
    const state = window.history.state;
    if (!state || typeof state !== 'object') return {} as Record<string, unknown>;
    return state as Record<string, unknown>;
  };

  useEffect(() => {
    const cargarActividad = async () => {
      try {
        const res = await fetch(conceptLambdaUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accion: 'listar' }),
        });

        if (res.ok) {
          const data = await res.json();
          setActividadReciente(Array.isArray(data) ? data : data?.items ?? data?.facturas ?? data?.data ?? []);
        }
      } catch (error) {
        console.error('Error cargando actividad reciente:', error);
      }
    };

    void cargarActividad();
  }, []);

  useEffect(() => {
    const cargarRfcUsuario = async () => {
      try {
        const session = readBrowserSessionState();
        const email = String(session.userEmail ?? '');

        if (!email) {
          return;
        }

        const res = await fetch(`${readFiscalProfileUrl}?email=${encodeURIComponent(email)}`);
        const data = await res.json();

        if (!res.ok || !data) {
          return;
        }

        const extracted = data?.datos ?? data?.profile ?? data?.data ?? data;
        const rfc = String(extracted?.rfc ?? '').trim();

        if (rfc) {
          setUserRfc(rfc);
        }
      } catch (error) {
        console.error('Error cargando RFC del usuario:', error);
      }
    };

    void cargarRfcUsuario();
  }, []);

  const guardarEnDynamo = async (nuevaFactura: any) => {
    setActividadReciente((prev) => [nuevaFactura, ...prev]);
  };

  const openBillingPreview = (selectedInvoice: any) => {
    const currentState = window.history.state && typeof window.history.state === 'object'
      ? window.history.state as Record<string, unknown>
      : {};

    const nextState = {
      ...currentState,
      screen: 'billing_preview' as Screen,
      selectedInvoice,
    };

    window.history.pushState(nextState, '', window.location.href);
    setCurrentScreen('billing_preview');
  };

  useEffect(() => {
    const initialState = window.history.state && typeof window.history.state === 'object'
      ? window.history.state
      : { screen: initialScreen };

    if (!window.history.state?.screen) {
      window.history.replaceState(initialState, '', window.location.href);
    }

    const handlePopState = (event: PopStateEvent) => {
      const nextScreen = event.state?.screen as Screen | undefined;

      if (nextScreen) {
        setCurrentScreen(nextScreen);
        return;
      }

      window.history.pushState({ screen: currentScreen }, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentScreen]);

  const handleNavigate = (screen: Screen) => {
    const currentState = window.history.state && typeof window.history.state === 'object'
      ? window.history.state as Record<string, unknown>
      : {};

    // Build next history state and remove any selectedInvoice unless we're opening the preview
    const nextState = { ...currentState, screen } as Record<string, unknown>;
    if (screen !== 'billing_preview') {
      // ensure we don't carry over a previously selected invoice
      if ('selectedInvoice' in nextState) {
        delete nextState.selectedInvoice;
      }
    }

    if (screen !== currentScreen) {
      window.history.pushState(nextState, '', window.location.href);
    }

    setCurrentScreen(screen);
  };

  const showBottomNav = [
    'dashboard', 
    'history', 
    'profile',
    'help'
  ].includes(currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <Splash onNavigate={handleNavigate} />;
      case 'register':
        return <Auth mode="register" onNavigate={handleNavigate} />;
      case 'login':
        return <Auth mode="login" onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} actividadReciente={actividadReciente} onOpenBillingPreview={openBillingPreview} userRfc={userRfc} />;
      case 'history':
        return <History onNavigate={handleNavigate} actividadReciente={actividadReciente} />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      case 'onboarding_1':
      case 'onboarding_2':
      case 'billing_1':
      case 'billing_2':
      case 'billing_preview':
      case 'billing_success':
        return <BillingFlow initialStep={currentScreen} onNavigate={handleNavigate} onGuardarFactura={guardarEnDynamo} />;
      case 'help':
        return <Help onNavigate={handleNavigate} />;
      case 'chat':
        return <Chat onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="min-h-screen"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {showBottomNav && (
        <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
      )}
    </div>
  );
}
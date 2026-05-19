import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Screen } from '../types';
import { Splash } from '../views/Splash';
import { Auth } from '../views/Auth';
import { Dashboard } from '../views/Dashboard';
import { History } from '../views/History';
import { Profile } from '../views/Profile';
import { BillingFlow } from '../views/BillingFlow';
import { Help, Chat } from '../views/Support';
import { BottomNav } from './BottomNav';

const conceptLambdaUrl = 'https://2qfuxxj3q7ilubmfyevab66jly0ewolt.lambda-url.us-east-2.on.aws/';
// 🔗 Inyectamos la URL del perfil fiscal en MainApp
const readFiscalProfileUrl = 'https://6uszlsniryljwxtogksobjttw40auyij.lambda-url.us-east-2.on.aws/';

interface MainAppProps {
  userId?: string;
  userEmail?: string;
  onSignOut: () => void;
}

export default function MainApp({ userId, userEmail, onSignOut }: MainAppProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [actividadReciente, setActividadReciente] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  // ⚡ Estado para almacenar el RFC del emisor autenticado
  const [userRfc, setUserRfc] = useState<string>('');

  // 1. Efecto para cargar el historial de facturas desde DynamoDB
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

  // 2. 🛡️ NUEVO EFECTO: Carga el RFC usando el email real provisto por Cognito
  useEffect(() => {
    const cargarRfcUsuario = async () => {
      if (!userEmail) return;

      try {
        const res = await fetch(`${readFiscalProfileUrl}?email=${encodeURIComponent(userEmail)}`);
        if (!res.ok) return;

        const data = await res.json();
        if (!data) return;

        const extracted = data?.datos ?? data?.profile ?? data?.data ?? data;
        const rfc = String(extracted?.rfc ?? '').trim();

        if (rfc) {
          setUserRfc(rfc);
        }
      } catch (error) {
        console.error('Error cargando RFC del usuario en MainApp:', error);
      }
    };

    void cargarRfcUsuario();
  }, [userEmail]);

  const guardarEnDynamo = async (nuevaFactura: any) => {
    try {
      setActividadReciente((prev) => [nuevaFactura, ...prev]);
    } catch (error) {
      console.error('Error al guardar en DynamoDB:', error);
    }
  };

  const handleOpenBillingPreview = (invoice: any) => {
    setSelectedInvoice(invoice);
    setCurrentScreen('billing_preview');
  };

  const handleNavigate = (screen: Screen) => {
    if (screen !== 'billing_preview') {
      setSelectedInvoice(null);
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
        // 🎯 FIX CRÍTICO: Aquí ya le inyectamos la propiedad 'userRfc' al componente Dashboard
        return (
          <Dashboard 
            onNavigate={handleNavigate} 
            actividadReciente={actividadReciente} 
            onOpenBillingPreview={handleOpenBillingPreview} 
            userRfc={userRfc} 
          />
        );
      case 'history':
        return <History onNavigate={handleNavigate} actividadReciente={actividadReciente} />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      case 'billing_1':
      case 'billing_2':
      case 'billing_success':
        return <BillingFlow initialStep={currentScreen} onNavigate={handleNavigate} onGuardarFactura={guardarEnDynamo} />;
      case 'billing_preview':
        return <BillingFlow initialStep={currentScreen} onNavigate={handleNavigate} onGuardarFactura={guardarEnDynamo} invoice={selectedInvoice} />;
      case 'help':
        return <Help onNavigate={handleNavigate} />;
      case 'chat':
        return <Chat onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} actividadReciente={actividadReciente} userRfc={userRfc} />;
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
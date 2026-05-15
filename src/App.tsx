/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');

  const handleNavigate = (screen: Screen) => {
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
        return <Dashboard onNavigate={handleNavigate} />;
      case 'history':
        return <History onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      case 'onboarding_1':
      case 'onboarding_2':
      case 'billing_1':
      case 'billing_2':
      case 'billing_preview':
      case 'billing_success':
        return <BillingFlow initialStep={currentScreen} onNavigate={handleNavigate} />;
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

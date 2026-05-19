import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from 'react-oidc-context';

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_7f0msYKMl",
  client_id: "3fpop0ef945k22gqgv133p5bf4",
  redirect_uri: "http://localhost:3000",
  response_type: "code",
  scope: "phone openid email",
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 2. TE FALTABA ENVOLVER EL APP AQUÍ: */}
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </StrictMode>,
);
export type Screen = 
  | 'splash' 
  | 'register' 
  | 'login' 
  | 'dashboard' 
  | 'history' 
  | 'profile' 
  | 'onboarding_1' 
  | 'onboarding_2' 
  | 'billing_1' 
  | 'billing_2' 
  | 'billing_preview' 
  | 'billing_success' 
  | 'help' 
  | 'chat';

export interface Invoice {
  id: string;
  client: string;
  amount: number;
  date: string;
  status: 'Timbrada' | 'Borrador' | 'Cancelada' | 'Pagada' | 'Pendiente';
  folio: string;
}

export interface FiscalProfile {
  rfc: string;
  razonSocial: string;
  regimeFiscal: string;
  cp: string;
}

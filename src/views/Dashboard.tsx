import { motion } from "motion/react";
import { useMemo } from "react";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { 
  Bell, 
  ArrowLeftRight, 
  FilePlus, 
  ReceiptText, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles,
  Clock,
  FileCheck
} from "lucide-react";
import { Screen, Invoice } from "@/src/types";
import { cn } from "@/src/lib/utils";

// Agrega estas líneas a tu interfaz actual
interface DashboardProps {
  onNavigate: (screen: any) => void; 
  userId?: string;              
  userEmail?: string;                
  userRfc?: string;
  onSignOut?: () => void;
  actividadReciente?: any[];
  onOpenBillingPreview?: (invoice: any) => void;
}     

export function Dashboard({ onNavigate, actividadReciente = [], onOpenBillingPreview, userRfc }: DashboardProps) {
  const recentActivity: any[] = actividadReciente;

  const clientRfcs = useMemo(() => {
    const set = new Set<string>();
    (actividadReciente || []).forEach((item: any) => {
      const rfc = item?.receptor?.rfc ?? item?.receptorRfc ?? item?.rfc ?? item?.clientRfc ?? item?.cliente?.rfc;
      if (rfc) set.add(String(rfc).toUpperCase());
    });
    return Array.from(set);
  }, [actividadReciente]);

  return (
    <div className="bg-surface text-on-surface min-h-screen pt-[68px] sm:pt-[72px] pb-[calc(116px+env(safe-area-inset-bottom))] font-sans antialiased overflow-x-hidden">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md flex justify-between items-center px-3 sm:px-margin-mobile py-2 sm:py-base border-b border-surface-container-high/30">
        <div className="flex items-center gap-2 sm:gap-sm min-w-0">
          <div 
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container overflow-hidden active:scale-95 transition-transform cursor-pointer border border-surface-dim/20 shrink-0"
            onClick={() => onNavigate('profile')}
          >
            <img 
              alt="User profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqP9FmMjxWk0Et5jW36cuK-yz-i80rcXOfTmDMirv_Mi5MNrVG4kPkG3CWuIyUXdmGika_hUgahtTaGr6WqyKRbk269jSOgHj_Y5gBY8JNZGliJKgkPYQ-ArpA7gM8fNI8hME3HkNz93oS8a5T1DtuqRy4qB1G-imELafAgr8ROBG3JXAIlFhVek_W3VbgD6G6aDLeKhANEtLgAafURqiSiEr9Oj7YPSufrUZEU-07DhG6OSRgt_zBGmRwhlfBIcd41E5OaC3Piqk" 
            />
          </div>
        </div>
        <img 
          src="/assets/logo.png" 
          alt="EXEN Logo" 
          className="h-6 sm:h-8 w-auto object-contain max-w-[84px] sm:max-w-none" 
        />
        <button className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-on-surface-variant hover:opacity-80 active:scale-95 transition-transform rounded-full hover:bg-surface-container-highest shrink-0">
          <Bell size={20} className="sm:hidden" />
          <Bell size={24} className="hidden sm:block" />
        </button>
      </header>

      <main className="flex flex-col gap-sm max-w-2xl mx-auto w-full px-3 sm:px-margin-mobile">
        <section className="pt-sm pb-xs">
          <h2 className="font-headline-lg-mobile text-[22px] sm:text-headline-lg-mobile text-on-background mb-3 sm:mb-md">Tablero</h2>
          <motion.div
            whileHover={{ y: -2 }}
            onClick={() => onNavigate('profile')}
          >
            <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 cursor-pointer p-3.5 sm:p-md rounded-2xl">
              <div className="flex flex-col gap-xs min-w-0">
                <p className="font-label-md text-[12px] sm:text-label-md text-on-surface-variant uppercase tracking-wider">Perfil Fiscal Activo</p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-sm">
                  <p className="font-headline-lg-mobile text-[19px] sm:text-headline-lg-mobile text-on-background break-all">{userRfc || 'RFC no disponible'}</p>
                  <span className="bg-secondary-container/20 text-secondary-container font-label-md text-label-md px-2 py-0.5 rounded-full inline-flex items-center gap-xs">
                    <CheckCircle2 size={14} className="fill-current" /> Regla
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors shrink-0 self-end sm:self-auto">
                <ArrowLeftRight size={20} />
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Primary Actions Bento Grid */}
        <section className="py-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-gutter">
            {/* Module A: Generar Factura */}
            <motion.div 
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('billing_1')}
              className="bg-primary-container text-on-primary-container p-4 sm:p-md rounded-2xl shadow-medium relative overflow-hidden flex flex-col justify-between min-h-[160px] sm:aspect-square cursor-pointer group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
              <Sparkles size={20} className="absolute top-3 right-3 text-on-primary-container/40 group-hover:text-on-primary-container/80 transition-colors fill-current" />
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-auto shadow-inner">
                <FilePlus size={22} className="sm:hidden text-on-primary-container" />
                <FilePlus size={24} className="hidden sm:block text-on-primary-container" />
              </div>
              <div className="relative z-10">
                <h3 className="font-label-lg text-label-lg font-bold">Generar Factura</h3>
                <p className="font-label-md text-label-md text-on-primary-container/80 mt-1">Crear manual o con IA</p>
              </div>
            </motion.div>

            {/* Module B: Facturar Ticket */}
            <motion.div 
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('chat')}
              className="bg-surface-container-lowest text-on-background border border-surface-container-high p-4 sm:p-md rounded-2xl shadow-soft relative flex flex-col justify-between min-h-[160px] sm:aspect-square cursor-pointer hover:border-primary/30 hover:bg-surface-container-low"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-auto text-primary">
                <ReceiptText size={22} className="sm:hidden" />
                <ReceiptText size={24} className="hidden sm:block" />
              </div>
              <div className="">
                <h3 className="font-label-lg text-label-lg font-bold text-primary">Facturar Ticket</h3>
                <p className="font-label-md text-label-md text-on-surface-variant mt-1">Escanear comprobante</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Recent Activity List */}
        <section className="py-sm flex-1">
          <div className="flex justify-between items-end gap-3 mb-3 sm:mb-md px-1">
            <h3 className="font-label-lg text-[13px] sm:text-label-lg text-on-background font-bold uppercase tracking-wide">Actividad Reciente</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('history')} className="shrink-0">Ver todo</Button>
          </div>
          <div className="flex flex-col gap-2.5 sm:gap-sm">
            {recentActivity.length > 0 ? (
              recentActivity.map((item, idx) => {
                const receptor = item?.receptor?.razonSocial ?? item?.client ?? item?.razonSocial ?? 'Sin receptor';
                const folio = item?.folio ?? item?.id ?? 'Sin folio';
                const amount = Number(item?.total ?? item?.amount ?? 0);
                const status = item?.status ?? 'Timbrada';

                return (
                  <motion.div
                    key={item?.id ?? `${folio}-${idx}`}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-md hover:bg-surface-container-low transition-colors cursor-pointer p-3.5 sm:p-md rounded-2xl"
                      onClick={() => onOpenBillingPreview?.(item)}
                    >
                      <div className="flex items-center gap-md min-w-0 w-full sm:w-auto">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                          {status === 'Pendiente' ? <Clock size={18} className="sm:hidden" /> : <FileCheck size={18} className="sm:hidden" />}
                          {status === 'Pendiente' ? <Clock size={20} className="hidden sm:block" /> : <FileCheck size={20} className="hidden sm:block" />}
                        </div>
                        <div className="flex flex-col">
                          <p className="font-label-lg text-[14px] sm:text-label-lg text-on-background truncate max-w-[200px] sm:max-w-[140px]">{receptor}</p>
                          <p className="font-body-sm text-[13px] sm:text-body-sm text-on-surface-variant">{folio}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-0 w-full sm:w-auto">
                        <p className="font-label-lg text-[14px] sm:text-label-lg text-on-background">${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        <span className={cn(
                          "font-label-md text-[12px] sm:text-label-md mt-1 px-2 py-0.5 rounded-full",
                          status === 'Timbrada' ? "bg-secondary-container/20 text-secondary" : 
                          status === 'Pendiente' ? "bg-tertiary-container/20 text-tertiary" : 
                          "bg-secondary-container/20 text-secondary"
                        )}>
                          {status}
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <Card className="p-4 rounded-2xl border border-dashed border-surface-container-high bg-surface-container-lowest text-on-surface-variant">
                Aún no hay facturas cargadas desde DynamoDB.
              </Card>
            )}
          </div>
        </section>

        {/* Clients Section: muestra RFCs únicos sacados de Dynamo */}
        <section className="py-sm">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-label-lg text-[13px] sm:text-label-lg text-on-background font-bold uppercase tracking-wide">Clientes</h3>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{clientRfcs.length} RFC{clientRfcs.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {clientRfcs.length > 0 ? (
              clientRfcs.map((rfc) => (
                <div key={rfc} className="px-3 py-2 bg-surface-container-low rounded-full border border-outline-variant/20 text-on-surface font-label-md">
                  {rfc}
                </div>
              ))
            ) : (
              <Card className="p-3 rounded-2xl border border-dashed border-surface-container-high bg-surface-container-lowest text-on-surface-variant">
                No hay clientes con RFC registrado aún.
              </Card>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

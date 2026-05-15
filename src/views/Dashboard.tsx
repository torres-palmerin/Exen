import { motion } from "motion/react";
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

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const recentActivity: Invoice[] = [
    { id: '1', client: 'TechCorp S.A. de C.V.', amount: 12450.00, date: 'Oct 24, 2023', status: 'Timbrada', folio: '#0042' },
    { id: '2', client: 'Starbucks Coffee', amount: 185.00, date: 'Oct 23, 2023', status: 'Pendiente', folio: 'Ticket procesado' },
    { id: '3', client: 'Consultoría Global S.C.', amount: 8900.00, date: 'Oct 22, 2023', status: 'Pagada', folio: '#0041' },
  ];

  return (
    <div className="bg-surface text-on-surface min-h-screen pt-[72px] pb-[90px] font-sans antialiased">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md flex justify-between items-center px-margin-mobile py-base border-b border-surface-container-high/30">
        <div className="flex items-center gap-sm">
          <div 
            className="w-10 h-10 rounded-full bg-surface-container overflow-hidden active:scale-95 transition-transform cursor-pointer border border-surface-dim/20"
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
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8P8NEB4ESsZg2dQ-fmEBp1xcbuVdMdYI9TkmD33H01trEC9VEsp1vHVbVxr-Nd_v1cjsEkhMPuFo0_bR74Gj8WwZL1-qX-Km7ZROzdYFFDzh6d2ced-ssQV8zd45xlwCCS-Z3m6XebLIM1-ryRBVOLvHa7lh7R0SUBFzUgsaULmk7cJBsenJ3_-9wcGNsCQYsz-PEp0lksvq_HnokzTIOW2zhctZ2pPoB-ehb0OQeuT-Cw_SjuFVHvBBAZ9srakAfgZByLI_-8WHBHQ" 
          alt="EXEN Logo" 
          className="h-8 w-auto object-contain" 
        />
        <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:opacity-80 active:scale-95 transition-transform rounded-full hover:bg-surface-container-highest">
          <Bell size={24} />
        </button>
      </header>

      <main className="flex flex-col gap-sm max-w-2xl mx-auto">
        <section className="px-margin-mobile pt-sm pb-xs">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background mb-md">Tablero</h2>
          <motion.div
            whileHover={{ y: -2 }}
            onClick={() => onNavigate('profile')}
          >
            <Card className="flex justify-between items-center cursor-pointer">
              <div className="flex flex-col gap-xs">
                <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Perfil Fiscal Activo</p>
                <div className="flex items-center gap-sm">
                  <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-background">XAXX010101000</p>
                  <span className="bg-secondary-container/20 text-secondary-container font-label-md text-label-md px-2 py-0.5 rounded-full flex items-center gap-xs">
                    <CheckCircle2 size={14} className="fill-current" /> Regla
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                <ArrowLeftRight size={20} />
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Primary Actions Bento Grid */}
        <section className="px-margin-mobile py-sm">
          <div className="grid grid-cols-2 gap-gutter">
            {/* Module A: Generar Factura */}
            <motion.div 
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('billing_1')}
              className="bg-primary-container text-on-primary-container p-md rounded-xl shadow-medium relative overflow-hidden flex flex-col justify-between aspect-square cursor-pointer group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
              <Sparkles size={20} className="absolute top-3 right-3 text-on-primary-container/40 group-hover:text-on-primary-container/80 transition-colors fill-current" />
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-auto shadow-inner">
                <FilePlus size={24} className="text-on-primary-container" />
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
              className="bg-surface-container-lowest text-on-background border border-surface-container-high p-md rounded-xl shadow-soft relative flex flex-col justify-between aspect-square cursor-pointer hover:border-primary/30 hover:bg-surface-container-low"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-auto text-primary">
                <ReceiptText size={24} />
              </div>
              <div className="">
                <h3 className="font-label-lg text-label-lg font-bold text-primary">Facturar Ticket</h3>
                <p className="font-label-md text-label-md text-on-surface-variant mt-1">Escanear comprobante</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Recent Activity List */}
        <section className="px-margin-mobile py-sm flex-1">
          <div className="flex justify-between items-end mb-md px-1">
            <h3 className="font-label-lg text-label-lg text-on-background font-bold uppercase tracking-wide">Actividad Reciente</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('history')}>Ver todo</Button>
          </div>
          <div className="flex flex-col gap-sm">
            {recentActivity.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer p-md">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                      {item.status === 'Pendiente' ? <Clock size={20} /> : <FileCheck size={20} />}
                    </div>
                    <div className="flex flex-col">
                      <p className="font-label-lg text-label-lg text-on-background truncate max-w-[140px]">{item.client}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{item.folio}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <p className="font-label-lg text-label-lg text-on-background">${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <span className={cn(
                      "font-label-md text-label-md mt-1 px-2 py-0.5 rounded-full",
                      item.status === 'Timbrada' ? "bg-secondary-container/20 text-secondary" : 
                      item.status === 'Pendiente' ? "bg-tertiary-container/20 text-tertiary" : 
                      "bg-secondary-container/20 text-secondary"
                    )}>
                      {item.status}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

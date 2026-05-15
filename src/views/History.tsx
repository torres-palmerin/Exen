import { motion } from "motion/react";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { 
  Bell, 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  RotateCcw, 
  Download,
  AlertCircle,
  FileCheck,
  FileEdit
} from "lucide-react";
import { Screen, Invoice } from "@/src/types";
import { cn } from "@/src/lib/utils";

interface HistoryProps {
  onNavigate: (screen: Screen) => void;
}

export function History({ onNavigate }: HistoryProps) {
  const invoices: Invoice[] = [
    { id: '1', client: 'Acme Corp', amount: 4500.00, date: 'Oct 24, 2023', status: 'Timbrada', folio: '#INV-2023-089' },
    { id: '2', client: 'Stark Industries', amount: 12000.00, date: 'Oct 22, 2023', status: 'Borrador', folio: '#INV-2023-088' },
    { id: '3', client: 'Globex Corp', amount: 1250.00, date: 'Oct 15, 2023', status: 'Cancelada', folio: '#INV-2023-087' },
    { id: '4', client: 'Initech', amount: 8900.00, date: 'Oct 10, 2023', status: 'Timbrada', folio: '#INV-2023-086' },
  ];

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen pb-[88px] pt-[72px]">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md flex justify-between items-center px-margin-mobile py-base border-b border-surface-container-high/30">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high flex-shrink-0">
            <img 
              alt="User profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqP9FmMjxWk0Et5jW36cuK-yz-i80rcXOfTmDMirv_Mi5MNrVG4kPkG3CWuIyUXdmGika_hUgahtTaGr6WqyKRbk269jSOgHj_Y5gBY8JNZGliJKgkPYQ-ArpA7gM8fNI8hME3HkNz93oS8a5T1DtuqRy4qB1G-imELafAgr8ROBG3JXAIlFhVek_W3VbgD6G6aDLeKhANEtLgAafURqiSiEr9Oj7YPSufrUZEU-07DhG6OSRgt_zBGmRwhlfBIcd41E5OaC3Piqk" 
            />
          </div>
          <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold tracking-tight">EXEN</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors">
          <Bell size={24} />
        </button>
      </header>

      <main className="px-margin-mobile flex flex-col gap-lg mt-md max-w-2xl mx-auto">
        <section className="flex flex-col gap-sm">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background">Historial de Facturas</h2>
          <div className="flex gap-sm">
            <div className="relative flex-1">
              <Input 
                placeholder="Buscar cliente o ID..." 
                icon={<Search size={18} />} 
                className="py-3 bg-surface-container-low"
              />
            </div>
            <Button variant="secondary" className="px-3 rounded-xl">
              <SlidersHorizontal size={20} />
            </Button>
          </div>
          <div className="flex gap-xs overflow-x-auto pb-2 scrollbar-none">
            {['Todas las fechas', 'Cualquier monto', 'Estado'].map((filter) => (
              <Button 
                key={filter}
                variant="outline" 
                size="sm" 
                className="whitespace-nowrap rounded-full bg-surface-container-lowest gap-1 px-4"
              >
                {filter} <ChevronDown size={16} />
              </Button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-md">
          {invoices.map((invoice, idx) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className={cn(
                "relative overflow-hidden flex flex-col gap-sm",
                invoice.status === 'Cancelada' && "opacity-75"
              )}>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className={cn("font-label-lg text-label-lg text-on-background", invoice.status === 'Cancelada' && "line-through")}>
                      {invoice.client}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{invoice.folio}</span>
                  </div>
                  <span className={cn("font-headline-lg-mobile text-headline-lg-mobile text-on-background", invoice.status === 'Cancelada' && "line-through text-outline")}>
                    ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-xs">
                  <div className="flex gap-sm items-center">
                    <div className={cn(
                      "px-2 py-1 rounded-md font-label-md text-label-md flex items-center gap-1",
                      invoice.status === 'Timbrada' ? "bg-secondary-container/20 text-secondary" :
                      invoice.status === 'Borrador' ? "bg-surface-container-highest text-on-surface-variant" :
                      "bg-error-container/20 text-error"
                    )}>
                      {invoice.status === 'Timbrada' ? <FileCheck size={14} className="fill-current" /> : 
                       invoice.status === 'Borrador' ? <FileEdit size={14} /> :
                       <AlertCircle size={14} className="fill-current" />}
                      {invoice.status}
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{invoice.date}</span>
                  </div>
                  <div className="flex gap-xs">
                    <button className="w-8 h-8 flex items-center justify-center rounded-full text-primary hover:bg-primary-fixed transition-colors" title="Reutilizar Factura">
                      <RotateCcw size={18} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors" title="Descargar">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  );
}

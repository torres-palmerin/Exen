import { useMemo, useState } from "react";
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
  actividadReciente?: any[];
}

export function History({ onNavigate, actividadReciente = [] }: HistoryProps) {
  const [dateFilterIndex, setDateFilterIndex] = useState(0);
  const [amountFilterIndex, setAmountFilterIndex] = useState(0);
  const [statusFilterIndex, setStatusFilterIndex] = useState(0);

  const dateFilters = ['Todas las fechas', 'Últimos 7 días', 'Últimos 30 días', 'Este año'];
  const amountFilters = ['Cualquier monto', 'Menos de $1,000', '$1,000 a $5,000', '$5,000 a $10,000', 'Más de $10,000'];
  const statusFilters = ['Estado', 'Timbrada', 'Borrador', 'Cancelada', 'Pagada', 'Pendiente'];

  const invoices: Invoice[] = actividadReciente.map((factura, index) => {
    const statusRaw = String(factura?.status ?? 'Timbrada').toLowerCase();
    const normalizedStatus: Invoice['status'] =
      statusRaw.includes('borr') ? 'Borrador' :
      statusRaw.includes('cancel') ? 'Cancelada' :
      statusRaw.includes('pend') ? 'Pendiente' :
      statusRaw.includes('pag') ? 'Pagada' :
      'Timbrada';

    return {
      id: String(factura?.id ?? factura?.uuid ?? factura?.folio ?? index),
      client: factura?.receptor?.razonSocial ?? factura?.client ?? factura?.receptor?.rfc ?? 'Sin receptor',
      amount: Number(factura?.total ?? factura?.amount ?? 0),
      date: factura?.fecha ?? factura?.date ?? 'Sin fecha',
      status: normalizedStatus,
      folio: factura?.folio ?? factura?.uuid ?? 'Sin folio',
    };
  });

  const filteredInvoices = useMemo(() => {
    const selectedDateFilter = dateFilters[dateFilterIndex];
    const selectedAmountFilter = amountFilters[amountFilterIndex];
    const selectedStatusFilter = statusFilters[statusFilterIndex];
    const now = new Date();

    return invoices.filter((invoice) => {
      if (selectedStatusFilter !== 'Estado' && invoice.status !== selectedStatusFilter) {
        return false;
      }

      if (selectedAmountFilter !== 'Cualquier monto') {
        if (selectedAmountFilter === 'Menos de $1,000' && invoice.amount >= 1000) return false;
        if (selectedAmountFilter === '$1,000 a $5,000' && (invoice.amount < 1000 || invoice.amount > 5000)) return false;
        if (selectedAmountFilter === '$5,000 a $10,000' && (invoice.amount < 5000 || invoice.amount > 10000)) return false;
        if (selectedAmountFilter === 'Más de $10,000' && invoice.amount <= 10000) return false;
      }

      if (selectedDateFilter !== 'Todas las fechas') {
        const parsedDate = Date.parse(invoice.date);

        if (Number.isNaN(parsedDate)) {
          return true;
        }

        const invoiceDate = new Date(parsedDate);

        if (selectedDateFilter === 'Últimos 7 días') {
          return now.getTime() - invoiceDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
        }

        if (selectedDateFilter === 'Últimos 30 días') {
          return now.getTime() - invoiceDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
        }

        if (selectedDateFilter === 'Este año') {
          return invoiceDate.getFullYear() === now.getFullYear();
        }
      }

      return true;
    });
  }, [amountFilterIndex, dateFilterIndex, invoices, statusFilterIndex]);

  const cycleFilter = (setter: React.Dispatch<React.SetStateAction<number>>, total: number) => {
    setter((current) => (current + 1) % total);
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen pb-[calc(116px+env(safe-area-inset-bottom))] pt-[64px] sm:pt-[72px] overflow-x-hidden">
      <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-md flex justify-between items-center px-3 sm:px-margin-mobile py-2 sm:py-base border-b border-surface-container-high/30">
        <div className="flex items-center gap-2 sm:gap-sm min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-surface-container-high flex-shrink-0">
            <img 
              alt="User profile" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqP9FmMjxWk0Et5jW36cuK-yz-i80rcXOfTmDMirv_Mi5MNrVG4kPkG3CWuIyUXdmGika_hUgahtTaGr6WqyKRbk269jSOgHj_Y5gBY8JNZGliJKgkPYQ-ArpA7gM8fNI8hME3HkNz93oS8a5T1DtuqRy4qB1G-imELafAgr8ROBG3JXAIlFhVek_W3VbgD6G6aDLeKhANEtLgAafURqiSiEr9Oj7YPSufrUZEU-07DhG6OSRgt_zBGmRwhlfBIcd41E5OaC3Piqk" 
            />
          </div>
          <span className="font-headline-lg-mobile text-[18px] sm:text-headline-lg-mobile text-primary font-bold tracking-tight">EXEN</span>
        </div>
        <button className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors shrink-0">
          <Bell size={20} className="sm:hidden" />
          <Bell size={24} className="hidden sm:block" />
        </button>
      </header>

      <main className="px-3 sm:px-6 flex flex-col gap-5 sm:gap-lg mt-2 sm:mt-md max-w-xl sm:max-w-2xl mx-auto w-full">
        <section className="flex flex-col gap-sm">
          <h2 className="font-headline-lg-mobile text-[24px] sm:text-headline-lg-mobile text-on-background">Historial de Facturas</h2>
          <div className="flex gap-2 sm:gap-sm items-center">
            <div className="relative flex-1">
              <Input 
                placeholder="Buscar cliente o ID..." 
                icon={<Search size={18} />} 
                className="py-3.5 bg-surface-container-low text-[15px]"
              />
            </div>
            <Button variant="secondary" className="px-3 rounded-xl shrink-0 w-11 h-11 sm:w-auto sm:h-auto sm:px-3">
              <SlidersHorizontal size={18} className="sm:hidden" />
              <SlidersHorizontal size={20} className="hidden sm:block" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-xs pb-1 sm:pb-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className={cn("whitespace-nowrap rounded-full bg-surface-container-lowest gap-1 px-3.5 py-2", dateFilterIndex !== 0 && "border-primary text-primary")}
              onClick={() => cycleFilter(setDateFilterIndex, dateFilters.length)}
            >
              {dateFilters[dateFilterIndex]} <ChevronDown size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn("whitespace-nowrap rounded-full bg-surface-container-lowest gap-1 px-3.5 py-2", amountFilterIndex !== 0 && "border-primary text-primary")}
              onClick={() => cycleFilter(setAmountFilterIndex, amountFilters.length)}
            >
              {amountFilters[amountFilterIndex]} <ChevronDown size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn("whitespace-nowrap rounded-full bg-surface-container-lowest gap-1 px-3.5 py-2", statusFilterIndex !== 0 && "border-primary text-primary")}
              onClick={() => cycleFilter(setStatusFilterIndex, statusFilters.length)}
            >
              {statusFilters[statusFilterIndex]} <ChevronDown size={16} />
            </Button>
          </div>
        </section>

        <section className="flex flex-col gap-md">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice, idx) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                  <Card className={cn(
                  "relative overflow-hidden flex flex-col gap-3 p-4 sm:p-md rounded-2xl",
                  invoice.status === 'Cancelada' && "opacity-75"
                )}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start">
                    <div className="flex flex-col min-w-0">
                      <span className={cn("font-label-lg text-[15px] sm:text-label-lg text-on-background", invoice.status === 'Cancelada' && "line-through") }>
                        {invoice.client}
                      </span>
                      <span className="font-body-sm text-[13px] sm:text-body-sm text-on-surface-variant">{invoice.folio}</span>
                    </div>
                    <span className={cn("font-headline-lg-mobile text-[20px] sm:text-headline-lg-mobile text-on-background", invoice.status === 'Cancelada' && "line-through text-outline") }>
                      ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mt-0 sm:mt-xs">
                    <div className="flex flex-wrap gap-2 items-center">
                      <div className={cn(
                        "px-2 py-1 rounded-md font-label-md text-[12px] sm:text-label-md flex items-center gap-1",
                        invoice.status === 'Timbrada' ? "bg-secondary-container/20 text-secondary" :
                        invoice.status === 'Borrador' ? "bg-surface-container-highest text-on-surface-variant" :
                        "bg-error-container/20 text-error"
                      )}>
                        {invoice.status === 'Timbrada' ? <FileCheck size={14} className="fill-current" /> : 
                         invoice.status === 'Borrador' ? <FileEdit size={14} /> :
                         <AlertCircle size={14} className="fill-current" />}
                        {invoice.status}
                      </div>
                      <span className="font-body-sm text-[13px] sm:text-body-sm text-on-surface-variant">{invoice.date}</span>
                    </div>
                    <div className="flex gap-1.5 self-end sm:self-auto">
                      <button className="w-8 h-8 flex items-center justify-center rounded-full text-primary hover:bg-primary-fixed transition-colors" title="Reutilizar Factura">
                        <RotateCcw size={16} className="sm:hidden" />
                        <RotateCcw size={18} className="hidden sm:block" />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors" title="Descargar">
                        <Download size={16} className="sm:hidden" />
                        <Download size={18} className="hidden sm:block" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="p-4 rounded-2xl border border-dashed border-surface-container-high bg-surface-container-lowest text-on-surface-variant">
              No hay facturas para los filtros actuales.
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}

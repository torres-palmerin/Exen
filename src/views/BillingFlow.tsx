import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { 
  ArrowLeft, 
  X, 
  Upload, 
  Sparkles, 
  Wand2, 
  Trash2, 
  Search, 
  ChevronDown, 
  ArrowRight,
  CheckCircle2,
  Code,
  FileText,
  Share2,
  LayoutDashboard,
  AlertCircle,
  Copy,
  ExternalLink,
  Send,
  Bell,
  ReceiptText
} from "lucide-react";
import { Screen } from "@/src/types";
import { cn } from "@/src/lib/utils";

interface BillingFlowProps {
  initialStep: Screen;
  onNavigate: (screen: Screen) => void;
}

export function BillingFlow({ initialStep, onNavigate }: BillingFlowProps) {
  const [step, setStep] = useState<Screen>(initialStep);

  useEffect(() => {
    if (step === 'onboarding_2') {
      const timer = setTimeout(() => setStep('dashboard'), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const renderHeader = (title: string, currentStep: number, totalSteps: number, subtitle?: string) => (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-surface-container">
      <div className="flex justify-between items-center px-margin-mobile py-sm w-full max-w-3xl mx-auto">
        <button 
          className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors"
          onClick={() => onNavigate('dashboard')}
        >
          {step === 'billing_preview' ? <ArrowLeft size={24} /> : <X size={24} />}
        </button>
        <div className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface text-center flex-1">{title}</div>
        <div className="w-10 h-10"></div>
      </div>
      <div className="w-full max-w-3xl mx-auto px-margin-mobile pb-sm">
        <div className="flex items-center justify-between font-label-md text-label-md text-on-surface-variant mb-xs">
          <span>Paso {currentStep} de {totalSteps}</span>
          {subtitle && <span>{subtitle}</span>}
        </div>
        <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out" 
          />
        </div>
      </div>
    </header>
  );

  if (step === 'onboarding_1') {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans">
        <header className="flex items-center justify-between px-margin-mobile py-md w-full max-w-2xl mx-auto mt-4">
          <Button variant="ghost" onClick={() => onNavigate('dashboard')} className="w-10 h-10 rounded-full p-0">
            <ArrowLeft size={24} />
          </Button>
          <div className="font-label-md text-label-md text-on-surface-variant px-sm py-xs bg-surface-container-low rounded-full border border-outline-variant/20">
            Paso 1 de 3
          </div>
          <div className="w-10"></div>
        </header>

        <main className="flex-1 flex flex-col px-margin-mobile pt-md pb-xl w-full max-w-2xl mx-auto">
          <section className="mb-lg">
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-sm">Sube tu Constancia de Situación Fiscal</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Para automatizar tu facturación y asegurar que cada comprobante sea válido ante el SAT, necesitamos extraer tus datos fiscales exactos.</p>
          </section>

          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="cursor-pointer"
            onClick={() => setStep('onboarding_2')}
          >
            <Card variant="dashed" className="p-lg flex flex-col items-center justify-center text-center gap-md py-[60px]">
               <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Upload size={32} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col items-center gap-xs">
                <h3 className="font-label-lg text-label-lg text-on-surface">Subir Constancia</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Arrastra y suelta o pulsa para buscar (PDF, PNG, JPG)</p>
              </div>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  if (step === 'onboarding_2') {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans">
        <main className="flex-1 flex flex-col items-center justify-center px-margin-mobile pt-md pb-xl w-full max-w-2xl mx-auto">
          <section className="bg-surface-container-lowest rounded-xl p-lg shadow-soft border border-outline-variant/20 relative overflow-hidden mb-xl flex flex-col items-center justify-center text-center w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-primary-fixed/20 z-0"></div>
            <div className="relative z-10 flex flex-col items-center w-full">
              <div className="relative w-20 h-20 mb-md flex items-center justify-center">
                <div className="absolute inset-0 bg-primary-fixed rounded-full opacity-50 scale-110 animate-pulse"></div>
                <div className="w-16 h-16 bg-surface-container-lowest rounded-2xl shadow-sm flex items-center justify-center border border-outline-variant/30">
                  <FileText size={32} className="text-primary fill-current opacity-20" />
                  <FileText size={32} className="text-primary absolute" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-surface-container-lowest rounded-full p-1 shadow-md border border-outline-variant/20">
                  <div className="bg-primary-container text-on-primary-container rounded-full w-8 h-8 flex items-center justify-center">
                    <Sparkles size={18} />
                  </div>
                </div>
              </div>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-xs">Analizando documento...</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg">Constancia_Fiscal_2023.pdf</p>
              
              <div className="w-full max-w-[240px] h-2 bg-surface-container-highest rounded-full overflow-hidden mb-sm">
                <motion.div 
                  initial={{ width: "10%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                  className="h-full bg-primary rounded-full shadow-[inset_0_1px_rgba(255,255,255,0.4)]"
                />
              </div>
              <div className="flex items-center gap-xs text-primary font-label-md text-label-md">
                <Wand2 size={14} /> Extrayendo RFC y Régimen Fiscal
              </div>
            </div>
          </section>

          <section className="opacity-40 pointer-events-none w-full">
            <h3 className="font-label-lg text-label-lg text-on-surface-variant mb-md px-xs">Datos detectados</h3>
            <div className="space-y-sm">
              <div className="w-full h-[56px] bg-surface-container rounded-lg border border-outline-variant/30 flex items-center px-md">
                <div className="w-1/3 h-4 bg-surface-variant rounded"></div>
              </div>
              <div className="w-full h-[56px] bg-surface-container rounded-lg border border-outline-variant/30 flex items-center px-md">
                <div className="w-2/3 h-4 bg-surface-variant rounded"></div>
              </div>
            </div>
          </section>

          <Button 
            variant="outline" 
            className="mt-auto w-full py-4 rounded-full gap-2"
            onClick={() => onNavigate('dashboard')}
          >
            <X size={20} /> Cancelar extracción
          </Button>
        </main>
      </div>
    );
  }

  if (step === 'billing_1') {
    return (
      <div className="bg-surface text-on-surface min-h-screen pt-[72px] pb-[100px] flex flex-col items-center">
        {/* Simple TopBar for Step 1 */}
        <header className="fixed top-0 w-full z-50 bg-surface flex justify-between items-center px-margin-mobile py-base border-b border-surface-container">
           <div className="flex items-center gap-sm">
             <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqP9FmMjxWk0Et5jW36cuK-yz-i80rcXOfTmDMirv_Mi5MNrVG4kPkG3CWuIyUXdmGika_hUgahtTaGr6WqyKRbk269jSOgHj_Y5gBY8JNZGliJKgkPYQ-ArpA7gM8fNI8hME3HkNz93oS8a5T1DtuqRy4qB1G-imELafAgr8ROBG3JXAIlFhVek_W3VbgD6G6aDLeKhANEtLgAafURqiSiEr9Oj7YPSufrUZEU-07DhG6OSRgt_zBGmRwhlfBIcd41E5OaC3Piqk" className="w-full h-full object-cover" />
             </div>
             <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">EXEN</span>
           </div>
           <button className="text-primary"><Bell size={24} /></button>
        </header>

        <main className="pt-8 px-margin-mobile flex flex-col gap-lg max-w-[600px] mx-auto w-full">
          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-xs text-primary mb-1">
              <ReceiptText size={16} />
              <span className="font-label-md text-label-md tracking-wider uppercase">Paso 1 de 3</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-background">Datos del Cliente</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Sube un documento fiscal para extracción o ingresa los detalles manualmente.</p>
          </div>

          <Card variant="dashed" className="py-[40px] flex flex-col items-center gap-md">
            <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <Upload size={32} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-center gap-xs">
              <h3 className="font-label-lg text-label-lg text-on-surface">Subir Constancia</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Arrastra y suelta o pulsa para buscar</p>
            </div>
          </Card>

          <div className="flex flex-col gap-md">
            <div className="flex items-center justify-between">
              <h2 className="font-label-lg text-label-lg text-on-background flex items-center gap-sm">
                <div className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center text-primary"><Sparkles size={14} /></div>
                Detalles extraídos por IA
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-sm">
              <Card className="col-span-2 relative overflow-hidden flex flex-col gap-xs">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed-dim/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                <span className="font-label-md text-label-md text-on-surface-variant z-10">RFC</span>
                <div className="flex justify-between items-center z-10">
                  <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface uppercase tracking-widest font-bold">XAXX010101000</span>
                  <span className="bg-surface-container-high text-primary px-sm py-[4px] rounded-full font-label-md text-label-md border border-primary/20">Física</span>
                </div>
              </Card>
              <div className="col-span-2 bg-error-container text-on-error-container p-md rounded-xl flex gap-md items-start shadow-sm border border-error/20">
                <AlertCircle size={20} className="text-error mt-0.5" />
                <div className="flex flex-col gap-xs">
                  <span className="font-label-lg text-label-lg font-bold">Acción Requerida</span>
                  <span className="font-body-sm text-body-sm">El régimen parece incompatible con el uso de CFDI seleccionado.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-md">
             <Input label="Nombre o Razón Social" defaultValue="Juan Pérez Gómez" />
             <div className="flex flex-col gap-xs">
               <label className="font-label-md text-label-md text-on-surface px-xs">Uso de CFDI</label>
               <div className="relative">
                 <select className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-xl px-md py-sm border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer transition-colors">
                   <option>G03 - Gastos en general</option>
                   <option>P01 - Por definir</option>
                   <option>I04 - Equipo de computo y accesorios</option>
                 </select>
                 <ChevronDown size={20} className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
               </div>
             </div>
             <Input label="Código Postal" defaultValue="01000" />
          </div>

          <div className="flex gap-sm pt-md mt-auto">
            <Button variant="outline" className="flex-1 rounded-[16px] py-4" onClick={() => onNavigate('dashboard')}>Cancelar</Button>
            <Button className="flex-[2] rounded-[16px] py-4 gap-xs" onClick={() => setStep('billing_2')}>
              Siguiente Paso <ArrowRight size={18} />
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (step === 'billing_2') {
    return (
      <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col">
        {renderHeader("Nueva Factura", 2, 3, "Conceptos")}

        <main className="flex-1 w-full max-w-3xl mx-auto px-margin-mobile pt-[140px] pb-xl flex flex-col gap-lg">
          <Card className="p-md relative group">
            <div className="flex justify-between items-center mb-md pb-xs border-b border-surface-container">
              <span className="font-label-lg text-label-lg text-on-surface">Partida 1</span>
              <button className="text-outline hover:text-error transition-colors"><Trash2 size={20} /></button>
            </div>
            <div className="flex flex-col gap-sm">
              <div className="relative">
                <Input 
                  label="Clave SAT" 
                  defaultValue="53111500" 
                  icon={<div className="font-bold text-lg mt-0.5">#</div>}
                  rightIcon={<div className="bg-primary/10 p-1 rounded-full text-primary"><Search size={16}/></div>}
                />
                <div className="mt-2 ml-1 bg-gradient-to-r from-surface-container-high to-surface-container-highest rounded-xl p-sm flex items-start gap-sm border border-primary/10">
                  <div className="bg-surface-container-lowest rounded-full p-1.5 shadow-sm mt-0.5">
                    <Sparkles size={18} className="text-primary fill-current" />
                  </div>
                  <div>
                    <p className="font-body-sm text-body-sm text-on-surface">
                      Parece que esta clave corresponde a <strong>calzado</strong> (Zapatos). Tu régimen fiscal principal es <strong>Servicios Profesionales</strong>.
                    </p>
                    <button className="mt-1 font-label-md text-label-md text-primary hover:underline flex items-center gap-1">
                      Revisar sugerencias <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <Input label="Descripción" defaultValue="Zapatos de trabajo" />
              <div className="grid grid-cols-2 gap-sm">
                <Input label="Cantidad" type="number" defaultValue={1} className="text-right" />
                <div className="flex flex-col gap-xs">
                  <label className="font-label-md text-label-md text-on-surface px-xs">Unidad SAT</label>
                  <div className="relative">
                    <select className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-xl px-md py-sm border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none pr-10">
                      <option>H87 - Pieza</option>
                      <option>E48 - Unidad de servicio</option>
                    </select>
                    <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-sm">
                <Input label="Precio Unitario" defaultValue="1,250.00" icon={<div className="mt-0.5">$</div>} className="text-right" />
                <div className="flex flex-col gap-xs">
                  <label className="font-label-md text-label-md text-on-surface px-xs">Impuesto (IVA)</label>
                  <div className="relative">
                    <select className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-xl px-md py-sm border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none pr-10">
                      <option>16% - Traslado</option>
                      <option>8% - Fronterizo</option>
                    </select>
                    <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Button variant="ghost" className="w-full py-4 rounded-2xl border-2 border-dashed border-outline-variant bg-transparent text-primary gap-1 hover:bg-surface-container-low hover:border-primary/50">
            <Send size={18} className="rotate-45" /> Agregar Concepto
          </Button>

          <Card className="mt-4 gap-2 flex flex-col">
            <h3 className="font-label-lg text-label-lg text-on-surface mb-sm">Resumen Partida 1</h3>
            <div className="flex justify-between text-on-surface-variant font-body-md">
              <span>Subtotal</span>
              <span>$1,250.00</span>
            </div>
            <div className="flex justify-between text-on-surface-variant font-body-md">
              <span>IVA (16%)</span>
              <span>$200.00</span>
            </div>
            <div className="h-px bg-outline-variant/30 my-1" />
            <div className="flex justify-between font-headline-lg-mobile text-on-surface">
              <span>Total</span>
              <span>$1,450.00</span>
            </div>
          </Card>

          <Button size="xl" className="w-full rounded-2xl gap-2 mt-4" onClick={() => setStep('billing_preview')}>
            Continuar a Revisión <ArrowRight size={20} />
          </Button>
        </main>
      </div>
    );
  }

  if (step === 'billing_preview') {
    return (
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col">
        <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md flex justify-between items-center px-margin-mobile py-base border-b border-surface-container-high/30">
          <div className="flex items-center gap-sm">
             <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqP9FmMjxWk0Et5jW36cuK-yz-i80rcXOfTmDMirv_Mi5MNrVG4kPkG3CWuIyUXdmGika_hUgahtTaGr6WqyKRbk269jSOgHj_Y5gBY8JNZGliJKgkPYQ-ArpA7gM8fNI8hME3HkNz93oS8a5T1DtuqRy4qB1G-imELafAgr8ROBG3JXAIlFhVek_W3VbgD6G6aDLeKhANEtLgAafURqiSiEr9Oj7YPSufrUZEU-07DhG6OSRgt_zBGmRwhlfBIcd41E5OaC3Piqk" className="w-full h-full object-cover" />
             </div>
             <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">EXEN</span>
          </div>
          <button className="text-primary"><Bell size={24} /></button>
        </header>

        <main className="flex-grow pt-[80px] pb-[160px] px-margin-mobile flex flex-col items-center">
          <div className="w-full max-w-3xl flex items-center gap-sm mb-lg">
            <Button variant="ghost" onClick={() => setStep('billing_2')} className="p-0 w-10 h-10 rounded-full"><ArrowLeft size={24}/></Button>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background">Vista Previa</h1>
          </div>

          <Card className="w-full max-w-3xl p-lg md:p-xl flex flex-col gap-xl">
            <div className="flex flex-col md:flex-row justify-between gap-lg border-b border-surface-container-high pb-lg">
              <div className="flex flex-col gap-xs">
                <span className="font-label-md text-label-md text-primary uppercase tracking-widest">Emisor</span>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Consultoría y Diseño S.A. de C.V.</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">RFC: XAXX010101000</p>
              </div>
              <div className="flex flex-col gap-xs md:text-right bg-surface-container-low p-sm rounded-lg border border-surface-container-high md:bg-transparent md:border-none md:p-0">
                <span className="font-label-md text-label-md text-primary uppercase tracking-widest mb-xs">Factura de Ingreso</span>
                <div className="flex justify-between md:justify-end gap-xl">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Folio</span>
                  <span className="font-label-lg text-label-lg text-on-surface">INV-2023-0042</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-sm">
              <span className="font-label-md text-label-md text-primary uppercase tracking-widest">Receptor</span>
              <div className="bg-surface-container-low rounded-lg p-md border border-surface-container-high">
                <h3 className="font-label-lg text-label-lg text-on-surface">Tecnologías de Innovación S.A.P.I.</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">RFC: TIS120304XYZ</p>
              </div>
            </div>

            <div className="flex flex-col gap-md">
              <span className="font-label-md text-label-md text-primary uppercase tracking-widest">Conceptos</span>
              <div className="flex justify-between items-start border-b border-surface-container pb-md">
                <div className="flex flex-col gap-xs">
                  <span className="font-body-md text-body-md text-on-surface font-medium">Servicios de diseño de interfaz de usuario</span>
                  <div className="flex items-center gap-xs font-label-md text-label-md text-on-surface-variant">
                    <CheckCircle2 size={14} className="text-secondary fill-current" /> Validado por IA
                  </div>
                </div>
                <div className="text-right flex flex-col">
                  <span className="font-body-md text-on-surface">$20,000.00</span>
                  <span className="font-label-md text-on-surface-variant">1.00 E48</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end pt-lg gap-2">
              <div className="w-full md:w-[40%] flex flex-col gap-sm">
                <div className="flex justify-between"><span className="text-on-surface-variant">Subtotal</span><span className="text-on-surface">$25,000.00</span></div>
                <div className="flex justify-between bg-primary-fixed p-sm rounded-lg font-headline-lg-mobile">
                  <span className="text-on-primary-fixed">Total</span>
                  <span className="text-on-primary-fixed">$29,000.00</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="fixed bottom-0 left-0 w-full z-40 bg-surface/80 backdrop-blur-xl border-t border-surface-container shadow-medium px-margin-mobile py-md flex justify-center">
             <div className="w-full max-w-3xl flex flex-col md:flex-row justify-end gap-sm md:gap-md">
                <Button variant="secondary" className="flex-1 py-4 rounded-full" onClick={() => onNavigate('dashboard')}>Guardar borrador</Button>
                <Button className="flex-1 py-4 rounded-full gap-2" onClick={() => setStep('billing_success')}>
                   <Wand2 size={20} /> Timbrar factura
                </Button>
             </div>
          </div>
        </main>
      </div>
    );
  }

  if (step === 'billing_success') {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center p-margin-mobile relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-fixed blur-[80px] rounded-full opacity-60 z-0"></div>
        <div className="w-full max-w-md relative z-10 flex flex-col gap-6">
          <Card className="p-8 flex flex-col items-center text-center rounded-3xl">
            <div className="w-24 h-24 rounded-full bg-primary-fixed flex items-center justify-center mb-6">
              <CheckCircle2 size={48} className="text-primary fill-current" />
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">Factura Timbrada</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8 px-4">Su documento ha sido procesado y certificado correctamente por el SAT.</p>
            
            <div className="grid grid-cols-3 gap-3 w-full">
              {[
                { icon: <Code size={20} />, label: 'XML' },
                { icon: <FileText size={20} />, label: 'PDF' },
                { icon: <Share2 size={20} />, label: 'Share' }
              ].map(item => (
                <button key={item.label} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors">
                  <div className="text-primary mb-2">{item.icon}</div>
                  <span className="font-label-md text-label-md text-primary">{item.label}</span>
                </button>
              ))}
            </div>
          </Card>
          <Button size="xl" className="w-full rounded-2xl gap-2" onClick={() => onNavigate('dashboard')}>
            <LayoutDashboard size={20} /> Volver al Tablero
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

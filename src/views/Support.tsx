import { motion } from "motion/react";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { 
  Bell, 
  Search, 
  Sparkles, 
  IdCard, 
  ReceiptText, 
  AlertCircle, 
  CalendarX, 
  BookOpen, 
  Headset,
  X,
  MessageSquareShare,
  ExternalLink,
  Copy,
  Send
} from "lucide-react";
import { Screen } from "@/src/types";

interface HelpProps {
  onNavigate: (screen: Screen) => void;
}

export function Help({ onNavigate }: HelpProps) {
  return (
    <div className="bg-surface-container-low text-on-surface font-body-md min-h-screen pb-[100px] pt-[72px]">
      <header className="fixed top-0 w-full z-50 bg-background flex justify-between items-center px-margin-mobile py-base border-b border-surface-container">
        <div className="flex items-center gap-md">
          <img 
            alt="User profile" 
            className="w-10 h-10 rounded-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRR_UeTLj4aJiIoxJzwy6DSY2c382ehe_n-gba0V12GBiatOq9RdlPLPAjnRYYJDV6LXUTzP_70NGvUVZNKO7AWvN60nx1DbmQUfI42QJvSip6l4FnmQ9k3SdvzCanZuienZ5B0zAJIek4P6iGurnvo7h6gNpJsXTlFMNkuo76KyyrmGsF3i50UcnzwFJnI8BfZTwgUueem7enqvdlmpkMDuKSs783vfHGrK7Bi5G3nIKkamgON3Rq8bI2JbbEXLoCNXz_nzU58Xw" 
          />
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">BillAssistant</h1>
        </div>
        <button className="text-primary hover:opacity-80 transition-opacity active:scale-95 transition-transform">
          <Bell size={24} />
        </button>
      </header>

      <main className="px-margin-mobile pt-6 space-y-lg max-w-2xl mx-auto">
        <section className="space-y-md">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Centro de Ayuda</h2>
          <div className="relative flex items-center">
            <Input 
              placeholder="¿Cómo podemos ayudarte?" 
              icon={<Search size={20} />} 
              className="py-4 bg-surface-container-lowest rounded-2xl ring-1 ring-outline-variant focus:ring-primary shadow-soft"
            />
          </div>
        </section>

        {/* AI Assistant CTA */}
        <section className="ai-gradient rounded-2xl p-lg text-on-primary shadow-medium relative overflow-hidden">
          <div className="relative z-10 space-y-md">
            <div className="flex items-center gap-base">
              <Sparkles size={18} className="fill-current" />
              <span className="font-label-lg text-label-lg uppercase tracking-wider">Potenciado por IA</span>
            </div>
            <div>
              <h3 className="font-headline-lg text-headline-lg-mobile mb-xs font-bold leading-tight">Asistente Fiscal IA</h3>
              <p className="font-body-sm text-body-sm opacity-90">Resuelve dudas sobre facturación, impuestos y folios en segundos con nuestra inteligencia artificial.</p>
            </div>
            <Button 
              className="bg-white text-primary rounded-2xl w-full"
              onClick={() => onNavigate('chat')}
            >
              Iniciar Chat Inteligente
            </Button>
          </div>
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        </section>

        {/* Common Issues */}
        <section className="space-y-md">
          <h4 className="font-label-lg text-label-lg text-outline uppercase tracking-widest">PROBLEMAS COMUNES</h4>
          <div className="space-y-sm">
            {[
              { icon: <IdCard size={20} />, title: "“Mi RFC no pasa”", desc: "Verifica que tu RFC esté activo y que la Razón Social coincida exactamente con tu Constancia." },
              { icon: <ReceiptText size={20} />, title: "“No encuentro el folio”", desc: "El folio suele estar en la parte superior derecha o debajo del código de barras." },
              { icon: <AlertCircle size={20} />, title: "“El portal no acepta mi ticket”", desc: "Asegúrate de no incluir guiones o espacios extras. Algunos portales tardan hasta 24h." }
            ].map((issue, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-md">
                    <div className="bg-primary-container/10 p-sm rounded-xl text-primary">
                      {issue.icon}
                    </div>
                    <div>
                      <h5 className="font-label-lg text-label-lg text-on-surface font-bold">{issue.title}</h5>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{issue.desc}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-sm pb-8">
          <button className="bg-surface-container p-md rounded-2xl flex flex-col items-center justify-center text-center gap-base active:scale-95 transition-all">
            <BookOpen size={24} className="text-primary" />
            <span className="font-label-md text-label-md">Guía de Uso</span>
          </button>
          <button className="bg-surface-container p-md rounded-2xl flex flex-col items-center justify-center text-center gap-base active:scale-95 transition-all">
            <Headset size={24} className="text-primary" />
            <span className="font-label-md text-label-md">Hablar con Humano</span>
          </button>
        </section>
      </main>
    </div>
  );
}

export function Chat({ onNavigate }: HelpProps) {
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col">
       <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md flex justify-between items-center px-margin-mobile py-base border-b border-surface-container">
        <div className="flex items-center gap-sm">
           <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high shrink-0">
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3sERb6DDSU8tRrwgId6QulumFgb4O0N7vyXHtrQ5dS2W3NVCD8hQrGcgGVIeh5pJ_9fqSjJyLS_9tDv1RIJ7lR3lJabYi5Qe-Ap8pZtmYX56uFf974DQpiGRRM4n7iwIurOxrD4z8bxrOUax59bccXxcLySkr1hZUxeaAH8vptG9eEeyJ2Wua9M5kPa3Jhq7nsL7LwGumvfVxUrrNU5TJVE0JKDjseV09AAFe5xz5E8N6SPTwdFCoRhG8rq3ueH0Vlg2tTjMgMzo" className="w-full h-full object-cover" />
           </div>
           <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">EXEN</span>
        </div>
        <button onClick={() => onNavigate('help')} className="text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95 transition-transform w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low">
          <X size={24} />
        </button>
      </header>

      <main className="flex-1 flex flex-col pt-[72px] pb-[100px] px-margin-mobile gap-lg overflow-y-auto max-w-3xl mx-auto w-full">
        <div className="w-full flex justify-center mt-sm">
          <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container-low px-sm py-xs rounded-full">Hoy, 10:42 AM</span>
        </div>

        {/* User Message */}
        <div className="flex flex-col items-end w-full">
          <div className="max-w-[75%] rounded-2xl rounded-tr-sm overflow-hidden shadow-soft border border-outline-variant/30 bg-surface-container-lowest">
             <img 
               alt="Uploaded Receipt" 
               className="w-full h-auto object-cover opacity-90" 
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuBb8eAB1buW1MBqEj7tiEPfS-zO_S402fbFICWT_Kw18FXjobIHUbWotdLWFgz-bxcMwH3gZLe1Bo8_ACoJWge3L5VAeLyorVwns9t3x8uGiHdfoHBgF2Pk2cpYAle1Y3WmldDlPm4nY3S3p1-mEQJ8GQNd6-j72sustT0cfLRQ_eTZ_l2mlrMjBFWfZlnth5zezDUbHquW0HP5IG1ZyKldKmH4tnqpuGYgiaS2MaG41KhJTVtwC3VdKhgOTlpKLl2A6QGhV2RYivc" 
             />
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant mt-xs mr-xs uppercase tracking-widest font-bold">Tú</span>
        </div>

        {/* AI Response */}
        <div className="flex flex-row items-start gap-sm w-full max-w-[95%] sm:max-w-[85%]">
          <div className="w-8 h-8 rounded-full ai-gradient flex items-center justify-center shadow-sm shrink-0 mt-xs">
            <Sparkles size={18} className="text-on-primary fill-current" />
          </div>
          <div className="flex flex-col gap-sm w-full">
            <div className="bg-surface-container-lowest shadow-soft border border-outline-variant/20 rounded-2xl rounded-tl-sm p-md text-on-surface">
              <p className="font-body-md text-body-md leading-relaxed">
                He detectado un ticket de <strong>KFC</strong> por un monto de <strong>$245.00 MXN</strong>. Este establecimiento requiere facturación manual en su portal externo. Aquí tienes todo lo necesario para hacerlo rápidamente.
              </p>
            </div>

            <Card className="p-0 overflow-hidden shadow-medium border-outline-variant/30">
               <div className="bg-surface-container-low px-md py-sm flex justify-between items-center border-b border-outline-variant/20">
                  <div className="flex items-center gap-xs">
                    <ReceiptText size={20} className="text-primary" />
                    <span className="font-label-lg text-label-lg text-on-surface font-bold">Portal de Facturación</span>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container rounded-md px-2 py-1">KFC</span>
               </div>
               <div className="p-md flex flex-col gap-6">
                  <Button className="w-full py-4 rounded-xl gap-2" size="lg">
                    Ir al Portal de KFC <ExternalLink size={20} />
                  </Button>

                  <div className="flex flex-col gap-sm">
                    <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tus Datos Fiscales</h3>
                    <div className="grid grid-cols-2 gap-sm">
                       <div className="bg-surface-container-low rounded-xl p-sm flex flex-col relative group">
                          <span className="font-label-md text-label-md text-outline">RFC</span>
                          <span className="font-body-md text-body-md font-bold text-on-surface mt-xs tracking-wider">GOMM900101XYZ</span>
                          <button className="absolute right-sm top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-primary flex items-center justify-center shadow-sm hover:bg-primary hover:text-white transition-all">
                             <Copy size={16}/>
                          </button>
                       </div>
                       <div className="bg-surface-container-low rounded-xl p-sm flex flex-col relative group">
                          <span className="font-label-md text-label-md text-outline">Código Postal</span>
                          <span className="font-body-md text-body-md font-bold text-on-surface mt-xs">11560</span>
                          <button className="absolute right-sm top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-primary flex items-center justify-center shadow-sm hover:bg-primary hover:text-white transition-all">
                             <Copy size={16}/>
                          </button>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-sm">
                    <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Instrucciones</h3>
                    <ol className="flex flex-col gap-6 relative border-l-2 border-surface-container ml-2 pl-sm">
                       <li className="relative">
                          <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-surface-container-lowest"></div>
                          <p className="font-body-sm text-body-sm text-on-surface mb-2">Ingresa el número de ticket (Referencia) en el portal.</p>
                          <div className="inline-flex items-center gap-sm bg-surface-container rounded-lg p-xs pr-sm border border-outline-variant/20">
                            <span className="font-label-md text-label-md text-on-surface font-mono tracking-widest pl-2">9876-5432-1098</span>
                            <button className="w-6 h-6 rounded-md bg-surface-container-highest text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                              <Copy size={14} />
                            </button>
                          </div>
                       </li>
                       <li className="relative">
                          <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-primary-fixed border-4 border-surface-container-lowest"></div>
                          <p className="font-body-sm text-body-sm text-on-surface">Pega tu RFC, CP y selecciona "Gastos en General" (G03).</p>
                       </li>
                    </ol>
                  </div>
               </div>
            </Card>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 w-full z-40 bg-surface/80 backdrop-blur-xl border-t border-outline-variant/20 px-margin-mobile py-sm pb-8">
        <div className="max-w-3xl mx-auto flex items-end gap-sm bg-surface-container-lowest rounded-2xl p-xs pl-md shadow-soft border border-outline-variant/30 focus-within:border-primary transition-all">
          <button className="text-on-surface-variant hover:text-primary transition-colors p-sm mb-0.5"><MessageSquareShare size={24} /></button>
          <textarea 
            className="flex-1 bg-transparent border-none focus:ring-0 text-body-md text-on-surface resize-none py-sm placeholder:text-outline max-h-[100px] min-h-[40px] outline-none" 
            placeholder="Pregunta algo o sube otro ticket..." 
            rows={1}
          />
          <button className="bg-primary hover:bg-primary-container text-on-primary rounded-xl w-10 h-10 flex items-center justify-center transition-colors active:scale-95 shrink-0 mb-0.5">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

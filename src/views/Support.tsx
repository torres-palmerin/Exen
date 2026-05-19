import { motion } from "motion/react";
import { useRef, useState, useEffect } from "react";
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
  BookOpen, 
  Headset,
  X,
  MessageSquareShare,
  ExternalLink,
  Copy,
  Send
} from "lucide-react";
import { Screen } from "@/src/types";
import { uploadTicket } from "@/src/services/s3Service";
import { askDeepSeek } from "@/src/services/deepSeekService";

interface HelpProps {
  onNavigate: (screen: Screen) => void;
}

interface TicketData {
  establecimiento: string;
  monto: number;
  rfc_emisor: string;
  folio_referencia: string;
  url_facturacion: string;
}

export function Help({ onNavigate }: HelpProps) {
  return (
    <div className="bg-surface-container-low text-on-surface font-body-md min-h-screen pb-[calc(130px+env(safe-area-inset-bottom))] pt-[64px] sm:pt-[72px] overflow-x-hidden">
      <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md flex justify-between items-center px-3 sm:px-margin-mobile py-2 sm:py-base border-b border-surface-container">
        <div className="flex items-center gap-2 sm:gap-md min-w-0">
          <img 
            alt="User profile" 
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRR_UeTLj4aJiIoxJzwy6DSY2c382ehe_n-gba0V12GBiatOq9RdlPLPAjnRYYJDV6LXUTzP_70NGvUVZNKO7AWvN60nx1DbmQUfI42QJvSip6l4FnmQ9k3SdvzCanZuienZ5B0zAJIek4P6iGurnvo7h6gNpJsXTlFMNkuo76KyyrmGsF3i50UcnzwFJnI8BfZTwgUueem7enqvdlmpkMDuKSs783vfHGrK7Bi5G3nIKkamgON3Rq8bI2JbbEXLoCNXz_nzU58Xw" 
          />
          <h1 className="font-headline-lg-mobile text-[18px] sm:text-headline-lg-mobile text-primary font-bold truncate">BillAssistant</h1>
        </div>
        <button className="text-primary hover:opacity-80 transition-opacity active:scale-95 transition-transform w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-surface-container-low shrink-0">
          <Bell size={20} className="sm:hidden" />
          <Bell size={24} className="hidden sm:block" />
        </button>
      </header>

      <main className="px-3 sm:px-6 pt-4 sm:pt-6 space-y-5 sm:space-y-lg max-w-xl sm:max-w-2xl mx-auto w-full">
        <section className="space-y-md">
          <h2 className="font-headline-lg-mobile text-[24px] sm:text-headline-lg-mobile text-on-surface">Centro de Ayuda</h2>
          <div className="relative flex items-center">
            <Input 
              placeholder="¿Cómo podemos ayudarte?" 
              icon={<Search size={20} />} 
              className="py-3.5 sm:py-4 bg-surface-container-lowest rounded-2xl ring-1 ring-outline-variant focus:ring-primary shadow-soft text-[15px]"
            />
          </div>
        </section>

        {/* AI Assistant CTA */}
        <section className="ai-gradient rounded-2xl p-4 sm:p-lg text-on-primary shadow-medium relative overflow-hidden">
          <div className="relative z-10 space-y-4 sm:space-y-md">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="fill-current sm:hidden" />
              <Sparkles size={18} className="fill-current hidden sm:block" />
              <span className="font-label-lg text-[14px] sm:text-label-lg uppercase tracking-wider">Potenciado por IA</span>
            </div>
            <div>
              <h3 className="font-headline-lg text-[22px] sm:text-headline-lg-mobile mb-1 font-bold leading-tight">Asistente Fiscal IA</h3>
              <p className="font-body-sm text-[14px] sm:text-body-sm opacity-90 leading-relaxed">Resuelve dudas sobre facturación, impuestos y folios en segundos con nuestra intelligence artificial.</p>
            </div>
            <Button 
              className="bg-white text-primary rounded-2xl w-full py-3 sm:py-4"
              onClick={() => onNavigate('chat')}
            >
              Iniciar Chat Inteligente
            </Button>
          </div>
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        </section>

        {/* Common Issues */}
        <section className="space-y-3 sm:space-y-md">
          <h4 className="font-label-lg text-[13px] sm:text-label-lg text-outline uppercase tracking-widest">PROBLEMAS COMUNES</h4>
          <div className="space-y-2.5 sm:space-y-sm">
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
                <Card className="hover:border-primary/50 transition-colors cursor-pointer p-3 sm:p-md rounded-2xl">
                  <div className="flex items-start gap-3 sm:gap-md">
                    <div className="bg-primary-container/10 p-2 sm:p-sm rounded-xl text-primary shrink-0">
                      {issue.icon}
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-label-lg text-[14px] sm:text-label-lg text-on-surface font-bold leading-snug">{issue.title}</h5>
                      <p className="font-body-sm text-[13px] sm:text-body-sm text-on-surface-variant leading-relaxed">{issue.desc}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-2.5 pb-8">
          <button className="bg-surface-container p-3 sm:p-md rounded-2xl flex flex-col items-center justify-center text-center gap-2 sm:gap-base active:scale-95 transition-all min-h-[92px]">
            <BookOpen size={22} className="text-primary sm:hidden" />
            <BookOpen size={24} className="text-primary hidden sm:block" />
            <span className="font-label-md text-[13px] sm:text-label-md leading-tight">Guía de Uso</span>
          </button>
          <button className="bg-surface-container p-3 sm:p-md rounded-2xl flex flex-col items-center justify-center text-center gap-2 sm:gap-base active:scale-95 transition-all min-h-[92px]">
            <Headset size={22} className="text-primary sm:hidden" />
            <Headset size={24} className="text-primary hidden sm:block" />
            <span className="font-label-md text-[13px] sm:text-label-md leading-tight">Hablar con Humano</span>
          </button>
        </section>
      </main>
    </div>
  );
}

export function Chat({ onNavigate }: HelpProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<any>>([
    { id: 1, type: "assistant", text: "Hola, ¿en qué puedo ayudarte hoy? Puedes hacerme una consulta fiscal o subir un ticket de compra." }
  ]);
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [inputText, setInputText] = useState("");

  const currencyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  const processTicketWithAI = async (fileName: string) => {
    const lambdaUrl = "https://lj32endf3uoiccltrr33lamkqy0nokam.lambda-url.us-east-2.on.aws/";
    const response = await fetch(lambdaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileName }),
    });

    if (!response.ok) {
      throw new Error(`La API respondió con estado ${response.status}`);
    }

    const data: TicketData = await response.json();
    return data;
  };

  const handleUploadAndProcess = async (file: File) => {
    setLoading(true);
    setError(null);
    setTicketData(null);

    try {
      const fileName = await uploadTicket(file);
      
      // Añadir la burbuja de imagen del usuario al historial
      setMessages((prev) => [
        ...prev, 
        { id: Date.now(), type: "user", image: URL.createObjectURL(file) }
      ]);
      
      const data = await processTicketWithAI(fileName);
      setTicketData(data);

      // Añadir la respuesta humanizada de la IA al historial
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "assistant",
          text: `He detectado un ticket de ${data.establecimiento} por un monto de ${currencyFormatter.format(data.monto)}. Este establecimiento requiere facturación manual en su portal externo. Aquí tienes todo lo necesario para hacerlo rápidamente.`
        }
      ]);
    } catch (err) {
      console.error("Fallo el proceso completo:", err);
      setError("No se pudo completar la subida y análisis del ticket.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuestion = async () => {
    const question = inputText.trim();
    if (!question) return;

    setLoading(true);
    setError(null);

    // Añadir el mensaje de texto del usuario al chat
    setMessages((prev) => [...prev, { id: Date.now(), type: "user", text: question }]);
    setInputText("");

    try {
      const answer = await askDeepSeek(question);
      
      // Validamos estructuralmente que no sea una fuga de JSON crudo
      if (!answer.includes("```json") && !answer.startsWith("{")) {
        setMessages((prev) => [...prev, { id: Date.now() + 1, type: "assistant", text: answer }]);
      }
    } catch (err: any) {
      console.error("Error llamando a DeepSeek:", err);
      setError("Error al consultar DeepSeek.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error("No se pudo copiar el valor:", err);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col overflow-x-hidden">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md flex justify-between items-center px-3 sm:px-margin-mobile py-2 sm:py-base border-b border-surface-container">
        <div className="flex items-center gap-2 sm:gap-sm min-w-0">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high shrink-0">
            <img src="[https://lh3.googleusercontent.com/aida-public/AB6AXuA3sERb6DDSU8tRrwgId6QulumFgb4O0N7vyXHtrQ5dS2W3NVCD8hQrGcgGVIeh5pJ_9fqSjJyLS_9tDv1RIJ7lR3lJabYi5Qe-Ap8pZtmYX56uFf974DQpiGRRM4n7iwIurOxrD4z8bxrOUax59bccXxcLySkr1hZUxeaAH8vptG9eEeyJ2Wua9M5kPa3Jhq7nsL7LwGumvfVxUrrNU5TJVE0JKDjseV09AAFe5xz5E8N6SPTwdFCoRhG8rq3ueH0Vlg2tTjMgMzo](https://lh3.googleusercontent.com/aida-public/AB6AXuA3sERb6DDSU8tRrwgId6QulumFgb4O0N7vyXHtrQ5dS2W3NVCD8hQrGcgGVIeh5pJ_9fqSjJyLS_9tDv1RIJ7lR3lJabYi5Qe-Ap8pZtmYX56uFf974DQpiGRRM4n7iwIurOxrD4z8bxrOUax59bccXxcLySkr1hZUxeaAH8vptG9eEeyJ2Wua9M5kPa3Jhq7nsL7LwGumvfVxUrrNU5TJVE0JKDjseV09AAFe5xz5E8N6SPTwdFCoRhG8rq3ueH0Vlg2tTjMgMzo)" className="w-full h-full object-cover" alt="Profile" />
          </div>
          <span className="font-headline-lg-mobile text-[16px] sm:text-headline-lg-mobile text-primary font-bold truncate">EXEN</span>
        </div>
        <button onClick={() => onNavigate('help')} className="text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95 transition-transform w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-surface-container-low shrink-0">
          <X size={20} className="sm:hidden" />
          <X size={24} className="hidden sm:block" />
        </button>
      </header>

      <main className="flex-1 flex flex-col pt-[64px] sm:pt-[72px] pb-[calc(120px+env(safe-area-inset-bottom))] px-3 sm:px-6 gap-4 sm:gap-lg overflow-y-auto max-w-xl sm:max-w-3xl mx-auto w-full">
        <div className="w-full flex justify-center mt-3 sm:mt-sm">
          <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container-low px-sm py-xs rounded-full">Hoy</span>
        </div>

        {/* Mapeo del historial dinámico de conversación */}
        {messages.map((m) => (
          m.type === 'user' ? (
            <div key={m.id} className="flex flex-col items-end w-full animate-fade-in">
              <div className="max-w-[86%] sm:max-w-[75%] rounded-2xl rounded-tr-sm overflow-hidden shadow-soft border border-outline-variant/30 bg-surface-container-lowest">
                 {m.image ? (
                   <img alt="Uploaded Receipt" className="w-full h-auto object-cover opacity-90" src={m.image} />
                 ) : (
                   <div className="p-3.5">{m.text}</div>
                 )}
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant mt-xs mr-xs uppercase tracking-widest font-bold">Tú</span>
            </div>
          ) : (
            <div key={m.id} className="flex flex-row items-start gap-3 w-full max-w-[95%] sm:max-w-[85%] animate-fade-in">
              <div className="w-8 h-8 rounded-full ai-gradient flex items-center justify-center shadow-sm shrink-0 mt-xs">
                <Sparkles size={18} className="text-on-primary fill-current" />
              </div>
              <div className="bg-surface-container-lowest shadow-soft border border-outline-variant/20 rounded-2xl rounded-tl-sm p-3.5 sm:p-md text-on-surface w-full">
                <p className="font-body-md text-body-md leading-relaxed">{m.text}</p>
              </div>
            </div>
          )
        ))}

        {/* Indicador de procesamiento técnico */}
        {loading && (
          <div className="flex flex-row items-start gap-3 w-full max-w-[85%] animate-pulse">
            <div className="w-8 h-8 rounded-full ai-gradient flex items-center justify-center shadow-sm shrink-0 mt-xs animate-spin">
              <Sparkles size={18} className="text-on-primary fill-current" />
            </div>
            <span className="text-body-md text-on-surface-variant italic p-2">EXEN está analizando los datos fiscales...</span>
          </div>
        )}

        {/* Despliegue de error */}
        {error && (
          <div className="flex flex-row items-start gap-3 w-full max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center shadow-sm shrink-0 mt-xs">
              <AlertCircle size={18} />
            </div>
            <div className="bg-surface-container-lowest shadow-soft border border-error/20 rounded-2xl rounded-tl-sm p-3.5 text-error w-full">
              <p className="font-body-md text-body-md leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Tarjeta estructurada interactiva de Facturación */}
        {ticketData && !loading && (
          <div className="w-full max-w-[95%] sm:max-w-[85%] ml-0 sm:ml-11 animate-fade-in">
            <Card className="p-0 overflow-hidden shadow-medium border-outline-variant/30 rounded-2xl">
              <div className="bg-surface-container-low px-3 sm:px-md py-2 sm:py-sm flex justify-between items-center border-b border-outline-variant/20">
                <div className="flex items-center gap-xs">
                  <ReceiptText size={20} className="text-primary" />
                  <span className="font-label-lg text-label-lg text-on-surface font-bold">Portal de Facturación</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container rounded-md px-2 py-1 truncate max-w-[45%]">
                  {ticketData.establecimiento}
                </span>
              </div>
              <div className="p-3.5 sm:p-md flex flex-col gap-4 sm:gap-6">
                <Button
                  className="w-full py-3 sm:py-4 rounded-xl gap-2"
                  size="lg"
                  onClick={() => {
                    if (ticketData?.url_facturacion) {
                      window.open(ticketData.url_facturacion, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  disabled={!ticketData?.url_facturacion}
                >
                  Ir al Portal de {ticketData.establecimiento}
                  <ExternalLink size={20} />
                </Button>

                <div className="flex flex-col gap-sm">
                  <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Datos detectados</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     <div className="bg-surface-container-low rounded-xl p-3 sm:p-sm flex items-center justify-between gap-3">
                        <div className="flex flex-col min-w-0">
                          <span className="font-label-md text-label-md text-outline">RFC emisor</span>
                          <span className="font-body-md text-body-md font-bold text-on-surface mt-xs tracking-wider truncate">
                            {ticketData.rfc_emisor}
                          </span>
                        </div>
                        <button
                          className="w-8 h-8 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-primary flex items-center justify-center shadow-sm hover:bg-primary hover:text-white transition-all flex-shrink-0"
                          onClick={() => handleCopy(ticketData.rfc_emisor)}
                          type="button"
                        >
                          <Copy size={14}/>
                        </button>
                     </div>
                     <div className="bg-surface-container-low rounded-xl p-3 sm:p-sm flex items-center justify-between gap-3">
                        <div className="flex flex-col min-w-0">
                          <span className="font-label-md text-label-md text-outline">Monto</span>
                          <span className="font-body-md text-body-md font-bold text-on-surface mt-xs truncate">
                            {currencyFormatter.format(ticketData.monto)}
                          </span>
                        </div>
                        <button
                          className="w-8 h-8 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-primary flex items-center justify-center shadow-sm hover:bg-primary hover:text-white transition-all flex-shrink-0"
                          onClick={() => handleCopy(currencyFormatter.format(ticketData.monto))}
                          type="button"
                        >
                          <Copy size={14}/>
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
                          <span className="font-label-md text-label-md text-on-surface font-mono tracking-widest pl-2">
                            {ticketData.folio_referencia}
                          </span>
                          <button
                            className="w-6 h-6 rounded-md bg-surface-container-highest text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                            onClick={() => handleCopy(ticketData.folio_referencia)}
                            type="button"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                     </li>
                     <li className="relative">
                        <div className="absolute -left-[23px] top-0 w-4 h-4 rounded-full bg-primary-fixed border-4 border-surface-container-lowest"></div>
                        <p className="font-body-sm text-body-sm text-on-surface">
                          Usa el RFC del emisor y completa los datos requeridos en el portal para generar tu factura.
                        </p>
                     </li>
                  </ol>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Input de Control Inferior */}
      <div className="fixed bottom-0 w-full z-40 bg-surface/80 backdrop-blur-xl border-t border-outline-variant/20 px-3 sm:px-6 py-2 sm:py-sm pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        <div className="max-w-xl sm:max-w-3xl mx-auto w-full flex items-end gap-2 sm:gap-sm bg-surface-container-lowest rounded-2xl p-2 sm:p-xs pl-3 sm:pl-md shadow-soft border border-outline-variant/30 focus-within:border-primary transition-all">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={async (e) => {
              const files = e.target.files;
              if (!files || files.length === 0) return;
              const file = files[0];
              try {
                await handleUploadAndProcess(file);
              } catch (err) {
                console.error(err);
              } finally {
                e.target.value = "";
              }
            }}
          />
          <button
            onClick={() => !loading && fileInputRef.current?.click()}
            disabled={loading}
            className="text-on-surface-variant hover:text-primary transition-colors p-2 sm:p-sm mb-0.5 disabled:opacity-60"
            type="button"
          >
            <MessageSquareShare size={20} />
          </button>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-body-md text-on-surface resize-none py-2 sm:py-sm placeholder:text-outline max-h-[100px] min-h-[44px] outline-none" 
            placeholder="Pregunta algo o sube otro ticket..." 
            rows={1}
          />
          <button 
            onClick={handleSendQuestion} 
            className="bg-primary hover:bg-primary-container text-on-primary rounded-xl w-10 h-10 flex items-center justify-center transition-colors active:scale-95 shrink-0 mb-0.5 disabled:opacity-60" 
            disabled={loading || inputText.trim().length === 0} 
            type="button"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
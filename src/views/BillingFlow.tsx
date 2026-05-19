import { useEffect, useRef, useState, type ChangeEvent } from "react";
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

const constanciaUploadUrl = "https://xk3u35x4enmdny6tyy2r4kuwn40ydhvq.lambda-url.us-east-2.on.aws/";
const readFiscalProfileUrl = "https://6uszlsniryljwxtogksobjttw40auyij.lambda-url.us-east-2.on.aws/";

interface BillingFiscalData {
  rfc: string;
  razonSocial: string;
  regimenFiscal: string;
  codigoPostal: string;
}

interface BillingCustomerForm extends BillingFiscalData {
  usoCfdi: string;
}

const emptyFiscalData: BillingFiscalData = {
  rfc: "",
  razonSocial: "",
  regimenFiscal: "",
  codigoPostal: "",
};

const emptyBillingCustomerForm: BillingCustomerForm = {
  ...emptyFiscalData,
  usoCfdi: "G03 - Gastos en general",
};

const CFDI_OPTIONS: string[] = [
  'G01 - Adquisición de mercancías',
  'G02 - Devoluciones, descuentos o bonificaciones',
  'G03 - Gastos en general',
  'I01 - Construcciones',
  'I02 - Mobiliario y equipo de oficina por inversiones',
  'I03 - Equipo de transporte',
  'I04 - Equipo de cómputo y accesorios',
  'I05 - Dados, troqueles, moldes, matrices y herramental',
  'I06 - Comunicaciones telefónicas',
  'I07 - Comunicaciones satelitales',
  'I08 - Otra maquinaria y equipo',
  'D01 - Honorarios médicos, dentales y gastos hospitalarios',
  'D02 - Gastos médicos por incapacidad o discapacidad',
  'D03 - Gastos funerales',
  'D04 - Donativos',
  'D05 - Intereses reales efectivamente pagados por créditos hipotecarios',
  'D06 - Aportaciones voluntarias al SAR',
  'D07 - Primas por seguros de gastos médicos',
  'D08 - Gastos de transportación escolar obligatoria',
  'D09 - Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones',
  'D10 - Pagos por servicios educativos (colegiaturas)',
  'CP01 - Pagos (Exclusivo para complementos de pago)',
  'CN01 - Nómina (Exclusivo para recibos de sueldos y salarios)',
  'S01 - Sin efectos fiscales',
];

const formatUsoCfdi = (value?: string) => {
  if (!value) return '';
  const trimmed = value.trim();
  if (CFDI_OPTIONS.includes(trimmed)) return trimmed;
  const codeMatch = trimmed.match(/^[A-Z0-9]{2,4}/);
  const code = codeMatch ? codeMatch[0] : trimmed.split(/\s|-|:/)[0];
  const found = CFDI_OPTIONS.find((o) => o.startsWith(code));
  return found ?? trimmed;
};

const SAT_UNITS_CATALOG = [
  { code: "E48", description: "Unidad de servicio" },
  { code: "H87", description: "Pieza" },
  { code: "KGM", description: "Kilogramo" },
  { code: "LTR", description: "Litro" },
  { code: "MTR", description: "Metro" },
  { code: "F61", description: "Caja" },
  { code: "XPK", description: "Paquete" },
  { code: "SET", description: "Conjunto" },
  { code: "ACT", description: "Actividad" },
  { code: "DAY", description: "Día" },
  { code: "HUR", description: "Hora" },
  { code: "TNE", description: "Tonelada métrica" },
  { code: "MLT", description: "Mililitro" },
  { code: "MTK", description: "Metro cuadrado" },
  { code: "MTQ", description: "Metro cúbico" },
  { code: "XKI", description: "Kit" },
  { code: "A9",  description: "Tarifa" },
  { code: "S01", description: "Sin efectos fiscales (Unidad)" }
];

const conceptLambdaUrl = "https://2qfuxxj3q7ilubmfyevab66jly0ewolt.lambda-url.us-east-2.on.aws/";

interface BillingFlowProps {
  initialStep: Screen;
  onNavigate: (screen: Screen) => void;
  onGuardarFactura?: (nuevaFactura: any) => Promise<void> | void;
  invoice?: any;
}

export function BillingFlow({ initialStep, onNavigate, onGuardarFactura, invoice: invoiceProp }: BillingFlowProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [step, setStep] = useState<Screen>(initialStep);
  const [uploading, setUploading] = useState(false);
  
  // 🛡️ ¡COLOCA ESTAS LÍNEAS AQUÍ ARRIBA! (Fuera de cualquier IF)
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUnitOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [billingCustomerForm, setBillingCustomerForm] = useState<BillingCustomerForm>(emptyBillingCustomerForm);
  const [emitterProfile, setEmitterProfile] = useState<{ rfc: string; razonSocial: string; regimenFiscal: string; codigoPostal: string } | null>(null);
  const [savingInvoice, setSavingInvoice] = useState(false);
  
  const initialConcept = {
    claveSat: "53111500",
    descripcion: "Zapatos de trabajo",
    cantidad: 1,
    unidadSat: "H87",
    precioUnitario: 1250,
    iva: 0.16,
  };

  const [conceptos, setConceptos] = useState(() => [initialConcept]);
  const [unitSearch, setUnitSearch] = useState<Record<number, string | undefined>>({});
  const [unitOpenIndex, setUnitOpenIndex] = useState<number | null>(null);
  const [conceptAssistant, setConceptAssistant] = useState<Record<number, { descripcionOficial?: string; advertencia?: string }>>({});
  const [iaLoadingIndex, setIaLoadingIndex] = useState<number | null>(null);

  const selectedInvoice = (() => {
    // Prefer invoice passed as prop from the parent
    if (invoiceProp) return invoiceProp;

    // Only read history state when this BillingFlow was opened as a preview
    if (initialStep !== 'billing_preview') return null;

    if (typeof window === 'undefined') return null;
    const state = window.history.state;
    if (!state || typeof state !== 'object') return null;
    return (state as Record<string, unknown>).selectedInvoice ?? null;
  })();

  const updateConcept = (index: number, patch: Partial<typeof initialConcept>) => {
    setConceptos((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };

  const addConcept = () => {
    setConceptos((prev) => [...prev, { ...initialConcept, claveSat: '', descripcion: '', cantidad: 1, unidadSat: 'H87', precioUnitario: 0, iva: 0.16 }]);
  };

  const removeConcept = (index: number) => {
    setConceptos((prev) => prev.filter((_, i) => i !== index));
  };

  const searchConceptByDescription = async (index: number, description: string) => {
    try {
      const query = description.trim();
      if (!query) return;
      setIaLoadingIndex(index);
      
      const res = await fetch(conceptLambdaUrl, {
        method: 'POST',
        body: JSON.stringify({
          busquedaUsuario: query,
          regimenFiscal: billingCustomerForm.regimenFiscal || "605",
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const textError = await res.text();
        throw new Error(`Error ${res.status}: ${textError || 'No se pudo consultar la IA'}`);
      }

      const data = await res.json();
      const claveSat = data?.claveSat;
      const descripcionOficial = data?.descripcionOficial;
      const unidadSugerida = data?.unidadSugerida;
      const advertencia = data?.advertencia;

      if (claveSat || unidadSugerida) {
        updateConcept(index, {
          claveSat: claveSat ? String(claveSat) : conceptos[index]?.claveSat,
          unidadSat: unidadSugerida ? String(unidadSugerida) : conceptos[index]?.unidadSat,
        });
      }

      if (descripcionOficial || advertencia) {
        setConceptAssistant((current) => ({
          ...current,
          [index]: {
            descripcionOficial: descripcionOficial ? String(descripcionOficial) : current[index]?.descripcionOficial,
            advertencia: advertencia ? String(advertencia) : current[index]?.advertencia,
          },
        }));
      }
    } catch (e) {
      console.warn('searchConceptByDescription failed', e);
    } finally {
      setIaLoadingIndex((current) => (current === index ? null : current));
    }
  };

  useEffect(() => {
    if (step === 'onboarding_2') {
      const timer = setTimeout(() => setStep('dashboard'), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const readBrowserSessionState = () => {
    if (typeof window === 'undefined') return {} as Record<string, unknown>;
    const state = window.history.state;
    if (!state || typeof state !== 'object') return {} as Record<string, unknown>;
    return state as Record<string, unknown>;
  };

  const fetchEmitterProfile = async () => {
    try {
      const session = readBrowserSessionState();
      const email = String(session.userEmail ?? '');
      if (!email) return;
      const res = await fetch(`${readFiscalProfileUrl}?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok || !data) return;
      const extracted = data?.datos ?? data?.profile ?? data?.data ?? data;
      setEmitterProfile({
        rfc: extracted?.rfc ?? '',
        razonSocial: extracted?.razon_social ?? extracted?.razonSocial ?? '',
        regimenFiscal: extracted?.regimen_fiscal ?? extracted?.regimenFiscal ?? '',
        codigoPostal: extracted?.codigo_postal ?? extracted?.cp ?? '',
      });
    } catch (err) {
      console.warn('[BillingFlow] no se pudo cargar el perfil del emisor', err);
    }
  };

  useEffect(() => {
    void fetchEmitterProfile();
  }, []);

  useEffect(() => {
    if (!selectedInvoice) {
      return;
    }

    const invoice = selectedInvoice as any;
    const receptor = invoice?.receptor ?? {};
    const conceptoDescripcion = invoice?.concepto ?? invoice?.conceptos?.[0]?.descripcion ?? '';
    const conceptoClaveSat = invoice?.claveSat ?? invoice?.conceptos?.[0]?.claveSat ?? '';
    const conceptoUnidadSat = invoice?.unidadSat ?? invoice?.conceptos?.[0]?.unidadSat ?? 'H87';
    const conceptoCantidad = Number(invoice?.conceptos?.[0]?.cantidad ?? 1) || 1;
    const conceptoPrecio = Number(invoice?.conceptos?.[0]?.precioUnitario ?? invoice?.subtotal ?? invoice?.total ?? 0);
    const conceptoIva = Number(invoice?.ivaTasa ?? invoice?.conceptos?.[0]?.iva ?? 0.16) || 0.16;

    setBillingCustomerForm((currentForm) => ({
      ...currentForm,
      razonSocial: receptor?.razonSocial ?? receptor?.client ?? currentForm.razonSocial,
      rfc: receptor?.rfc ?? currentForm.rfc,
      regimenFiscal: receptor?.regimenFiscal ?? currentForm.regimenFiscal,
      codigoPostal: receptor?.codigoPostal ?? currentForm.codigoPostal,
      usoCfdi: currentForm.usoCfdi,
    }));

    setConceptos([
      {
        claveSat: String(conceptoClaveSat || '53111500'),
        descripcion: String(conceptoDescripcion || 'Concepto sin nombre'),
        cantidad: conceptoCantidad,
        unidadSat: String(conceptoUnidadSat || 'H87'),
        precioUnitario: conceptoPrecio,
        iva: conceptoIva,
      },
    ]);

    if (invoice?.status === 'borrador') {
      setStep('billing_preview');
    }
  }, [selectedInvoice]);

  const fileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;

        if (typeof result !== 'string') {
          reject(new Error('No se pudo leer el archivo'));
          return;
        }

        resolve(result);
      };

      reader.onerror = () => reject(new Error('No se pudo convertir el archivo a base64'));
      reader.readAsDataURL(file);
    });
  };

  const extractBillingFiscalData = (data: any): BillingFiscalData => {
    const extracted = data?.datos ?? data?.profile ?? data?.data ?? data;

    return {
      rfc: extracted?.rfc ?? '',
      razonSocial: extracted?.razon_social ?? extracted?.razonSocial ?? '',
      regimenFiscal: extracted?.regimen_fiscal ?? extracted?.regimeFiscal ?? '',
      codigoPostal: extracted?.codigo_postal ?? extracted?.cp ?? '',
    };
  };

  const handleCustomerFieldChange = (field: keyof BillingCustomerForm) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.value;

    setBillingCustomerForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  // 1. Subtotal limpio basado en cantidad y precio unitario
  const subtotal = Number(conceptos.reduce((s, c) => s + (Number(c.cantidad) || 0) * (Number(c.precioUnitario) || 0), 0).toFixed(2));

  // 2. IVA corregido: forzamos que si el valor es mayor a 1 (ej. 16), se divida entre 100 para ser 0.16
  const ivaMonto = Number(conceptos.reduce((s, c) => {
    const importeConcepto = (Number(c.cantidad) || 0) * (Number(c.precioUnitario) || 0);

    // Si c.iva es un string "16" o número 16, lo convierte a 0.16. Si ya es 0.16, lo mantiene.
    const tasaRaw = Number(c.iva) || 0.16;
    const tasaIva = tasaRaw > 1 ? tasaRaw / 100 : tasaRaw;

    return s + (importeConcepto * tasaIva);
  }, 0).toFixed(2));

  // 3. Total sumando los valores numéricos ya corregidos
  const total = Number((subtotal + ivaMonto).toFixed(2));
  const totalConceptos = `${conceptos.length} concepto${conceptos.length !== 1 ? 's' : ''}`;
  const anyInvalid = conceptos.some(c => !c.claveSat || !c.descripcion || !(Number(c.cantidad) > 0) || !(Number(c.precioUnitario) > 0) || !c.unidadSat);
  const selectedInvoiceData = selectedInvoice as any;

  const generatedUuid = (() => {
    if (selectedInvoiceData?.uuid && String(selectedInvoiceData.uuid).trim()) {
      return String(selectedInvoiceData.uuid);
    }

    if (selectedInvoiceData?.folio && String(selectedInvoiceData.folio).trim()) {
      return String(selectedInvoiceData.folio).replace(/[^A-Za-z0-9]/g, '').slice(0, 8).toUpperCase();
    }

    return `SIM-${Date.now().toString(36).toUpperCase()}`;
  })();

  const descargarXML = () => {
    const now = new Date();
    const fechaActual = `${now.toISOString().split('T')[0]}T${now.toTimeString().split(' ')[0]}`;
    const tasaIvaConceptoPrincipal = Number(conceptos[0]?.iva) || 0.16;
    const tasaIvaNormalizada = tasaIvaConceptoPrincipal > 1 ? tasaIvaConceptoPrincipal / 100 : tasaIvaConceptoPrincipal;

    const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:cfdi="http://www.sat.gob.mx/cfd/4" xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd" Version="4.0" Serie="INV" Folio="2026" Fecha="${fechaActual}" SubTotal="${subtotal.toFixed(2)}" Total="${Number(total).toFixed(2)}" TipoDeComprobante="I" Exportacion="01" Moneda="MXN">
  <cfdi:Emisor Rfc="CDI180422ABC" Nombre="CONSULTORIA Y DISEÑO SA DE CV" RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="${billingCustomerForm.rfc.toUpperCase()}" Nombre="${billingCustomerForm.razonSocial.toUpperCase()}" DomicilioFiscalReceptor="${billingCustomerForm.codigoPostal}" RegimenFiscalReceptor="${billingCustomerForm.regimenFiscal}" UsoCFDI="${billingCustomerForm.usoCfdi.split(' ')[0]}"/>
  <cfdi:Conceptos>
    ${conceptos.map((c) => {
      const tasaRaw = Number(c.iva) || 0.16;
      const tasaIva = tasaRaw > 1 ? tasaRaw / 100 : tasaRaw;
      const importeConcepto = (Number(c.cantidad) || 0) * (Number(c.precioUnitario) || 0);
      const importeIvaConcepto = importeConcepto * tasaIva;

      return `
    <cfdi:Concepto ClaveProdServ="${c.claveSat}" Cantidad="${c.cantidad}" ClaveUnidad="${c.unidadSat}" Descripcion="${c.descripcion.toUpperCase()}" ValorUnitario="${c.precioUnitario.toFixed(2)}" Importe="${importeConcepto.toFixed(2)}" ObjetoImp="02">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado Base="${importeConcepto.toFixed(2)}" Impuesto="002" TipoFactor="Tasa" TasaOCuota="${tasaIva.toFixed(6)}" Importe="${importeIvaConcepto.toFixed(2)}"/>
        </cfdi:Traslados>
      </cfdi:Impuestos>
    </cfdi:Concepto>`;
    }).join('')}
  </cfdi:Conceptos>
  <cfdi:Complemento>
    <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" xsi:schemaLocation="http://www.sat.gob.mx/TimbreFiscalDigital http://www.sat.gob.mx/sitio_internet/cfd/TimbreFiscalDigital/TimbreFiscalDigitalv11.xsd" Version="1.1" UUID="${generatedUuid}" FechaTimbrado="${fechaActual}" SelloCFD="SimuladoEXENAI..." SelloSAT="SimuladoSATAI..."/>
  </cfdi:Complemento>
</cfdi:Comprobante>`.trim();

    const blob = new Blob([xmlContent], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Factura_${generatedUuid.substring(0, 8)}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const descargarPDF = () => {
    window.print();
  };

const handleBillingUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setUploadError(null);
    setSelectedFileName(file.name);

    try {
      const fileBase64 = await fileToBase64(file);

      const response = await fetch(constanciaUploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileBase64 }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'No se pudo procesar la constancia');
      }

      setBillingCustomerForm((currentForm) => {
        const extracted = extractBillingFiscalData(data);
        const rawUso = data?.datos?.uso_cfdi ?? data?.datos?.usoCfdi ?? data?.uso_cfdi ?? data?.usoCfdi;
        return {
          ...currentForm,
          ...extracted,
          usoCfdi: rawUso ? formatUsoCfdi(String(rawUso)) : currentForm.usoCfdi,
        };
      });

      // ⚡ TRANSICIÓN AUTOMÁTICA: Después de extraer los datos con éxito, avanzamos al Paso 2
      setStep('billing_2');

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado al subir la constancia';
      setUploadError(message);
      console.error('[BillingFlow] error al subir constancia:', error);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const guardarEnDynamo = async (nuevaFactura: any) => {
    if (!onGuardarFactura) {
      return;
    }

    setSavingInvoice(true);

    try {
      await onGuardarFactura(nuevaFactura);
    } finally {
      setSavingInvoice(false);
    }
  };

  const handleFinalizeInvoice = async () => {
    const nuevaFactura = {
      id: `${Date.now()}`,
      folio: `#${String(Date.now()).slice(-4)}`,
      receptor: {
        razonSocial: billingCustomerForm.razonSocial,
        rfc: billingCustomerForm.rfc,
        regimenFiscal: billingCustomerForm.regimenFiscal,
        codigoPostal: billingCustomerForm.codigoPostal,
      },
      subtotal,
      ivaMonto,
      ivaTasa: conceptos[0]?.iva ?? 0.16,
      total,
      status: 'Timbrada',
      fecha: new Date().toISOString(),
      conceptos,
      emisor: emitterProfile ?? {
        rfc: billingCustomerForm.rfc,
        razonSocial: billingCustomerForm.razonSocial,
        regimenFiscal: billingCustomerForm.regimenFiscal,
        codigoPostal: billingCustomerForm.codigoPostal,
      },
    };

    try {
      const res = await fetch(conceptLambdaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'guardar',
          factura: nuevaFactura,
        }),
      });

      if (res.ok) {
        await guardarEnDynamo(nuevaFactura);
        setStep('billing_success');
      }
    } catch (error) {
      console.error('Error al guardar la factura en DynamoDB:', error);
    }
  };

  const manejarGuardarBorrador = async () => {
    const nuevoBorrador = {
      id: `fac-${Date.now()}`,
      folio: `BORR-${Math.floor(1000 + Math.random() * 9000)}`,
      uuid: 'N/A',
      emisor: {
        razonSocial: emitterProfile?.razonSocial || 'Consultoría y Diseño S.A. de C.V.',
        rfc: emitterProfile?.rfc || 'CDI180422ABC',
      },
      receptor: {
        razonSocial: billingCustomerForm.razonSocial,
        rfc: billingCustomerForm.rfc,
      },
      concepto: conceptos[0]?.descripcion || 'Concepto sin nombre',
      claveSat: conceptos[0]?.claveSat || '',
      unidadSat: conceptos[0]?.unidadSat || 'H87',
      subtotal,
      ivaMonto,
      ivaTasa: conceptos[0]?.iva ?? 0.16,
      total,
      fecha: new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'borrador',
    };

    try {
      const res = await fetch(conceptLambdaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion: 'guardar',
          factura: nuevoBorrador,
        }),
      });

      if (res.ok) {
        if (onGuardarFactura) {
          await onGuardarFactura(nuevoBorrador);
        }

        onNavigate('dashboard');
      }
    } catch (error) {
      console.error('Error al guardar el borrador en DynamoDB:', error);
    }
  };

  const renderHeader = (title: string, currentStep: number, totalSteps: number, subtitle?: string) => (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-surface-container">
      <div className="flex justify-between items-center px-4 sm:px-6 py-sm w-full max-w-3xl mx-auto">
        <button 
          className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors"
          onClick={() => onNavigate('dashboard')}
        >
          {step === 'billing_preview' ? <ArrowLeft size={24} /> : <X size={24} />}
        </button>
        <div className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface text-center flex-1">{title}</div>
        <div className="w-10 h-10"></div>
      </div>
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-sm">
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
      <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans overflow-x-hidden">
        <header className="flex items-center justify-between px-4 sm:px-6 pt-2 pb-3 w-full max-w-2xl mx-auto mt-2">
          <Button variant="ghost" onClick={() => onNavigate('dashboard')} className="w-10 h-10 rounded-full p-0">
            <ArrowLeft size={24} />
          </Button>
          <div className="font-label-md text-label-md text-on-surface-variant px-3 py-1 bg-surface-container-low rounded-full border border-outline-variant/20">
            Paso 1 de 3
          </div>
          <div className="w-10"></div>
        </header>

        <main className="flex-1 flex flex-col px-4 sm:px-6 pt-1 pb-[calc(5rem+env(safe-area-inset-bottom))] w-full max-w-2xl mx-auto">
          <section className="mb-5 sm:mb-lg">
            <h1 className="font-headline-xl text-[24px] sm:text-headline-xl leading-tight text-on-surface mb-2">
              Sube tu Constancia de Situación Fiscal
            </h1>
            <p className="font-body-md text-[14px] sm:text-body-md leading-relaxed text-on-surface-variant max-w-[34rem]">
              Para automatizar tu facturación y asegurar que cada comprobante sea válido ante el SAT, necesitamos extraer tus datos fiscales exactos.
            </p>
          </section>

          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="cursor-pointer"
            onClick={() => setStep('onboarding_2')}
          >
            <Card variant="dashed" className="p-4 sm:p-lg flex flex-col items-center justify-center text-center gap-3 py-[72px] sm:py-[84px] min-h-[260px] sm:min-h-[300px]">
               <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Upload size={28} strokeWidth={2.5} className="sm:hidden" />
                <Upload size={32} strokeWidth={2.5} className="hidden sm:block" />
              </div>
              <div className="flex flex-col items-center gap-xs">
                <h3 className="font-label-lg text-label-lg text-on-surface">Subir Constancia</h3>
                <p className="font-body-sm text-[14px] sm:text-body-sm text-on-surface-variant max-w-[22rem] leading-relaxed">
                  Arrastra y suelta o pulsa para buscar (PDF, PNG, JPG)
                </p>
              </div>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  if (step === 'onboarding_2') {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans overflow-x-hidden">
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-3 pb-[calc(5rem+env(safe-area-inset-bottom))] w-full max-w-2xl mx-auto">
          <section className="bg-surface-container-lowest rounded-xl p-4 sm:p-lg shadow-soft border border-outline-variant/20 relative overflow-hidden mb-8 sm:mb-xl flex flex-col items-center justify-center text-center w-full min-h-[320px] sm:min-h-[360px]">
            <div className="absolute inset-0 bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-primary-fixed/20 z-0"></div>
            <div className="relative z-10 flex flex-col items-center w-full">
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 mb-md flex items-center justify-center">
                <div className="absolute inset-0 bg-primary-fixed rounded-full opacity-50 scale-110 animate-pulse"></div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-surface-container-lowest rounded-2xl shadow-sm flex items-center justify-center border border-outline-variant/30">
                  <FileText size={28} className="text-primary fill-current opacity-20 sm:hidden" />
                  <FileText size={32} className="text-primary fill-current opacity-20 hidden sm:block" />
                  <FileText size={28} className="text-primary absolute sm:hidden" />
                  <FileText size={32} className="text-primary absolute hidden sm:block" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-surface-container-lowest rounded-full p-1 shadow-md border border-outline-variant/20">
                  <div className="bg-primary-container text-on-primary-container rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                    <Sparkles size={16} className="sm:hidden" />
                    <Sparkles size={18} className="hidden sm:block" />
                  </div>
                </div>
              </div>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-xs">Analizando documento...</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-5">Constancia_Fiscal_2023.pdf</p>
              
              <div className="w-full max-w-[240px] h-2 bg-surface-container-highest rounded-full overflow-hidden mb-3">
                <motion.div 
                  initial={{ width: "10%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                  className="h-full bg-primary rounded-full shadow-[inset_0_1px_rgba(255,255,255,0.4)]"
                />
              </div>
              <div className="flex items-center gap-xs text-primary font-label-md text-label-md text-center px-2">
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
  // ⚡ PANTALLA DE CARGA INTERMEDIA PARA EXTRACCIÓN DE CONSTANCIA
  if (uploading) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col font-sans overflow-x-hidden">
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-3 pb-[calc(5rem+env(safe-area-inset-bottom))] w-full max-w-2xl mx-auto">
          <section className="bg-surface-container-lowest rounded-xl p-4 sm:p-lg shadow-soft border border-outline-variant/20 relative overflow-hidden mb-8 sm:mb-xl flex flex-col items-center justify-center text-center w-full min-h-[320px] sm:min-h-[360px]">
            <div className="absolute inset-0 bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-primary-fixed/20 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center w-full">
              {/* Spinner Animado con Iconografía Estilizada */}
              <div className="relative w-20 h-20 mb-md flex items-center justify-center">
                <div className="absolute inset-0 bg-primary-fixed rounded-full opacity-40 scale-110 animate-ping"></div>
                <div className="w-16 h-16 bg-surface-container-lowest rounded-2xl shadow-sm flex items-center justify-center border border-outline-variant/30">
                  <FileText size={32} className="text-primary absolute" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-surface-container-lowest rounded-full p-1 shadow-md border border-outline-variant/20">
                  <div className="bg-primary-container text-on-primary-container rounded-full w-8 h-8 flex items-center justify-center animate-spin">
                    <Sparkles size={18} />
                  </div>
                </div>
              </div>

              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-xs font-bold">
                EXEN está leyendo tu Constancia
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-5 truncate max-w-[280px]">
                {selectedFileName || "Procesando archivo fiscal..."}
              </p>
              
              {/* Barra de progreso de simulación de carga asíncrona */}
              <div className="w-full max-w-[240px] h-2 bg-surface-container-highest rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: "5%" }}
                  animate={{ width: "95%" }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="h-full bg-primary rounded-full shadow-[inset_0_1px_rgba(255,255,255,0.4)]"
                />
              </div>

              {/* Mensaje dinámico de ejecución de procesos */}
              <div className="flex items-center gap-xs text-primary font-label-md text-label-md text-center px-2 animate-pulse">
                <Wand2 size={14} /> Mapeando RFC, Razón Social y Régimen Fiscal
              </div>
            </div>
          </section>

          <Button 
            variant="outline" 
            className="w-full py-4 rounded-full gap-2"
            disabled
          >
            Por favor, espera un momento...
          </Button>
        </main>
      </div>
    );
  }
  if (step === 'billing_1') {
    return (
      <div className="bg-[radial-gradient(circle_at_top,_rgba(39,100,255,0.08),_transparent_36%),linear-gradient(180deg,#fbfcff_0%,#f5f7ff_100%)] text-on-surface min-h-screen pt-[72px] pb-[calc(120px+env(safe-area-inset-bottom))] flex flex-col items-center overflow-x-hidden">
        <header className="fixed top-0 w-full z-50 bg-surface/78 backdrop-blur-md flex justify-between items-center px-4 sm:px-6 py-base border-b border-surface-container-high/40">
           <div className="flex items-center gap-sm min-w-0">
             <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high shrink-0 shadow-sm">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqP9FmMjxWk0Et5jW36cuK-yz-i80rcXOfTmDMirv_Mi5MNrVG4kPkG3CWuIyUXdmGika_hUgahtTaGr6WqyKRbk269jSOgHj_Y5gBY8JNZGliJKgkPYQ-ArpA7gM8fNI8hME3HkNz93oS8a5T1DtuqRy4qB1G-imELafAgr8ROBG3JXAIlFhVek_W3VbgD6G6aDLeKhANEtLgAafURqiSiEr9Oj7YPSufrUZEU-07DhG6OSRgt_zBGmRwhlfBIcd41E5OaC3Piqk" className="w-full h-full object-cover" />
             </div>
             <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold truncate">EXEN</span>
           </div>
           <button className="text-primary shrink-0"><Bell size={24} /></button>
        </header>

        <main className="w-full max-w-3xl px-4 sm:px-6 pt-6 flex flex-col gap-5">
          <section className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 text-primary">
              <ReceiptText size={16} />
              <span className="font-label-md text-label-md tracking-wider uppercase">Paso 1 de 3</span>
            </div>
            <h1 className="font-headline-xl text-[28px] sm:text-headline-xl text-on-background">Datos del Cliente</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Sube tu constancia fiscal o captura los datos a mano; la carga solo sirve para autocompletar.
            </p>
          </section>

          <Card className="p-0 overflow-hidden border border-surface-container-high shadow-soft bg-surface-container-lowest">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex flex-col items-center justify-center gap-3 px-4 py-12 sm:py-16 text-center bg-[linear-gradient(180deg,rgba(39,100,255,0.03),rgba(39,100,255,0.00))] hover:bg-[linear-gradient(180deg,rgba(39,100,255,0.06),rgba(39,100,255,0.01))] transition-colors disabled:opacity-70"
            >
              <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-sm">
                <Upload size={30} strokeWidth={2.4} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-label-lg text-label-lg text-on-surface">Subir constancia</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl">
                  Arrastra y suelta o pulsa para buscar. PDF o imagen.
                </p>
                {selectedFileName && !uploading && (
                  <span className="font-label-md text-label-md text-primary mt-1">Último archivo: {selectedFileName}</span>
                )}
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              onChange={handleBillingUpload}
            />
          </Card>

          {uploadError && (
            <div className="rounded-2xl border border-error-container bg-error-container/20 px-4 py-3 text-error text-sm leading-relaxed">
              {uploadError}
            </div>
          )}

          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles size={16} />
              <h2 className="font-label-lg text-label-lg">Captura manual</h2>
            </div>

            <Card className="p-4 sm:p-6 md:p-7 shadow-soft border border-surface-container-high">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="RFC"
                  value={billingCustomerForm.rfc}
                  onChange={handleCustomerFieldChange('rfc')}
                  placeholder="XAXX010101000"
                  className="uppercase"
                />
                <Input
                  label="Código Postal"
                  value={billingCustomerForm.codigoPostal}
                  onChange={handleCustomerFieldChange('codigoPostal')}
                  placeholder="01000"
                />
                <div className="md:col-span-2">
                  <Input
                    label="Nombre o Razón Social"
                    value={billingCustomerForm.razonSocial}
                    onChange={handleCustomerFieldChange('razonSocial')}
                    placeholder="Nombre o razón social"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Régimen Fiscal"
                    value={billingCustomerForm.regimenFiscal}
                    onChange={handleCustomerFieldChange('regimenFiscal')}
                    placeholder="Régimen fiscal"
                  />
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-on-surface-variant leading-relaxed">
                Si subes la constancia, estos campos se rellenan automáticamente y luego puedes ajustarlos manualmente.
              </div>
            </Card>

            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-surface px-xs">Uso de CFDI</label>
              <div className="relative">
                <select
                  value={billingCustomerForm.usoCfdi}
                  onChange={handleCustomerFieldChange('usoCfdi')}
                  className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-xl px-md py-sm border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer transition-colors"
                >
                  {CFDI_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" className="w-full rounded-[16px] py-4" onClick={() => onNavigate('dashboard')}>
                Cancelar
              </Button>
              <Button className="w-full rounded-[16px] py-4 gap-xs" onClick={() => setStep('billing_2')} disabled={uploading || !billingCustomerForm.rfc || !billingCustomerForm.razonSocial || !billingCustomerForm.regimenFiscal || !billingCustomerForm.codigoPostal}>
                Siguiente Paso <ArrowRight size={18} />
              </Button>
            </div>
          </section>
        </main>
      </div>
    );
  }

if (step === 'billing_2') {

    return (
      <div className="bg-[radial-gradient(circle_at_top,_rgba(39,100,255,0.08),_transparent_32%),linear-gradient(180deg,#fbfcff_0%,#f5f7ff_100%)] text-on-surface font-body-md antialiased min-h-screen flex flex-col overflow-x-hidden">
        {renderHeader("Nueva Factura", 2, 3, "Conceptos")}

        <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-6 pt-[128px] pb-[calc(7rem+env(safe-area-inset-bottom))] flex flex-col gap-4">
          <Card className="p-3.5 sm:p-6 md:p-7 shadow-soft border border-surface-container-high bg-white rounded-3xl">
            <div className="mt-2 space-y-5">
              {conceptos.map((c, idx) => {
                const unitQuery = unitSearch[idx] ?? '';
                const displayLabel = SAT_UNITS_CATALOG.find(u => u.code === c.unidadSat)?.description
                  ? `${c.unidadSat} - ${SAT_UNITS_CATALOG.find(u => u.code === c.unidadSat)!.description}`
                  : c.unidadSat;
                const q = (unitQuery || '').toLowerCase();
                const filtered = SAT_UNITS_CATALOG.filter(u => u.code.toLowerCase().includes(q) || u.description.toLowerCase().includes(q));

                return (
                  <div key={idx} className="relative rounded-2xl border border-primary/10 bg-surface-container-lowest p-3.5 sm:p-5 shadow-sm">
                    {/* Encabezado del Concepto */}
                    <div className="flex items-start justify-between gap-4 pb-2 border-b border-surface-container-high mb-3">
                      <div className="min-w-0">
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary-fixed px-3 py-1 font-label-md text-label-md text-primary mb-1">
                          <Sparkles size={14} /> Concepto {idx + 1}
                        </span>
                        <h3 className="font-headline-sm text-on-surface font-bold text-[16px] sm:text-headline-sm">Datos del concepto</h3>
                      </div>
                      <button 
                        type="button"
                        className="text-outline hover:text-error transition-colors shrink-0 p-1" 
                        aria-label="Eliminar concepto" 
                        onClick={() => removeConcept(idx)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Input de Descripción Principal */}
                    <Input
                      label="Descripción / ¿Qué vas a facturar?"
                      value={c.descripcion}
                      onChange={(e) => updateConcept(idx, { descripcion: e.target.value })}
                      placeholder="Ej. Zapatos de trabajo"
                    />
                    
                    {/* Botón de Asistente de IA */}
                    <div className="mt-2 flex justify-end">
                      <Button
                        type="button"
                        variant="secondary"
                        className="rounded-full px-4 text-xs sm:text-sm py-1.5 h-auto font-medium"
                        onClick={() => searchConceptByDescription(idx, c.descripcion)}
                        disabled={iaLoadingIndex === idx || !c.descripcion.trim()}
                      >
                        {iaLoadingIndex === idx ? 'Buscando clave oficial...' : 'Llenar con IA'}
                      </Button>
                    </div>

                    {/* Spinner de Carga de la IA */}
                    {iaLoadingIndex === idx && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-primary pl-1 animate-pulse">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
                        <span>Buscando equivalencia fiscal óptima...</span>
                      </div>
                    )}

                    {/* Bloque de sugerencias del Asistente IA (Curación en la fuente) */}
                    {conceptAssistant[idx] && (conceptAssistant[idx]?.descripcionOficial || conceptAssistant[idx]?.advertencia) && (
                      <div className="mt-2 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-2.5 text-xs sm:text-sm text-on-surface leading-relaxed">
                        {conceptAssistant[idx]?.descripcionOficial && (
                          <p><span className="font-semibold text-primary">Descripción oficial:</span> {conceptAssistant[idx]?.descripcionOficial}</p>
                        )}
                        {conceptAssistant[idx]?.advertencia && (
                          <p className="mt-1"><span className="font-semibold text-amber-600">Compatibilidad fiscal:</span> {conceptAssistant[idx]?.advertencia}</p>
                        )}
                      </div>
                    )}

                    {/* Input de Clave SAT */}
                    <div className="mt-3">
                      <Input
                        label="Clave SAT"
                        value={c.claveSat}
                        onChange={(e) => updateConcept(idx, { claveSat: e.target.value })}
                        icon={<div className="font-bold text-md mt-0.5 text-outline">#</div>}
                        rightIcon={<div className="bg-primary/10 p-1 rounded-full text-primary"><Search size={14} /></div>}
                      />
                    </div>

                    {/* Grid Ajustado para Controles Móviles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                      
                      {/* STEPPER DE CANTIDAD ERGONÓMICO */}
                      <div className="flex flex-col gap-xs">
                        <label className="font-label-md text-label-md text-on-surface px-1">Cantidad</label>
                        <div className="flex items-center bg-surface-container-low rounded-full p-1 border border-outline-variant/30 h-[48px] w-full justify-between">
                          <button
                            type="button"
                            className="w-10 h-10 rounded-full bg-white text-on-surface font-bold shadow-sm flex items-center justify-center active:scale-90 transition-transform select-none"
                            onClick={() => {
                              const currentVal = Number(c.cantidad) || 0;
                              if (currentVal > 1) updateConcept(idx, { cantidad: currentVal - 1 });
                            }}
                          >
                            -
                          </button>
                          <span className="font-label-lg text-label-lg px-4 text-on-surface font-bold font-mono">
                            {c.cantidad}
                          </span>
                          <button
                            type="button"
                            className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold shadow-md flex items-center justify-center active:scale-90 transition-transform select-none"
                            onClick={() => {
                              const currentVal = Number(c.cantidad) || 0;
                              updateConcept(idx, { cantidad: currentVal + 1 });
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                        <div className="flex flex-col gap-xs relative" ref={unitOpenIndex === idx ? menuRef : null}>
                          <label className="font-label-md text-label-md text-on-surface px-1">Unidad SAT</label>
                          <div className="relative">
                            <input
                              type="text"
                              readOnly={unitOpenIndex !== idx} // Permite escritura solo al abrir
                              value={unitOpenIndex === idx ? (unitSearch[idx] ?? '') : displayLabel}
                              
                              // ⚡ EL FIX: Al hacer click alternamos el estado. Si ya estaba abierto para este índice, lo cerramos.
                              onClick={(e) => {
                                if (unitOpenIndex === idx) {
                                  setUnitOpenIndex(null);
                                  (e.target as HTMLInputElement).blur(); // Quita el foco para que no se quede atrapado
                                } else {
                                  setUnitOpenIndex(idx);
                                  setUnitSearch(prev => ({ ...prev, [idx]: '' }));
                                }
                              }}
                              
                              onChange={(e) => setUnitSearch(prev => ({ ...prev, [idx]: e.target.value }))}
                              placeholder="Buscar unidad... (Ej. Pieza)"
                              className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-full px-4 py-3 border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none pr-10 truncate h-[48px] shadow-inner cursor-pointer"
                            />
                            
                            {/* Ícono de flecha interactivo que también ayuda a cerrar */}
                            <div 
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline cursor-pointer p-1"
                              onClick={() => setUnitOpenIndex(unitOpenIndex === idx ? null : idx)}
                            >
                              <ChevronDown size={18} />
                            </div>
                          <AnimatePresence>
                            {unitOpenIndex === idx && (
                              <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute left-0 right-0 z-50 mt-2 max-h-52 overflow-y-auto rounded-2xl border border-surface-container shadow-xl bg-white p-1"
                              >
                                <ul className="divide-y divide-surface-container-low">
                                  {(unitSearch[idx] ? filtered : SAT_UNITS_CATALOG).map((opt) => (
                                    <li
                                      key={opt.code}
                                      onMouseDown={(ev) => { 
                                        ev.preventDefault(); 
                                        updateConcept(idx, { unidadSat: opt.code }); 
                                        setUnitOpenIndex(null); 
                                        setUnitSearch(prev => ({ ...prev, [idx]: undefined })); 
                                      }}
                                      className="px-4 py-2.5 hover:bg-primary/5 active:bg-primary/10 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-2"
                                    >
                                      <div className="min-w-0">
                                        <span className="font-bold text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md mr-2">{opt.code}</span>
                                        <span className="text-sm font-medium text-on-surface">{opt.description}</span>
                                      </div>
                                    </li>
                                  ))}
                                  {filtered.length === 0 && unitSearch[idx] && (
                                    <li className="px-4 py-3 text-xs text-on-surface-variant text-center">No se encontraron unidades</li>
                                  )}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Inputs de Dinero e Impuestos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                      <Input
                        label="Precio Unitario"
                        type="number"
                        step="0.01"
                        inputMode="decimal"
                        value={c.precioUnitario || ''}
                        onChange={(event) => {
                          const val = Number(event.target.value);
                          updateConcept(idx, { precioUnitario: Number.isFinite(val) ? val : 0 });
                        }}
                        icon={<div className="mt-0.5 text-outline">$</div>}
                        className="text-right h-[48px]"
                      />

                      <div className="flex flex-col gap-xs">
                        <label className="font-label-md text-label-md text-on-surface px-1">Impuesto (IVA)</label>
                        <div className="relative">
                          <select
                            value={c.iva}
                            onChange={(event) => updateConcept(idx, { iva: Number(event.target.value) })}
                            className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-xl px-4 py-3 border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none pr-10 h-[48px] shadow-inner cursor-pointer"
                          >
                            <option value={0.16}>16% - Traslado</option>
                            <option value={0.08}>8% - Fronterizo</option>
                          </select>
                          <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Botón Añadir Concepto Extra */}
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface-variant">
            <span className="font-body-sm text-body-sm">Puedes agregar más conceptos cuando lo necesites.</span>
            <Button variant="ghost" className="gap-1 px-0 text-primary" onClick={addConcept}>
              <Send size={18} className="rotate-45" /> Agregar concepto
            </Button>
          </div>

          {/* Resumen Final de Contabilidad en la Pantalla */}
          <div className="mt-4">
            <div className="rounded-[24px] bg-white border border-outline-variant/10 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-label-lg text-label-lg text-on-surface">Resumen</h3>
                <span className="font-label-md text-label-md text-on-surface-variant">{totalConceptos}</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="rounded-lg bg-surface-container-lowest px-4 py-3">
                  <div className="text-sm text-on-surface-variant">Subtotal</div>
                  <div className="font-headline-lg-mobile text-[18px] mt-1">${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="rounded-lg bg-surface-container-lowest px-4 py-3">
                  <div className="text-sm text-on-surface-variant">IVA</div>
                  <div className="font-headline-lg-mobile text-[18px] mt-1">${ivaMonto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="rounded-lg bg-primary-fixed px-4 py-3">
                  <div className="text-sm text-on-primary-fixed">Total</div>
                  <div className="font-headline-lg-mobile text-[20px] font-bold text-on-primary-fixed mt-1">${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de Envío / Transición de Paso */}
          <div className="sticky bottom-[calc(1rem+env(safe-area-inset-bottom))] mt-2">
            <Button size="xl" className="w-full rounded-full gap-2 shadow-soft bg-primary text-white disabled:opacity-50" onClick={() => setStep('billing_preview')} disabled={total === 0 || anyInvalid}>
              Continuar a Revisión <ArrowRight size={20} />
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (step === 'billing_preview') {
    return (
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col overflow-x-hidden">
        <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md flex justify-between items-center px-4 sm:px-6 py-base border-b border-surface-container-high/30">
          <div className="flex items-center gap-sm">
             <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqP9FmMjxWk0Et5jW36cuK-yz-i80rcXOfTmDMirv_Mi5MNrVG4kPkG3CWuIyUXdmGika_hUgahtTaGr6WqyKRbk269jSOgHj_Y5gBY8JNZGliJKgkPYQ-ArpA7gM8fNI8hME3HkNz93oS8a5T1DtuqRy4qB1G-imELafAgr8ROBG3JXAIlFhVek_W3VbgD6G6aDLeKhANEtLgAafURqiSiEr9Oj7YPSufrUZEU-07DhG6OSRgt_zBGmRwhlfBIcd41E5OaC3Piqk" className="w-full h-full object-cover" />
             </div>
             <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-bold">EXEN</span>
          </div>
          <button className="text-primary"><Bell size={24} /></button>
        </header>

        <main className="flex-grow pt-[72px] pb-[calc(190px+env(safe-area-inset-bottom))] px-3 sm:px-6 flex flex-col items-center w-full">
          <div className="w-full max-w-3xl flex items-center gap-3 mb-4 sm:mb-lg">
            <Button variant="ghost" onClick={() => onNavigate('dashboard')} className="p-0 w-10 h-10 rounded-full shrink-0"><ArrowLeft size={24}/></Button>
            <div className="min-w-0">
              <h1 className="font-headline-lg-mobile text-[20px] sm:text-headline-lg-mobile leading-tight text-on-background">Vista Previa</h1>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">Revisa y confirma tu factura antes de timbrar</p>
            </div>
          </div>

          <Card className="w-full max-w-3xl p-4 sm:p-6 md:p-xl flex flex-col gap-6 sm:gap-xl rounded-[28px] shadow-soft border border-surface-container-high">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-surface-container-high pb-5">
              <div className="flex flex-col gap-1">
                <span className="font-label-md text-label-md text-primary uppercase tracking-[0.24em]">Emisor</span>
                <h2 className="font-headline-lg-mobile text-[18px] sm:text-headline-lg-mobile text-on-surface leading-tight">{emitterProfile?.razonSocial || billingCustomerForm.razonSocial || 'Consultoría y Diseño S.A. de C.V.'}</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">RFC: {emitterProfile?.rfc || billingCustomerForm.rfc || 'XAXX010101000'}</p>
              </div>
              <div className="flex flex-col gap-1 text-left sm:text-right bg-surface-container-low p-3 rounded-2xl border border-surface-container-high sm:bg-transparent sm:border-none sm:p-0">
                <span className="font-label-md text-label-md text-primary uppercase tracking-[0.24em]">Factura de ingreso</span>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Folio</span>
                  <span className="font-label-lg text-label-lg text-on-surface">INV-2026-0001</span>
                </div>
              </div>
            </div>

            {/* Inyección dinámica del Cliente Receptor en la vista previa */}
            <div className="flex flex-col gap-2">
              <span className="font-label-md text-label-md text-primary uppercase tracking-[0.24em]">Receptor</span>
              <div className="bg-[linear-gradient(180deg,rgba(39,100,255,0.08),rgba(39,100,255,0.03))] rounded-2xl p-4 border border-primary/10">
                <h3 className="font-label-lg text-label-lg text-on-surface leading-tight">{billingCustomerForm.razonSocial || "Sin Razón Social"}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">RFC: {billingCustomerForm.rfc || "Sin RFC"}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] sm:text-xs text-on-surface-variant">
                  <span className="rounded-full bg-white/80 px-2.5 py-1 border border-outline-variant/20">Régimen: {billingCustomerForm.regimenFiscal || 'Sin régimen'}</span>
                  <span className="rounded-full bg-white/80 px-2.5 py-1 border border-outline-variant/20">CP: {billingCustomerForm.codigoPostal || '---'}</span>
                  <span className="rounded-full bg-white/80 px-2.5 py-1 border border-outline-variant/20">Uso: {billingCustomerForm.usoCfdi || 'Sin uso'}</span>
                </div>
              </div>
            </div>

            {/* Mapeo dinámico de los conceptos guardados en el estado */}
            <div className="flex flex-col gap-3 sm:gap-md">
              <span className="font-label-md text-label-md text-primary uppercase tracking-[0.24em]">Conceptos</span>
              {conceptos.map((c, i) => {
                const totalConcepto = (Number(c.cantidad) || 0) * (Number(c.precioUnitario) || 0);
                return (
                  <div key={i} className="rounded-2xl border border-surface-container-high bg-surface-container-lowest p-4 sm:p-5 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="flex flex-col gap-2 min-w-0">
                        <span className="font-body-md text-body-md text-on-surface font-medium leading-snug">{c.descripcion}</span>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-sm text-on-surface-variant">
                          <span className="bg-surface-container px-2.5 py-1 rounded-full font-mono border border-outline-variant/20">Clave SAT: {c.claveSat}</span>
                          <span className="bg-surface-container px-2.5 py-1 rounded-full border border-outline-variant/20">{c.cantidad} ({c.unidadSat})</span>
                        {conceptAssistant[i]?.descripcionOficial && (
                            <span className="flex items-center gap-1 text-secondary font-medium">
                              <CheckCircle2 size={12} className="fill-current" /> Validado por IA
                          </span>
                        )}
                      </div>
                    </div>
                      <div className="text-left sm:text-right flex flex-row sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-2 sm:gap-0 shrink-0">
                        <span className="font-label-md text-label-md text-on-surface-variant">Importe</span>
                        <span className="font-body-md sm:font-semibold text-on-surface">${totalConcepto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cálculo de totales vinculados dinámicamente al estado global de la Lambda */}
            <div className="pt-2">
              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-surface-container-lowest px-4 py-3 border border-surface-container-high">
                  <div className="text-xs sm:text-sm text-on-surface-variant">Subtotal</div>
                  <div className="font-headline-lg-mobile text-[18px] mt-1 text-on-surface">${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="rounded-2xl bg-surface-container-lowest px-4 py-3 border border-surface-container-high">
                  <div className="text-xs sm:text-sm text-on-surface-variant">IVA</div>
                  <div className="font-headline-lg-mobile text-[18px] mt-1 text-on-surface">${ivaMonto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
                <div className="rounded-2xl bg-primary-fixed px-4 py-3 border border-primary/10 sm:col-span-1">
                  <div className="text-xs sm:text-sm text-on-primary-fixed/80">Total</div>
                  <div className="font-headline-lg-mobile text-[20px] mt-1 font-bold text-on-primary-fixed">${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>
            </div>
          </Card>

           <div className="fixed bottom-0 left-0 w-full z-40 bg-surface/90 backdrop-blur-xl border-t border-surface-container shadow-medium px-3 sm:px-6 py-3 sm:py-md flex justify-center">
             <div className="w-full max-w-3xl flex flex-col sm:flex-row justify-end gap-2 sm:gap-md">
                 <Button variant="secondary" className="w-full sm:flex-1 py-4 rounded-2xl" onClick={() => void manejarGuardarBorrador()}>Guardar borrador</Button>
                 <Button className="w-full sm:flex-1 py-4 rounded-2xl gap-2" onClick={() => void handleFinalizeInvoice()} disabled={savingInvoice}>
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
      <div className="bg-surface min-h-screen flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10 relative overflow-hidden">
        <style>{`
          @media print {
            body, #root, __next, .no-print {
              background: white !important;
              color: black !important;
            }

            .hide-on-print {
              display: none !important;
            }

            .factura-print-card {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              box-shadow: none !important;
              border: none !important;
              padding: 0 !important;
              margin: 0 !important;
              background: white !important;
              color: black !important;
            }

            h1, h2, h3, p, span, td, th {
              color: black !important;
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
            }

            table {
              width: 100% !important;
              border-collapse: collapse !important;
            }

            th {
              background-color: #f3f4f6 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}</style>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-fixed blur-[80px] rounded-full opacity-60 z-0"></div>
        <div className="w-full max-w-md relative z-10 flex flex-col gap-6">
          <Card className="factura-print-card p-8 flex flex-col items-center text-center rounded-3xl">
            <div className="w-24 h-24 rounded-full bg-primary-fixed flex items-center justify-center mb-6">
              <CheckCircle2 size={48} className="text-primary fill-current" />
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">Factura Timbrada</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8 px-4">Su documento ha sido procesado y certificado correctamente por el SAT.</p>
            
            <div className="hide-on-print grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              {[
                { icon: <Code size={20} />, label: 'XML', onClick: descargarXML },
                { icon: <FileText size={20} />, label: 'PDF', onClick: descargarPDF },
                { icon: <Share2 size={20} />, label: 'Share' }
              ].map(item => (
                <button key={item.label} onClick={item.onClick} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors">
                  <div className="text-primary mb-2">{item.icon}</div>
                  <span className="font-label-md text-label-md text-primary">{item.label}</span>
                </button>
              ))}
            </div>
          </Card>
          <Button size="xl" className="hide-on-print w-full rounded-2xl gap-2" onClick={() => onNavigate('dashboard')}>
            <LayoutDashboard size={20} /> Volver al Tablero
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
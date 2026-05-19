import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "motion/react";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { 
  Bell, 
  ArrowLeftRight,
  Sparkles, 
  CheckCircle2, 
  Upload, 
  History as HistoryIcon,
  PencilLine,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { Screen, FiscalProfile } from "@/src/types";

const constanciaUploadUrl = "https://j5vknmzu5yryqc64dajdf4r3xu0mruqf.lambda-url.us-east-2.on.aws/";
const manualUpdateUrl = "https://b7sh43dkp3m2vmtmh5hx533nde0dzrgi.lambda-url.us-east-2.on.aws/";
const readFiscalProfileUrl = "https://6uszlsniryljwxtogksobjttw40auyij.lambda-url.us-east-2.on.aws/";

const defaultFiscalProfile: FiscalProfile = {
  rfc: "XAXX010101000",
  razonSocial: "Contribuyente sin actualizar",
  regimeFiscal: "Régimen Simplificado de Confianza (RESICO)",
  cp: "11000",
};

type FiscalProfileSource = "ai" | "manual";

interface BrowserSessionState {
  screen?: string;
  userId?: string;
  userEmail?: string;
}

function normalizeFiscalProfile(profile: Partial<FiscalProfile> | null | undefined, fallback = defaultFiscalProfile): FiscalProfile {
  return {
    rfc: (profile?.rfc ?? fallback.rfc).trim(),
    razonSocial: (profile?.razonSocial ?? fallback.razonSocial).trim(),
    regimeFiscal: (profile?.regimeFiscal ?? fallback.regimeFiscal).trim(),
    cp: (profile?.cp ?? fallback.cp).trim(),
  };
}

function readBrowserSessionState() {
  if (typeof window === "undefined") {
    return {} as BrowserSessionState;
  }

  const state = window.history.state;

  if (!state || typeof state !== "object") {
    return {} as BrowserSessionState;
  }

  return state as BrowserSessionState;
}

function writeBrowserSessionState(patch: Partial<BrowserSessionState>) {
  if (typeof window === "undefined") {
    return {} as BrowserSessionState;
  }

  const currentState = readBrowserSessionState();
  const nextState = {
    ...currentState,
    ...patch,
  } satisfies BrowserSessionState;

  window.history.replaceState(nextState, "", window.location.href);
  return nextState;
}

function getCurrentSessionUser() {
  const sessionState = readBrowserSessionState();

  return {
    userId: sessionState.userId ?? "",
    email: sessionState.userEmail ?? "",
  };
}

function getProfileFromResponse(data: any, fallback: FiscalProfile) {
  const extracted = data?.datos ?? data?.profile ?? data?.data ?? data;

  return normalizeFiscalProfile(
    {
      rfc: extracted?.rfc,
      razonSocial: extracted?.razon_social ?? extracted?.razonSocial,
      regimeFiscal: extracted?.regimen_fiscal ?? extracted?.regimeFiscal,
      cp: extracted?.codigo_postal ?? extracted?.cp,
    },
    fallback,
  );
}

interface ProfileProps {
  onNavigate: (screen: Screen) => void;
}

export function Profile({ onNavigate }: ProfileProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const initialStoredProfile = defaultFiscalProfile;

  const [profile, setProfile] = useState<FiscalProfile>(initialStoredProfile);
  const [draftProfile, setDraftProfile] = useState<FiscalProfile>(initialStoredProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const { email: currentUserEmail, userId: currentUserId } = getCurrentSessionUser();

  const fetchStoredProfile = async () => {
    if (!currentUserEmail) {
      setUploadError('No se encontró el correo del usuario. Vuelve a iniciar sesión.');
      return;
    }

    setIsProfileLoading(true);
    setUploadError(null);

    try {
      const response = await fetch(`${readFiscalProfileUrl}?email=${encodeURIComponent(currentUserEmail)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.status === 404) {
        const emptyProfile = normalizeFiscalProfile(null);
        setProfile(emptyProfile);
        setDraftProfile(emptyProfile);
        return;
      }

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'No se pudo cargar el perfil fiscal');
      }

      const nextProfile = getProfileFromResponse(data, defaultFiscalProfile);
      setProfile(nextProfile);
      setDraftProfile(nextProfile);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado al cargar el perfil fiscal';
      setUploadError(message);
      console.error('[Profile] error al cargar perfil fiscal:', error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  useEffect(() => {
    void fetchStoredProfile();
  }, [currentUserEmail]);

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

  const handleConstanciaUpload = async (file: File) => {
    if (!currentUserEmail && !currentUserId) {
      setUploadError('No se encontró el usuario activo. Vuelve a iniciar sesión.');
      return;
    }

    setLoading(true);
    setUploadError(null);
    setFileName(file.name);

    try {
      const fileBase64 = await fileToBase64(file);

      const response = await fetch(constanciaUploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: currentUserEmail,
          userId: currentUserId,
          fileBase64,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'No se pudo procesar la constancia');
      }

      const nextProfile = getProfileFromResponse(data, profile);

      setProfile(nextProfile);
      setDraftProfile(nextProfile);
      await fetchStoredProfile();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado al subir la constancia';
      setUploadError(message);
      console.error('[Profile] error al subir constancia:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    await handleConstanciaUpload(file);
    event.target.value = '';
  };

  const beginEditing = () => {
    setSaveError(null);
    setUploadError(null);
    setDraftProfile(profile);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraftProfile(profile);
    setSaveError(null);
    setIsEditing(false);
  };

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentUserEmail && !currentUserId) {
      setSaveError('No se encontró el usuario activo. Vuelve a iniciar sesión.');
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const response = await fetch(manualUpdateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: currentUserEmail,
          userId: currentUserId,
          rfc: draftProfile.rfc,
          razon_social: draftProfile.razonSocial,
          regimen_fiscal: draftProfile.regimeFiscal,
          codigo_postal: draftProfile.cp,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'No se pudo guardar el perfil fiscal');
      }

      const nextProfile = getProfileFromResponse(data, draftProfile);

      setProfile(nextProfile);
      setDraftProfile(nextProfile);
      setIsEditing(false);
      await fetchStoredProfile();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado al guardar el perfil';
      setSaveError(message);
      console.error('[Profile] error al guardar perfil fiscal:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDraftChange = (field: keyof FiscalProfile) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setDraftProfile((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  };

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen pt-[64px] sm:pt-[72px] pb-[calc(116px+env(safe-area-inset-bottom))] overflow-x-hidden">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md flex justify-between items-center px-4 sm:px-margin-mobile py-2 sm:py-base max-w-full border-b border-surface-container-high/30">
        <div className="flex items-center gap-2 sm:gap-sm min-w-0">
          <img 
            alt="User profile" 
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm shrink-0" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5Vp7Soc1nitfNwYVj8B_UcINLCVrEDTVYmEJAAdvseJrZDRzDj93xAeM3ukvOe-dIkEKxQy0rAfawCUk-NtGHZzCXK1VPODmZ-AMAyiPXGiAnteQVUsUFueT5rL1bNoOiHFnlwBT-XzFaT3VKyh5DXMVtoegNBY6QP1ax1r2HJ-7J6f__n-sgrpa6CmpcCCwRRDgiVxfrx4SZ5jTfB2ZOPX1ooRKlK4jxxK6QPH3AqIXEjB1nnO3BxplyWokdPPOMuZR1DP6sAfQ" 
          />
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0e_3kg4f_7ecUIOAvKVaGzQiXE1MY63k1ZdZT8piiqUb3uL-dlGBGAs2HZ9se29p_gk-yzLDlu70U_SuVX2b-gdo7aZXdk4Xc-dEwpvoKcHN5F7CiccG0IS2qcxfUDWKhWfKgX6YRTJ0qC9FI5APcGDY_SbfHlvOs0eq7-v6IcYIZV0fu7xhYEXlMpjq9d3OLT9NU9pszHu4hJV-mYqYB7UU0oAkRi2h_olV_G-H0zcxkktIHaIn9Oh9L2Lc8ipnqO89JG563OvfXWQ" 
            alt="EXEN Logo" 
            className="h-7 sm:h-8 w-auto object-contain max-w-[92px] sm:max-w-none" 
          />
        </div>
        <button className="text-on-surface-variant hover:opacity-80 transition-opacity active:scale-95 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-surface-container-low shrink-0">
          <Bell size={20} className="sm:hidden" />
          <Bell size={24} className="hidden sm:block" />
        </button>
      </header>

      <main className="px-4 sm:px-6 flex flex-col gap-5 sm:gap-lg mt-2 sm:mt-sm max-w-xl sm:max-w-2xl mx-auto w-full">
        <section className="flex flex-col gap-xs">
          <div className="inline-flex items-center gap-1.5 bg-primary-fixed-dim/30 px-3 py-1 rounded-full w-fit mb-2 self-start">
            <Sparkles size={16} className="text-primary fill-current" />
            <span className="font-label-md text-label-md text-primary">Datos verificados por IA</span>
          </div>
          <h2 className="font-headline-xl text-[26px] sm:text-headline-xl text-on-background">Perfil Fiscal</h2>
          <p className="font-body-md text-[14px] sm:text-body-md leading-relaxed text-on-surface-variant max-w-[34rem]">Información extraída de tu última Constancia de Situación Fiscal.</p>
        </section>

        {/* Fiscal Data Card */}
        <motion.div
           initial={{ y: 10, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
        >
          <Card className="p-0 border-[0.5px] border-surface-container-high relative overflow-hidden rounded-[18px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-inverse-primary opacity-80"></div>
            <div className="flex flex-col relative">
              {loading && (
                <div className="absolute inset-0 z-10 bg-surface/70 backdrop-blur-[1px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface-container-lowest px-5 py-4 shadow-medium border border-surface-container-high">
                    <Loader2 size={28} className="text-primary animate-spin" />
                    <span className="font-body-md text-body-md text-on-surface-variant text-center">
                      Procesando constancia{fileName ? `: ${fileName}` : ''}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex items-start justify-between gap-3 border-b border-surface-container-high px-4 sm:px-md py-4 sm:py-5 bg-surface-container-lowest/40">
                <div className="min-w-0">
                  <span className="font-label-lg text-label-lg text-on-surface">Datos fiscales</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    {isEditing ? 'Ajusta los datos y sincronízalos con la Lambda manual.' : 'Datos guardados para tu sesión actual.'}
                  </p>
                </div>

                {!isEditing ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={beginEditing}
                    disabled={loading || saving}
                    className="shrink-0 gap-2 text-primary"
                  >
                    <PencilLine size={16} />
                    Editar
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelEditing}
                      disabled={loading || saving}
                      className="gap-2"
                    >
                      <X size={16} />
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      form="fiscal-profile-form"
                      size="sm"
                      disabled={loading || saving}
                      className="gap-2"
                    >
                      {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      Guardar
                    </Button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <form id="fiscal-profile-form" className="flex flex-col gap-3 p-4 sm:p-md" onSubmit={handleSaveProfile}>
                  <Input
                    label="RFC"
                    value={draftProfile.rfc}
                    onChange={handleDraftChange('rfc')}
                    disabled={loading || saving}
                  />
                  <Input
                    label="Razón Social"
                    value={draftProfile.razonSocial}
                    onChange={handleDraftChange('razonSocial')}
                    disabled={loading || saving}
                  />
                  <Input
                    label="Régimen Fiscal"
                    value={draftProfile.regimeFiscal}
                    onChange={handleDraftChange('regimeFiscal')}
                    disabled={loading || saving}
                  />
                  <Input
                    label="Código Postal"
                    value={draftProfile.cp}
                    onChange={handleDraftChange('cp')}
                    disabled={loading || saving}
                  />

                  {saveError && (
                    <div className="rounded-xl border border-error-container bg-error-container/20 px-4 py-3 text-error text-sm leading-relaxed">
                      {saveError}
                    </div>
                  )}
                </form>
              ) : (
                <div className="p-4 sm:p-md flex flex-col">
                  <div className="py-3 sm:py-sm border-b border-surface-container-high flex flex-col gap-1">
                    <span className="font-label-md text-label-md text-on-surface-variant">RFC</span>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-headline-lg-mobile text-[20px] sm:text-headline-lg-mobile text-on-background font-semibold tracking-wide break-all">{profile.rfc}</span>
                      <CheckCircle2 size={20} className="text-secondary-fixed-dim fill-current shrink-0" />
                    </div>
                  </div>
                  <div className="py-3 sm:py-sm border-b border-surface-container-high flex flex-col gap-1">
                    <span className="font-label-md text-label-md text-on-surface-variant">Razón Social</span>
                    <span className="font-body-md text-[14px] sm:text-body-md text-on-background leading-relaxed">{profile.razonSocial}</span>
                  </div>
                  <div className="py-3 sm:py-sm border-b border-surface-container-high flex flex-col gap-1">
                    <span className="font-label-md text-label-md text-on-surface-variant">Régimen Fiscal</span>
                    <span className="font-body-md text-[14px] sm:text-body-md text-on-background leading-relaxed">{profile.regimeFiscal}</span>
                  </div>
                  <div className="pt-3 sm:pt-sm flex flex-col gap-1">
                    <span className="font-label-md text-label-md text-on-surface-variant">Código Postal</span>
                    <span className="font-body-md text-[14px] sm:text-body-md text-on-background">{profile.cp}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {uploadError && (
          <div className="rounded-xl border border-error-container bg-error-container/20 px-4 py-3 text-error text-sm leading-relaxed">
            {uploadError}
          </div>
        )}

        <section className="flex flex-col gap-3 sm:gap-md">
          <Button 
            className="w-full flex gap-sm rounded-xl py-3.5 sm:py-4"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || saving}
          >
            <Upload size={20} />
            Reemplazar constancia
          </Button>
          <Button 
            variant="secondary" 
            className="w-full flex gap-sm rounded-xl py-3.5 sm:py-4 text-primary"
            onClick={() => onNavigate('history')}
          >
            <HistoryIcon size={20} />
            Historial de cambios
          </Button>

          <Button
            variant="ghost"
            className="w-full flex gap-sm rounded-xl py-3.5 sm:py-4"
            onClick={() => onNavigate('dashboard')}
          >
            <ArrowLeftRight size={20} />
            Volver al dashboard
          </Button>

          <Button 
            variant="ghost" 
            className="mt-2 sm:mt-4 text-error hover:bg-error-container"
            onClick={() => onNavigate('splash')}
          >
            Cerrar sesión
          </Button>
        </section>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </main>
    </div>
  );
}

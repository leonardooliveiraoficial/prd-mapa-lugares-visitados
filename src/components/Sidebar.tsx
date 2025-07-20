
import { useMemo, useState } from 'react';

type Location = {
  cidade: string;
  estado?: string;
  pais: string;
  lat: number;
  lng: number;
};

type Props = {
  locations: Location[];
  onCityClick?: (lat: number, lng: number) => void;
};

const SIDEBAR_STYLE = (open: boolean) => ({
  position: 'fixed' as const,
  top: 24,
  left: 24,
  zIndex: 1500,
  width: 'calc(100vw - 48px)',
  minHeight: 100,
  background: 'rgba(22,22,28,0.98)', // fundo escuro mais neutro
  borderRadius: 36,
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.32)',
  color: '#fff',
  padding: 20,
  fontFamily: 'Sora, Arial, sans-serif',
  height: undefined,
  maxHeight: 600,
  display: 'flex' as const,
  flexDirection: 'column' as const,
  transition: 'all 0.3s cubic-bezier(.77,.2,.24,1) 0s',
  boxSizing: 'border-box' as const,
  opacity: open ? 1 : 0,
  transform: open ? 'translateX(0)' : 'translateX(-40px)',
  gap: 16,
});

const CLOSE_BTN_STYLE = {
  position: 'absolute' as const,
  top: -12,
  right: -12,
  zIndex: 2001,
  width: 38,
  height: 38,
  display: 'flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  background: 'rgba(120, 20, 40, 0.68)', // glassmorphism vermelho dark
  boxShadow: '0 2px 12px 0 rgba(120,20,40,0.22)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1.5px solid rgba(180, 40, 60, 0.18)',
  borderRadius: '50%',
  color: '#fff',
  cursor: 'pointer',
  transition: 'background 0.2s, color 0.2s',
  padding: 0,
  lineHeight: 1,
  touchAction: 'manipulation' as const,
};

const CARD_TOP_STYLE = (isMobile: boolean) => ({
  borderRadius: 20,
  background: 'rgba(32, 32, 44, 0.78)', // glassmorphism escuro mais claro
  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.28)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1.5px solid rgba(80, 80, 120, 0.18)',
  padding: isMobile ? '16px 10px 10px 10px' : '22px 22px 12px 22px',
  marginBottom: isMobile ? 12 : 18,
  fontWeight: 700,
  fontSize: isMobile ? 22 : 28,
  textShadow: '0 2px 6px #0005',
  display: 'flex' as const,
  flexDirection: 'column' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
});

const TITLE_STYLE = (isMobile: boolean) => ({
  fontWeight: 900,
  fontSize: isMobile ? 18 : 22,
  letterSpacing: 0.5,
  color: '#fff',
  textAlign: 'center' as const,
  lineHeight: 1.15,
  fontFamily: 'Sora, Arial, sans-serif',
});

const SUBTITLE_STYLE = (isMobile: boolean) => ({
  fontWeight: 400,
  fontSize: isMobile ? 14 : 16,
  marginTop: 7,
  color: '#d1d5db', // cinza claro
  textAlign: 'center' as const,
  marginBottom: isMobile ? 4 : 8,
  fontFamily: 'Sora, Arial, sans-serif',
});

const LIST_TITLE_STYLE = (isMobile: boolean) => ({
  marginBottom: isMobile ? 6 : 10,
  fontWeight: 700,
  fontSize: isMobile ? 16 : 18,
  letterSpacing: 0.2,
  textAlign: 'left' as const,
  color: '#fff',
  fontFamily: 'Sora, Arial, sans-serif',
});

const UL_STYLE = (isMobile: boolean) => ({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  maxHeight: isMobile ? '70vh' : 400,
  minHeight: 80,
  overflowY: 'auto' as const,
  fontSize: isMobile ? 15 : 16,
  gap: isMobile ? 2 : 4,
});

const LI_STYLE = (isMobile: boolean) => ({
  padding: isMobile ? '7px 6px' : '10px 12px',
  borderBottom: '1px solid #222',
  display: 'flex' as const,
  alignItems: 'center' as const,
  gap: isMobile ? 6 : 10,
  cursor: 'pointer',
  transition: 'background 0.25s',
  borderRadius: 6,
  marginBottom: isMobile ? 1 : 2,
  position: 'relative' as const,
  fontWeight: 600,
  background: undefined,
});

const DOT_STYLE = (isMobile: boolean) => ({
  width: 7,
  height: 7,
  background: '#26e6ff',
  borderRadius: '50%',
  display: 'inline-block',
  marginRight: isMobile ? 8 : 12,
});

const CITY_STYLE = (isMobile: boolean) => ({
  fontWeight: 700,
  fontSize: isMobile ? 15 : 16,
  color: '#fff',
  marginRight: 4,
  fontFamily: 'Sora, Arial, sans-serif',
});

const STATE_STYLE = (isMobile: boolean) => ({
  color: '#d1d5db', // cinza claro
  fontWeight: 400,
  fontSize: isMobile ? 13 : 14,
  marginRight: 4,
  fontFamily: 'Sora, Arial, sans-serif',
});

const COUNTRY_FLAG_STYLE = (isMobile: boolean) => ({
  fontSize: isMobile ? 20 : 22,
  marginLeft: 'auto',
  marginRight: 4,
  filter: 'drop-shadow(0 1px 4px #26e6ff44)',
  userSelect: 'none' as const,
});

// Função para retornar emoji da bandeira pelo nome do país
function getCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    'Brasil': '🇧🇷',
    'Paraguai': '🇵🇾',
    'Argentina': '🇦🇷',
    // Adicione outros países conforme necessário
  };
  if (flags[country]) return flags[country];
  // Fallback: bandeira genérica
  return '🏳️';
}

export default function Sidebar({ locations, onCityClick }: Props) {
  const [open, setOpen] = useState(false);
  // Detecta mobile dinamicamente
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 700 : false;
  const total = locations.length;
  const estados = useMemo(() => Array.from(new Set(locations.map(l => l.estado).filter(e => e && e.trim() !== ''))), [locations]);
  const paises = useMemo(() => Array.from(new Set(locations.map(l => l.pais))), [locations]);

  function handleCityClick(lat: number, lng: number) {
    setOpen(false);
    onCityClick?.(lat, lng);
  }
  return (
    <>
      {!open && (
        <button
          style={{
            position: 'fixed',
            top: 24,
            left: 16,
            zIndex: 2000,
            width: 48,
            height: 48,
            background: 'linear-gradient(90deg, #8f5fe8 60%, #26e6ff 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: 28,
            boxShadow: '0 4px 14px #0008',
            cursor: 'pointer',
            transition: 'background 0.2s, box-shadow 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setOpen(true)}
          aria-label="Abrir lista de cidades"
          onMouseOver={e => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #6c3fdc 60%, #26e6ff 100%)';
            e.currentTarget.style.boxShadow = '0 4px 22px #26e6ff44';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #8f5fe8 60%, #26e6ff 100%)';
            e.currentTarget.style.boxShadow = '0 4px 14px #0008';
          }}
          onTouchStart={e => {
            (e.currentTarget as HTMLElement).style.background = 'linear-gradient(90deg, #6c3fdc 60%, #26e6ff 100%)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 22px #26e6ff44';
          }}
          onTouchEnd={e => {
            (e.currentTarget as HTMLElement).style.background = 'linear-gradient(90deg, #8f5fe8 60%, #26e6ff 100%)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px #0008';
          }}
        >
          <span style={{ color: '#fff', fontSize: 32, fontWeight: 700, lineHeight: 1 }}>≡</span>
        </button>
      )}
      {open && (
        <aside style={SIDEBAR_STYLE(open)}>
          <button
            onClick={() => setOpen(false)}
            style={CLOSE_BTN_STYLE}
            aria-label="Fechar lista"
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(180, 40, 60, 0.88)';
              e.currentTarget.style.boxShadow = '0 2px 16px 0 rgba(180,40,60,0.32)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'rgba(120, 20, 40, 0.68)';
              e.currentTarget.style.boxShadow = '0 2px 12px 0 rgba(120,20,40,0.22)';
            }}
            onTouchStart={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(180, 40, 60, 0.88)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 16px 0 rgba(180,40,60,0.32)';
            }}
            onTouchEnd={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(120, 20, 40, 0.68)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px 0 rgba(120,20,40,0.22)';
            }}
          >
            <span style={{fontSize: 22, fontWeight: 700, textShadow: '0 2px 6px #0005'}}>×</span>
          </button>
          <div style={CARD_TOP_STYLE(isMobile)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span style={{ fontSize: isMobile ? 22 : 28, marginRight: 2 }}>🌎</span>
              <span style={TITLE_STYLE(isMobile)}>Meu Mapa de Rotas</span>
            </div>
            <div style={SUBTITLE_STYLE(isMobile)}>
              Eu já visitei <span style={{ color: '#fff', fontWeight: 700 }}>{total}</span> cidades, <span style={{ color: '#fff', fontWeight: 700 }}>{estados.length}</span> estados e <span style={{ color: '#fff', fontWeight: 700 }}>{paises.length}</span> países.
            </div>
          </div>
          <div style={LIST_TITLE_STYLE(isMobile)}>
            Lista de cidades, estados e países:
          </div>
          <ul style={UL_STYLE(isMobile)}>
            {locations.map((loc, i) => (
              <li
                key={i}
                style={{
                  ...LI_STYLE(isMobile),
                  borderBottom: i < locations.length - 1 ? '1px solid #222' : 'none',
                }}
                onClick={() => handleCityClick(loc.lat, loc.lng)}
                title="Ver no mapa"
                onMouseOver={e => {
                  if (onCityClick) (e.currentTarget as HTMLElement).style.background = '#232323';
                }}
                onMouseOut={e => {
                  if (onCityClick) (e.currentTarget as HTMLElement).style.background = '';
                }}
              >
                <span style={DOT_STYLE(isMobile)}></span>
                <span style={CITY_STYLE(isMobile)}>{loc.cidade}</span>
                {loc.estado && (
                  <span style={STATE_STYLE(isMobile)}>{loc.estado}</span>
                )}
                <span style={COUNTRY_FLAG_STYLE(isMobile)}>{getCountryFlag(loc.pais)}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}
      <style>{`
        ul::-webkit-scrollbar {
          width: 7px;
          background: transparent;
        }
        ul::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 6px;
        }
        ul::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </>
  );
}
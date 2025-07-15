import { useMemo, useState } from 'react';

// Definição do tipo Location
type Location = {
  cidade: string;
  estado?: string;
  pais: string;
  lat: number;
  lng: number;
};

// Definição do tipo Props (recebe locations)
type Props = {
  locations: Location[];
};

export default function Sidebar({ locations }: Props) {
  const [open, setOpen] = useState(false);

  // Detecta mobile (bem simples)
  const isMobile = window.innerWidth < 700;

  const total = locations.length;
  const estados = useMemo(
    () =>
      Array.from(
        new Set(locations.map((l) => l.estado).filter((e) => e && e.trim() !== ''))
      ),
    [locations]
  );
  const paises = useMemo(
    () => Array.from(new Set(locations.map((l) => l.pais))),
    [locations]
  );

  // Ícone botão flutuante para abrir sidebar (aparece só no mobile)
  const floatingButton =
    isMobile && !open ? (
      <button
        style={{
          position: 'absolute',
          top: 24,
          left: 16,
          zIndex: 1300,
          width: 48,
          height: 48,
          background: 'linear-gradient(90deg, #8f5fe8 60%, #24c6dc 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          fontSize: 28,
          boxShadow: '0 4px 14px #0008',
          cursor: 'pointer',
        }}
        onClick={() => setOpen(true)}
        aria-label="Abrir lista de cidades"
      >
        ≡
      </button>
    ) : null;

  return (
    <>
      {floatingButton}
      {(open || !isMobile) && (
        <aside
          style={{
            position: isMobile ? 'fixed' : 'absolute',
            top: isMobile ? 0 : 32,
            left: isMobile ? 0 : 24,
            zIndex: 1200,
            width: isMobile ? '94vw' : 330,
            minHeight: 100,
            background: 'rgba(30,30,30,0.98)',
            borderRadius: isMobile ? 0 : 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            color: '#fff',
            padding: isMobile ? 14 : 24,
            fontFamily: 'inherit',
            height: isMobile ? '100vh' : undefined,
            maxHeight: isMobile ? '100vh' : 520,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {isMobile && (
            <button
              onClick={() => setOpen(false)}
              style={{
                alignSelf: 'flex-end',
                fontSize: 32,
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                marginBottom: 10,
              }}
              aria-label="Fechar lista"
            >
              ×
            </button>
          )}
          {/* Card do topo com contadores */}
          <div
            style={{
              borderRadius: 12,
              background: 'linear-gradient(90deg, #8f5fe8 60%, #24c6dc 100%)',
              padding: isMobile ? '13px 10px' : '18px 20px',
              marginBottom: 18,
              fontWeight: 700,
              fontSize: isMobile ? 17 : 20,
              textShadow: '0 2px 6px #0005',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <div>
              🌎{' '}
              <span style={{ fontSize: isMobile ? 19 : 22, fontWeight: 800 }}>
                {total}
              </span>{' '}
              lugares,{' '}
              <span style={{ fontWeight: 800 }}>{estados.length}</span> estados,{' '}
              <span style={{ fontWeight: 800 }}>{paises.length}</span> países
            </div>
            <div
              style={{
                fontWeight: 500,
                fontSize: isMobile ? 14 : 15,
                marginTop: 4,
                color: '#fff8',
              }}
            >
              Eu já visitei <b>{total}</b> cidades em <b>{paises.length}</b> países!
            </div>
          </div>
          {/* Lista de cidades, estados e países */}
          <div>
            <div
              style={{
                marginBottom: 10,
                fontWeight: 600,
                fontSize: isMobile ? 15 : 16,
                letterSpacing: 0.5,
              }}
            >
              Lista de cidades, estados e países:
            </div>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                maxHeight: isMobile ? '75vh' : 320,
                overflowY: 'auto',
                fontSize: isMobile ? 15 : 16,
              }}
            >
              {locations.map((loc, i) => (
                <li
                  key={i}
                  style={{
                    padding: '7px 0 7px 0',
                    borderBottom: '1px solid #fff1',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      background: '#24c6dc',
                      borderRadius: '50%',
                      display: 'inline-block',
                      marginRight: 8,
                    }}
                  ></span>
                  <span style={{ fontWeight: 600 }}>{loc.cidade}</span>
                  {loc.estado && (
                    <span style={{ color: '#aaa', marginLeft: 8 }}>{loc.estado}</span>
                  )}
                  <span
                    style={{
                      color: '#8ff',
                      fontSize: 14,
                      marginLeft: 'auto',
                      marginRight: 14,
                    }}
                  >
                    {loc.pais}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </>
  );
}

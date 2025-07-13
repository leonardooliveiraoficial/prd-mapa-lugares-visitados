import { useMemo } from 'react';

type Location = {
  cidade: string;
  estado?: string;
  pais: string;
  lat: number;
  lng: number;
};

type Props = {
  locations: Location[];
};

export default function Sidebar({ locations }: Props) {
  // Contadores únicos
  const total = locations.length;
  const estados = useMemo(
    () =>
      Array.from(
        new Set(locations.map(l => l.estado).filter(e => e && e.trim() !== ''))
      ),
    [locations]
  );
  const paises = useMemo(
    () => Array.from(new Set(locations.map(l => l.pais))),
    [locations]
  );

  return (
    <aside
      style={{
        position: 'absolute',
        top: 32,
        left: 24,
        zIndex: 1100,
        width: 330,
        minHeight: 100,
        background: 'rgba(30,30,30,0.96)',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        color: '#fff',
        padding: 24,
        fontFamily: 'inherit'
      }}
    >
      <div style={{
        borderRadius: 12,
        background: 'linear-gradient(90deg, #8f5fe8 60%, #24c6dc 100%)',
        padding: '18px 20px',
        marginBottom: 18,
        fontWeight: 700,
        fontSize: 20,
        textShadow: '0 2px 6px #0005',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
      }}>
        <div>
          🌎 <span style={{ fontSize: 22, fontWeight: 800 }}>{total}</span> lugares,{' '}
          <span style={{ fontWeight: 800 }}>{estados.length}</span> estados,{' '}
          <span style={{ fontWeight: 800 }}>{paises.length}</span> países
        </div>
        <div style={{ fontWeight: 500, fontSize: 15, marginTop: 4, color: "#fff8" }}>
          Você já visitou <b>{total}</b> cidades em <b>{paises.length}</b> países!
        </div>
      </div>
      <div>
        <div style={{ marginBottom: 10, fontWeight: 600, fontSize: 16, letterSpacing: 0.5 }}>Lista de cidades:</div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', maxHeight: 320, overflowY: 'auto' }}>
          {locations.map((loc, i) => (
            <li key={i} style={{
              padding: '7px 0 7px 0',
              borderBottom: '1px solid #fff1',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{
                width: 9,
                height: 9,
                background: '#24c6dc',
                borderRadius: '50%',
                display: 'inline-block',
                marginRight: 8
              }}></span>
              <span style={{ fontWeight: 600 }}>{loc.cidade}</span>
              {loc.estado && <span style={{ color: '#aaa', marginLeft: 8 }}>{loc.estado}</span>}
              <span style={{ color: '#8ff', fontSize: 14, marginLeft: 'auto' }}>{loc.pais}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

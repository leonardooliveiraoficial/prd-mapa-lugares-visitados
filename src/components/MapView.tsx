import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { locations as initialLocations } from '../data/locations';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Sidebar from './Sidebar';

// Corrige ícones padrão do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapView() {
  const locations = initialLocations;

  return (
    <div>
      {/* Sidebar com card e lista */}
      <Sidebar locations={locations} />

      {/* Mapa ocupa toda a tela, mas sidebar fica por cima no canto */}
      <MapContainer
        center={[-20, -45]}
        zoom={5}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{
          height: '100vh',
          width: '100vw',
          zIndex: 1,
          position: 'fixed',
          left: 0,
          top: 0,
          background: '#242424'
        }}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc, index) => (
          <Marker key={index} position={[loc.lat, loc.lng]}>
            <Popup>
              <strong>{loc.cidade}</strong><br />
              {loc.estado && `${loc.estado}, `}{loc.pais}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

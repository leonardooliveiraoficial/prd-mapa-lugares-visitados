import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

// Componente auxiliar para mudar centro/zoom
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapView() {
  const [center, setCenter] = useState<[number, number]>([-20, -45]);
  const [zoom, setZoom] = useState(5);

  // Função chamada ao clicar na cidade
  function handleCityClick(lat: number, lng: number) {
    setCenter([lat, lng]);
    setZoom(12); // Zoom mais afastado ao clicar
  }

  const locations = initialLocations;

  // Limites do mundo (latitude: -85 a 85, longitude: -180 a 180)
  const bounds: L.LatLngBoundsExpression = [[-85, -180], [85, 180]];
  return (
    <div>
      <Sidebar locations={locations} onCityClick={handleCityClick} />
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        scrollWheelZoom={true}
        minZoom={3}
        maxZoom={22}
        maxBounds={bounds}
        preferCanvas={true}
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
        <ChangeView center={center} zoom={zoom} />
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
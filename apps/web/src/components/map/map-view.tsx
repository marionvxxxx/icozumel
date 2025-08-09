'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mock Mapbox token - in production, this would come from environment variables
const MAPBOX_TOKEN = 'pk.eyJ1IjoiY296dW1lbCIsImEiOiJjbHNkZjEyM3MwMDAwMmxwZzJoYWJjZGVmIn0.mock_token';

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // For demo purposes, we'll show a placeholder since we don't have a real Mapbox token
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN.includes('mock')) {
      // Show a placeholder map
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `
          <div class="w-full h-full bg-gradient-to-br from-caribbean-100 to-caribbean-200 flex items-center justify-center rounded-lg">
            <div class="text-center">
              <div class="text-4xl mb-4">🗺️</div>
              <h3 class="text-lg font-semibold text-caribbean-800 mb-2">Mapa de Cozumel</h3>
              <p class="text-caribbean-600 text-sm">Configura MAPBOX_TOKEN para ver el mapa interactivo</p>
            </div>
          </div>
        `;
      }
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-86.9523, 20.4230], // Cozumel coordinates
      zoom: 12,
    });

    // Add markers for businesses
    const businesses = [
      { name: 'Restaurant El Moro', coordinates: [-86.9523, 20.4230] },
      { name: 'Dive Shop Cozumel', coordinates: [-86.9400, 20.4200] },
      { name: 'Beach Club Paradise', coordinates: [-86.9600, 20.4300] },
    ];

    businesses.forEach((business) => {
      new mapboxgl.Marker({ color: '#14b8a6' })
        .setLngLat(business.coordinates as [number, number])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${business.name}</h3>`))
        .addTo(map.current!);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-[400px] md:h-[500px] rounded-lg border"
    />
  );
}
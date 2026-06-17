'use client'

import { divIcon } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import type { Cafe } from '@/types'

interface CafeMapProps {
  cafes: Cafe[]
  selectedCafe?: Cafe | null
  onSelect: (cafe: Cafe) => void
}

function FitSelected({ cafe }: { cafe?: Cafe | null }) {
  const map = useMap()

  useEffect(() => {
    if (cafe) map.flyTo([cafe.lat, cafe.lng], 15, { duration: 0.7 })
  }, [cafe, map])

  return null
}

export function CafeMap({ cafes, selectedCafe, onSelect }: CafeMapProps) {
  const center: [number, number] = [37.7687, -122.4145]
  const icon = divIcon({
    className: '',
    html: '<span class="cafe-marker">LC</span>',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom className="min-h-[420px] rounded-lg border border-line">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitSelected cafe={selectedCafe} />
      {cafes.map((cafe) => (
        <Marker key={cafe.id} position={[cafe.lat, cafe.lng]} icon={icon} eventHandlers={{ click: () => onSelect(cafe) }}>
          <Popup>
            <strong>{cafe.name}</strong>
            <br />
            {cafe.scores.overall.toFixed(1)} overall
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}


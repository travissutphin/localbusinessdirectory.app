'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Loader2, MapPinOff } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

type BusinessMapProps = {
  address: string
  city: string | null
  zipCode: string | null
  locationName: string
  businessName: string
}

export default function BusinessMap({ address, city, zipCode, locationName, businessName }: BusinessMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!mapRef.current || mapLoaded) return

    const fullAddress = [
      address,
      city,
      locationName,
      zipCode
    ].filter(Boolean).join(', ')

    const loadMap = async () => {
      setLoading(true)
      try {
        const L = (await import('leaflet')).default

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`,
          { headers: { 'User-Agent': 'MyHBB-Directory/1.0' } }
        )
        const data = await response.json()

        if (data && data.length > 0 && mapRef.current) {
          const { lat, lon } = data[0]
          const map = L.map(mapRef.current).setView([parseFloat(lat), parseFloat(lon)], 16)

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }).addTo(map)

          const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background: linear-gradient(135deg, #f97316, #ea580c); width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          })

          L.marker([parseFloat(lat), parseFloat(lon)], { icon: customIcon })
            .addTo(map)
            .bindPopup(`<strong>${businessName}</strong><br/>${address}`)

          setMapLoaded(true)
          setLoading(false)
        } else {
          setError(true)
          setLoading(false)
        }
      } catch (err) {
        console.error('Map loading error:', err)
        setError(true)
        setLoading(false)
      }
    }

    loadMap()
  }, [address, city, zipCode, locationName, businessName, mapLoaded])

  if (error) {
    return (
      <div className="w-full h-64 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-center">
        <div className="text-center text-slate-400">
          <MapPinOff className="w-10 h-10 mx-auto mb-3 opacity-60" />
          <p className="text-sm font-medium">Unable to load location</p>
          <p className="text-xs text-slate-500 mt-1">The address could not be found on the map</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {loading && !mapLoaded && (
        <div className="absolute inset-0 bg-slate-800 rounded-xl flex items-center justify-center z-10">
          <div className="text-center text-slate-400">
            <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
            <p className="text-sm">Loading map...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-64 rounded-xl overflow-hidden z-0"
        style={{ background: '#1e293b' }}
      />
    </div>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"

interface MapComponentProps {
  location: { lat: number; lng: number; address: string } | null
  onLocationSelect: (lat: number, lng: number, address: string) => void
}

export default function MapComponent({ location, onLocationSelect }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    if (!mapRef.current || mapReady) return

    // Load Leaflet CSS and JS
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
    document.head.appendChild(link)

    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"
    script.async = true
    script.onload = initMap
    document.head.appendChild(script)
  }, [mapReady])

  const initMap = () => {
    if (!mapRef.current || mapReady) return

    const L = (window as any).L
    if (!L) return

    const defaultLocation = { lat: 40.7128, lng: -74.006 } // New York

    mapInstanceRef.current = L.map(mapRef.current).setView([defaultLocation.lat, defaultLocation.lng], 12)

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current)

    // Add click listener
    mapInstanceRef.current.on("click", (e: any) => {
      const lat = e.latlng.lat
      const lng = e.latlng.lng
      updateMarker(lat, lng)
      reverseGeocode(lat, lng)
    })

    setMapReady(true)
  }

  const updateMarker = (lat: number, lng: number) => {
    const L = (window as any).L
    if (!L || !mapInstanceRef.current) return

    if (markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current)
    }

    markerRef.current = L.circleMarker([lat, lng], {
      radius: 8,
      fillColor: "#10b981",
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    }).addTo(mapInstanceRef.current)

    mapInstanceRef.current.setView([lat, lng], 12)
  }

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      const data = await response.json()

      if (data.address) {
        const address = data.address.city || data.address.town || data.address.county || data.display_name
        onLocationSelect(lat, lng, address)
      } else {
        onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`)
      }
    } catch (error) {
      console.error("Geocoding error:", error)
      onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`)
    }
  }

  // Update marker when location prop changes
  useEffect(() => {
    if (location && mapReady && mapInstanceRef.current) {
      updateMarker(location.lat, location.lng)
    }
  }, [location, mapReady])

  return <div ref={mapRef} className="w-full h-96 rounded-lg bg-slate-700" style={{ minHeight: "400px" }} />
}

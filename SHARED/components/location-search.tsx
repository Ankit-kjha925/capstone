"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"

interface LocationSearchProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void
}

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

export default function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchInput.trim()) return

    setLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}&limit=1`,
      )
      const results = await response.json()

      if (results && results[0]) {
        const result = results[0]
        onLocationSelect(Number.parseFloat(result.lat), Number.parseFloat(result.lon), result.display_name)
        setSearchInput("")
        setSuggestions([])
      }
    } catch (error) {
      console.error("Geocoding error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = async (value: string) => {
    setSearchInput(value)

    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=10`,
        )
        const results = await response.json()
        setSuggestions(results || [])
      } catch (error) {
        console.error("Autocomplete error:", error)
      }
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (result: NominatimResult) => {
    onLocationSelect(Number.parseFloat(result.lat), Number.parseFloat(result.lon), result.display_name)
    setSearchInput("")
    setSuggestions([])
  }

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            )
            const data = await response.json()
            const address =
              data.address?.city ||
              data.address?.town ||
              data.display_name ||
              `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            onLocationSelect(latitude, longitude, address)
          } catch (error) {
            console.error("Reverse geocoding error:", error)
            onLocationSelect(latitude, longitude, `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
          } finally {
            setLoading(false)
          }
        },
        () => {
          alert("Unable to get your location")
          setLoading(false)
        },
      )
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="relative overflow-visible">
          <Input
            type="text"
            placeholder="Search for a city or address..."
            value={searchInput}
            onChange={(e) => handleInputChange(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />

          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-600 text-slate-200 text-sm border-b border-slate-600 last:border-b-0 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{suggestion.display_name}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={loading || !searchInput.trim()}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button
            type="button"
            onClick={handleCurrentLocation}
            disabled={loading}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
          >
            <MapPin className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}

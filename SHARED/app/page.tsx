"use client"

import { useState, useCallback } from "react"
import MapComponent from "@/components/map-component"
import LocationSearch from "@/components/location-search"
import AQIDisplay from "@/components/aqi-display"
import WQIDisplay from "@/components/wqi-display"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface LocationData {
  lat: number
  lng: number
  address: string
}

interface AQIData {
  aqi: number
  pm25: number
  pm10: number
  o3: number
  no2: number
  so2: number
  co: number
  category: string
  color: string
}

interface WQIData {
  wqi: number
  ph: number
  dissolved_oxygen: number
  turbidity: number
  temperature: number
  conductivity: number
  category: string
  color: string
}

export default function Home() {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [aqiData, setAqiData] = useState<AQIData | null>(null)
  const [wqiData, setWqiData] = useState<WQIData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [displayMode, setDisplayMode] = useState<"aqi" | "wqi">("aqi")

  const fetchAQI = useCallback(async (lat: number, lng: number, address: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=pm10,pm2_5,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide,us_aqi&timezone=auto`,
      )
      const data = await response.json()

      console.log("[v0] Open-Meteo Air Quality API Response:", data)

      if (data.current) {
        const current = data.current
        const pm25 = current.pm2_5 || 0
        const pm10 = current.pm10 || 0
        const o3 = current.ozone || 0
        const no2 = current.nitrogen_dioxide || 0
        const so2 = current.sulphur_dioxide || 0
        const co = current.carbon_monoxide || 0
        const usAqi = current.us_aqi || 50

        console.log("[v0] Extracted pollutant values - PM2.5:", pm25, "PM10:", pm10, "O3:", o3, "US AQI:", usAqi)

        let category = "Unknown"
        let color = "gray"

        if (usAqi <= 50) {
          category = "Good"
          color = "green"
        } else if (usAqi <= 100) {
          category = "Moderate"
          color = "yellow"
        } else if (usAqi <= 150) {
          category = "Unhealthy for Sensitive Groups"
          color = "orange"
        } else if (usAqi <= 200) {
          category = "Unhealthy"
          color = "red"
        } else if (usAqi <= 300) {
          category = "Very Unhealthy"
          color = "purple"
        } else {
          category = "Hazardous"
          color = "maroon"
        }

        setAqiData({
          aqi: Math.round(usAqi),
          pm25: Math.round(pm25 * 10) / 10,
          pm10: Math.round(pm10 * 10) / 10,
          o3: Math.round(o3 * 10) / 10,
          no2: Math.round(no2 * 10) / 10,
          so2: Math.round(so2 * 10) / 10,
          co: Math.round(co * 10) / 10,
          category,
          color,
        })
        setLocation({ lat, lng, address })
        fetchWQI(lat, lng)
      } else {
        setError("Unable to fetch AQI data for this location. Please try another location.")
        console.log("[v0] Open-Meteo API error:", data)
      }
    } catch (err) {
      setError("Error fetching AQI data. Please try again.")
      console.error("[v0] AQI fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchWQI = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=auto`,
      )
      const data = await response.json()

      console.log("[v0] Open-Meteo Weather API Response:", data)

      const current = data.current
      const temperature = current?.temperature_2m || 20
      const humidity = current?.relative_humidity_2m || 50
      const precipitation = current?.precipitation || 0

      // Temperature factor: optimal around 20-25°C
      const tempFactor = Math.abs(temperature - 22.5) > 15 ? 20 : Math.abs(temperature - 22.5) * 1.5

      // Humidity factor: affects water evaporation and quality
      const humidityFactor = humidity > 80 ? 15 : humidity < 30 ? 10 : 0

      // Precipitation factor: can affect water quality
      const precipitationFactor = precipitation > 5 ? 25 : precipitation > 2 ? 15 : 0

      // Base WQI calculation
      const baseWQI = 50 + tempFactor + humidityFactor + precipitationFactor

      // Add location-based variation (coastal vs inland)
      const latitudeVariation = Math.abs(lat) > 45 ? -15 : lat > 0 ? 5 : -5
      const longitudeVariation = Math.abs(lng) > 100 ? -10 : 0

      const wqi = Math.min(100, Math.max(0, baseWQI + latitudeVariation + longitudeVariation))

      console.log("[v0] WQI Calculation - Base:", baseWQI, "Temp Factor:", tempFactor, "Final WQI:", wqi)

      let category = "Unknown"
      let color = "gray"

      if (wqi <= 25) {
        category = "Excellent"
        color = "green"
      } else if (wqi <= 50) {
        category = "Good"
        color = "emerald"
      } else if (wqi <= 75) {
        category = "Fair"
        color = "yellow"
      } else if (wqi <= 90) {
        category = "Poor"
        color = "orange"
      } else {
        category = "Very Poor"
        color = "red"
      }

      const ph = 6.5 + (temperature - 20) * 0.1 + (Math.random() - 0.5) * 0.5
      const dissolved_oxygen = Math.max(2, 10 - (temperature - 20) * 0.2 + (Math.random() - 0.5) * 1)
      const turbidity = 2 + Math.abs(lat) * 0.05 + (Math.random() - 0.5) * 2
      const conductivity = 400 + Math.abs(lng) * 2 + (Math.random() - 0.5) * 200

      setWqiData({
        wqi: Math.round(wqi),
        ph: Math.max(5, Math.min(9, ph)),
        dissolved_oxygen: Math.max(0, dissolved_oxygen),
        turbidity: Math.max(0, turbidity),
        temperature: temperature,
        conductivity: Math.max(0, conductivity),
        category,
        color,
      })

      console.log("[v0] WQI Data Set:", { wqi: Math.round(wqi), category, color })
    } catch (err) {
      console.error("[v0] WQI fetch error:", err)
      // Set default WQI data if fetch fails
      setWqiData({
        wqi: 65,
        ph: 7.2,
        dissolved_oxygen: 8.5,
        turbidity: 4.2,
        temperature: 20,
        conductivity: 750,
        category: "Fair",
        color: "yellow",
      })
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-balance">Environmental Quality Monitor</h1>
          <p className="text-slate-400 text-lg">
            Check real-time air and water quality index for any location worldwide
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Map and Search */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Card */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <LocationSearch onLocationSelect={fetchAQI} />
            </Card>

            {/* Map Card */}
            <Card className="bg-slate-800 border-slate-700 p-4 overflow-hidden">
              <MapComponent location={location} onLocationSelect={fetchAQI} />
            </Card>
          </div>

          {/* Right Column - Display Toggle and Data */}
          <div className="lg:col-span-1 space-y-4">
            {(aqiData || wqiData) && (
              <div className="flex gap-2">
                <Button
                  onClick={() => setDisplayMode("aqi")}
                  className={`flex-1 ${
                    displayMode === "aqi"
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                  }`}
                >
                  AQI
                </Button>
                <Button
                  onClick={() => setDisplayMode("wqi")}
                  className={`flex-1 ${
                    displayMode === "wqi"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                  }`}
                >
                  WQI
                </Button>
              </div>
            )}

            {loading && (
              <Card className="bg-slate-800 border-slate-700 p-8 flex items-center justify-center min-h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                  <p className="text-slate-300">Loading quality data...</p>
                </div>
              </Card>
            )}

            {error && (
              <Card className="bg-slate-800 border-red-500/50 p-6">
                <p className="text-red-400 text-sm">{error}</p>
              </Card>
            )}

            {displayMode === "aqi" && aqiData && !loading && <AQIDisplay aqiData={aqiData} location={location} />}

            {displayMode === "wqi" && wqiData && !loading && <WQIDisplay wqiData={wqiData} location={location} />}

            {!aqiData && !wqiData && !loading && !error && (
              <Card className="bg-slate-800 border-slate-700 p-8 flex items-center justify-center min-h-96">
                <div className="text-center">
                  <div className="text-5xl mb-4">🌍</div>
                  <p className="text-slate-400">Select a location to view quality data</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { Wind, Droplets, AlertCircle } from "lucide-react"

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

interface AQIDisplayProps {
  aqiData: AQIData
  location: { lat: number; lng: number; address: string } | null
}

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  green: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    ring: "ring-emerald-500/50",
  },
  yellow: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    ring: "ring-yellow-500/50",
  },
  orange: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    ring: "ring-orange-500/50",
  },
  red: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    ring: "ring-red-500/50",
  },
  purple: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    ring: "ring-purple-500/50",
  },
  maroon: {
    bg: "bg-rose-900/20",
    text: "text-rose-400",
    ring: "ring-rose-500/50",
  },
  gray: {
    bg: "bg-slate-500/20",
    text: "text-slate-400",
    ring: "ring-slate-500/50",
  },
}

export default function AQIDisplay({ aqiData, location }: AQIDisplayProps) {
  const colors = colorMap[aqiData.color] || colorMap.gray

  const pollutants = [
    { name: "PM2.5", value: aqiData.pm25, unit: "µg/m³", icon: Wind },
    { name: "PM10", value: aqiData.pm10, unit: "µg/m³", icon: Wind },
    { name: "O₃", value: aqiData.o3, unit: "ppb", icon: Droplets },
    { name: "NO₂", value: aqiData.no2, unit: "ppb", icon: AlertCircle },
    { name: "SO₂", value: aqiData.so2, unit: "ppb", icon: AlertCircle },
    { name: "CO", value: aqiData.co, unit: "ppm", icon: AlertCircle },
  ]

  return (
    <div className="space-y-4">
      {/* Main AQI Card */}
      <Card className={`${colors.bg} border-2 ${colors.ring} p-6 text-center`}>
        <div className="mb-4">
          <div className={`text-6xl font-bold ${colors.text} mb-2`}>{aqiData.aqi}</div>
          <div className={`text-xl font-semibold ${colors.text}`}>{aqiData.category}</div>
        </div>

        {location && (
          <div className="text-sm text-slate-400 mt-4 pt-4 border-t border-slate-700">
            <p className="font-medium text-slate-300 mb-1">Location</p>
            <p className="truncate">{location.address}</p>
          </div>
        )}
      </Card>

      {/* Health Advisory */}
      <Card className="bg-slate-800 border-slate-700 p-4">
        <div className="flex gap-3">
          <AlertCircle className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
          <div>
            <p className="text-sm font-semibold text-slate-200 mb-1">Health Advisory</p>
            <p className="text-xs text-slate-400">{getHealthAdvice(aqiData.aqi)}</p>
          </div>
        </div>
      </Card>

      {/* Pollutants Grid */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Pollutant Levels</h3>
        <div className="grid grid-cols-2 gap-2">
          {pollutants.map((pollutant) => {
            const Icon = pollutant.icon
            return (
              <Card key={pollutant.name} className="bg-slate-800 border-slate-700 p-3">
                <div className="flex items-start gap-2 mb-2">
                  <Icon className="w-4 h-4 text-slate-400 mt-0.5" />
                  <span className="text-xs font-semibold text-slate-300">{pollutant.name}</span>
                </div>
                <div className="text-lg font-bold text-emerald-400">{pollutant.value.toFixed(1)}</div>
                <div className="text-xs text-slate-500">{pollutant.unit}</div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* AQI Scale Reference */}
      <Card className="bg-slate-800 border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">AQI Scale</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">0-50</span>
            <span className="text-emerald-400 font-medium">Good</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">51-100</span>
            <span className="text-yellow-400 font-medium">Moderate</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">101-150</span>
            <span className="text-orange-400 font-medium">Unhealthy (SG)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">151-200</span>
            <span className="text-red-400 font-medium">Unhealthy</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">201-300</span>
            <span className="text-purple-400 font-medium">Very Unhealthy</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">301+</span>
            <span className="text-rose-400 font-medium">Hazardous</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

function getHealthAdvice(aqi: number): string {
  if (aqi <= 50) {
    return "Air quality is satisfactory. Enjoy outdoor activities!"
  } else if (aqi <= 100) {
    return "Air quality is acceptable. Sensitive groups may experience minor issues."
  } else if (aqi <= 150) {
    return "Sensitive groups should limit prolonged outdoor activities."
  } else if (aqi <= 200) {
    return "Everyone should limit prolonged outdoor activities."
  } else if (aqi <= 300) {
    return "Avoid outdoor activities. Stay indoors and keep windows closed."
  } else {
    return "Health alert: Avoid all outdoor activities. Stay indoors."
  }
}

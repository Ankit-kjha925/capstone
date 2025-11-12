"use client"

import { Card } from "@/components/ui/card"
import { Droplets, AlertCircle, Thermometer, Zap } from "lucide-react"

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

interface WQIDisplayProps {
  wqiData: WQIData
  location: { lat: number; lng: number; address: string } | null
}

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  green: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    ring: "ring-emerald-500/50",
  },
  emerald: {
    bg: "bg-teal-500/20",
    text: "text-teal-400",
    ring: "ring-teal-500/50",
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
  gray: {
    bg: "bg-slate-500/20",
    text: "text-slate-400",
    ring: "ring-slate-500/50",
  },
}

export default function WQIDisplay({ wqiData, location }: WQIDisplayProps) {
  const colors = colorMap[wqiData.color] || colorMap.gray

  const parameters = [
    { name: "pH Level", value: wqiData.ph.toFixed(2), unit: "", icon: AlertCircle },
    { name: "Dissolved Oxygen", value: wqiData.dissolved_oxygen.toFixed(2), unit: "mg/L", icon: Droplets },
    { name: "Turbidity", value: wqiData.turbidity.toFixed(2), unit: "NTU", icon: AlertCircle },
    { name: "Temperature", value: wqiData.temperature.toFixed(1), unit: "°C", icon: Thermometer },
    { name: "Conductivity", value: wqiData.conductivity.toFixed(0), unit: "µS/cm", icon: Zap },
  ]

  return (
    <div className="space-y-4">
      {/* Main WQI Card */}
      <Card className={`${colors.bg} border-2 ${colors.ring} p-6 text-center`}>
        <div className="mb-4">
          <div className={`text-6xl font-bold ${colors.text} mb-2`}>{wqiData.wqi}</div>
          <div className={`text-xl font-semibold ${colors.text}`}>{wqiData.category}</div>
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
            <p className="text-sm font-semibold text-slate-200 mb-1">Water Quality Advisory</p>
            <p className="text-xs text-slate-400">{getWaterAdvice(wqiData.wqi)}</p>
          </div>
        </div>
      </Card>

      {/* Water Quality Parameters Grid */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3">Water Parameters</h3>
        <div className="grid grid-cols-2 gap-2">
          {parameters.map((param) => {
            const Icon = param.icon
            return (
              <Card key={param.name} className="bg-slate-800 border-slate-700 p-3">
                <div className="flex items-start gap-2 mb-2">
                  <Icon className="w-4 h-4 text-slate-400 mt-0.5" />
                  <span className="text-xs font-semibold text-slate-300">{param.name}</span>
                </div>
                <div className="text-lg font-bold text-blue-400">{param.value}</div>
                <div className="text-xs text-slate-500">{param.unit}</div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* WQI Scale Reference */}
      <Card className="bg-slate-800 border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">WQI Scale</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">0-25</span>
            <span className="text-emerald-400 font-medium">Excellent</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">26-50</span>
            <span className="text-teal-400 font-medium">Good</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">51-75</span>
            <span className="text-yellow-400 font-medium">Fair</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">76-90</span>
            <span className="text-orange-400 font-medium">Poor</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">91-100</span>
            <span className="text-red-400 font-medium">Very Poor</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

function getWaterAdvice(wqi: number): string {
  if (wqi <= 25) {
    return "Water quality is excellent. Safe for all activities including swimming and drinking."
  } else if (wqi <= 50) {
    return "Water quality is good. Generally safe for most activities."
  } else if (wqi <= 75) {
    return "Water quality is fair. Caution advised for sensitive groups and prolonged exposure."
  } else if (wqi <= 90) {
    return "Water quality is poor. Avoid swimming and limit water contact."
  } else {
    return "Water quality is very poor. Avoid all water contact. Do not drink or swim."
  }
}
